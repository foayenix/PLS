import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { planQuestion, type TutorPlan } from '@/lib/tutor';

const noStore = { 'Cache-Control': 'no-store' };
const textFields = ['title', 'concept', 'exercise', 'hint', 'check'] as const;
const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ...Object.fromEntries(textFields.map(key => [key, { type: 'string' }])),
    criteria: { type: 'array', items: { type: 'string' } },
  },
  required: [...textFields, 'criteria'],
};
const tutorInstructions = [
  'Draft a guided study exercise for an adult learner in AI engineering, software or civilian robotics.',
  'Treat the question as a topic. Give one concise concept, a small runnable or observable exercise, an optional hint, and one recall question.',
  'Ask the learner to predict and test. Give three self-check criteria. Keep each field concise.',
  'Use synthetic data and simulation where appropriate. Avoid full solutions, running code, external links and invented references.',
  'Decline unsafe requests. Return only a study plan in the specified structure.',
].join(' ');

function modelProvider(request: Request) {
  const local = import.meta.env.DEV && !env.FIELDWORK_HOST && ['localhost', '127.0.0.1', '[::1]'].includes(new URL(request.url).hostname);
  if (local && env.FIELDWORK_OLLAMA_MODEL) return { name: 'ollama', model: env.FIELDWORK_OLLAMA_MODEL } as const;
  if (env.OPENAI_API_KEY && env.FIELDWORK_OPENAI_MODEL) return { name: 'openai', model: env.FIELDWORK_OPENAI_MODEL, key: env.OPENAI_API_KEY } as const;
  return null;
}

type Provider = NonNullable<ReturnType<typeof modelProvider>>;
const authorized = async (provider: Provider) => provider.name === 'ollama' || Boolean(await getChatGPTUser());

export async function GET(request: Request) {
  const provider = modelProvider(request);
  return Response.json({ provider: provider && await authorized(provider) ? provider.name : null }, { headers: noStore });
}

function parsePlan(raw: string, base: TutorPlan): TutorPlan {
  const fields = JSON.parse(raw);
  const validText = (value: unknown, limit: number): value is string => typeof value === 'string' && Boolean(value.trim()) && value.length <= limit;
  for (const key of textFields) {
    if (!validText(fields?.[key], key === 'title' ? 120 : 1200)) throw new Error('Invalid tutor plan');
  }
  if (!Array.isArray(fields.criteria) || fields.criteria.length !== 3 || fields.criteria.some((value: unknown) => !validText(value, 350))) {
    throw new Error('Invalid rubric');
  }
  const { title, concept, exercise, hint, check, criteria } = fields;
  return { ...base, title, concept, exercise, hint, check, criteria, origin: 'model' };
}

async function generate(provider: Provider, question: string, base: TutorPlan, signal: AbortSignal) {
  const input = JSON.stringify({ question, lessonTitles: base.lessons.map(lesson => lesson.title) });
  const local = provider.name === 'ollama';
  const payload = local ? {
    model: provider.model, stream: false, format: schema, options: { temperature: 0.2, num_predict: 1400 },
    messages: [{ role: 'system', content: tutorInstructions }, { role: 'user', content: input }],
  } : {
    model: provider.model, instructions: tutorInstructions, input, store: false, max_output_tokens: 1600,
    text: { format: { type: 'json_schema', name: 'fieldwork_study_plan', strict: true, schema } },
  };
  const target = local ? 'http://127.0.0.1:11434/api/chat' : 'https://api.openai.com/v1/responses';
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (provider.name === 'openai') headers.set('Authorization', 'Bearer ' + provider.key);
  const response = await fetch(target, { method: 'POST', headers, body: JSON.stringify(payload), signal, redirect: 'error' });
  if (!response.ok) throw new Error('Tutor provider unavailable');
  const result = await response.json<{
    message?: { content?: string };
    output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
  }>();
  const raw = local ? result.message?.content : result.output?.filter(item => item.type === 'message').flatMap(item => item.content ?? []).find(item => item.type === 'output_text')?.text;
  if (!raw) throw new Error('Tutor plan unavailable');
  return parsePlan(raw, base);
}

export async function POST(request: Request) {
  const failure = (error: string, status: number) => Response.json({ error }, { status, headers: noStore });
  if (request.headers.get('origin') !== new URL(request.url).origin) return failure('Use the Study Tutor to request a plan.', 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return failure('Expected a JSON request.', 415);
  const provider = modelProvider(request);
  if (!provider) return failure('Model assistance is unavailable.', 503);
  if (!await authorized(provider)) return failure('Sign in to use model assistance.', 401);
  let question: string;
  try {
    if (Number(request.headers.get('content-length')) > 4096) return failure('Question is too long.', 413);
    const body = await request.text();
    if (body.length > 4096) return failure('Question is too long.', 413);
    const data = JSON.parse(body);
    question = typeof data?.question === 'string' ? data.question.trim() : '';
    if (question.length < 3 || question.length > 500) return failure('Write a question between 3 and 500 characters.', 400);
  } catch {
    return failure('Expected a valid question.', 400);
  }
  try {
    const plan = await generate(provider, question, planQuestion(question), AbortSignal.any([request.signal, AbortSignal.timeout(45000)]));
    return Response.json({ plan }, { headers: noStore });
  } catch {
    return failure('Could not generate a plan. Your Fieldwork study plan is still available.', 502);
  }
}
