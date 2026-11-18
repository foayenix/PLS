export const syllabi = {
  oberleiter: {
    title: 'AI Agents · Arnold Oberleiter',
    url: 'https://www.udemy.com/course/ai-agents-automation-business-with-langchain-llm-apps/',
    groups: [[1, 'Orientation'], [8, 'Agent concepts, tools and APIs'], [16, 'Flowise and agent examples'], [31, 'Retrieval and data preparation'], [37, 'API automation, hosting and client delivery'], [53, 'Local assistants and open models'], [71, 'Security and wrap-up']],
  },
  'donner-core': {
    title: 'AI Engineer Core Track · Ed Donner',
    url: 'https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/',
    groups: [[1, 'Week 1 · Foundations and first projects'], [38, 'Week 2 · Frontier APIs and tool use'], [62, 'Week 3 · Open models and multimodal apps'], [85, 'Week 4 · Model selection and evaluation'], [106, 'Week 5 · Retrieval and RAG evaluation'], [138, 'Week 6 · Training and baselines'], [165, 'Week 7 · QLoRA and fine-tuning'], [189, 'Week 8 · Deployment and agents']],
  },
  'donner-agentic': {
    title: 'AI Engineer Agentic Track · Ed Donner',
    url: 'https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/',
    groups: [[1, 'Week 1 · n8n demo, tools and agent patterns'], [29, 'Week 2 · OpenAI Agents SDK'], [50, 'Week 3 · CrewAI'], [69, 'Week 4 · LangGraph, persistence and human review'], [92, 'Week 5 · Alternative frameworks'], [109, 'Week 6 · MCP, evaluation and deployment']],
  },
  ahmed: {
    title: 'LLM Engineering Masterclass · Ryan Ahmed',
    url: 'https://www.udemy.com/course/become-an-llm-agentic-ai-engineer-14-day-bootcamp-2025/',
    groups: [[1, 'LLM APIs, vision and interfaces'], [71, 'Open models and reasoning'], [118, 'LangChain retrieval'], [140, 'Typed outputs and application projects'], [166, 'Fine-tuning'], [186, 'AutoGen and LangGraph'], [232, 'ML and agent projects'], [271, 'n8n integrations and structured output'], [287, 'MCP and hands-on labs']],
  },
  colomer: {
    title: 'Generative AI Bootcamp · Julio Colomer',
    url: 'https://www.udemy.com/course/bootcamp-generative-artificial-intelligence-and-llm-app-development/',
    groups: [[1, 'Orientation and AI use cases'], [120, 'Programming, models and libraries'], [171, 'LangChain apps and agents'], [211, 'Data retrieval and vector stores'], [250, 'Framework updates and practice apps'], [340, 'Full-stack applications and storage'], [411, 'Evaluation and LangSmith'], [469, 'Multimodal and document workflows'], [545, 'Agents and orchestration'], [637, 'AI coding tools and app building'], [741, 'SaaS and course wrap-up']],
  },
} as const;

export type SyllabusId = keyof typeof syllabi;
export type SyllabusLecture = { number: number; title: string; minutes: number | null; completed?: boolean };

export function isSyllabusCourse(id: string): id is SyllabusId {
  return Object.hasOwn(syllabi, id);
}

export type SyllabusSelection = { course: SyllabusId; label: string; lectures: number[] };

export type LearningStage = {
  id: string;
  title: string;
  instruction: string;
  checkpoint: string;
  primary?: SyllabusSelection & { minutes: number };
  extra?: SyllabusSelection;
  lesson: string;
  project: string;
};

export const learningPath: LearningStage[] = [
  {
    id: 'python',
    title: 'Set up and own the Python calls',
    checkpoint: 'You can run a small Python script from a clean environment, explain its inputs and test a valid response and a failed call.',
    instruction: 'Make one model call from a clean environment and write a test that checks the response shape. Practise it once without the course code.',
    primary: { course: 'donner-core', label: 'Core Track', lectures: [4, 8, 10, 12], minutes: 36 },
    lesson: 'phases/00-setup-and-tooling/13-python-for-ai-engineering', project: 'python',
  },
  {
    id: 'workflow',
    title: 'Build a small automation first',
    checkpoint: 'You can send the same event twice, show one draft in storage and trace a failed lookup to the review queue.',
    instruction: 'Build a toy n8n workflow and then connect your own mock webhook and account lookup. Handle a repeated event before adding any AI.',
    primary: { course: 'ahmed', label: 'Ahmed · n8n', lectures: [271, 272, 279, 282], minutes: 49 },
    extra: { course: 'donner-agentic', label: 'Agentic Track · n8n demo', lectures: [1] },
    lesson: 'phases/13-tools-and-protocols/01-the-tool-interface', project: 'automation-support-triage',
  },
  {
    id: 'structured',
    title: 'Validate what the model returns',
    checkpoint: 'You can explain the schema, reject a malformed response and compare your model with rules using the same labelled examples.',
    instruction: 'Compare typed output with a rules baseline. Record successful routing, malformed output and when an operator should review the case.',
    primary: { course: 'ahmed', label: 'Ahmed · Pydantic', lectures: [141, 143, 144, 146], minutes: 27 },
    extra: { course: 'donner-agentic', label: 'Agentic Track · schemas', lectures: [41, 42] },
    lesson: 'phases/11-llm-engineering/03-structured-outputs', project: 'automation-support-triage',
  },
  {
    id: 'tools',
    title: 'Add a bounded tool and review step',
    checkpoint: 'You can show the read-only tool trace, then demonstrate an ambiguous result that requires human approval.',
    instruction: 'Use a read-only ledger lookup and a clear escalation rule. Demonstrate the result when the ledger returns two matches or times out.',
    primary: { course: 'donner-agentic', label: 'Agentic Track · LangGraph and review', lectures: [18, 71, 73, 75, 88], minutes: 51 },
    extra: { course: 'oberleiter', label: 'Oberleiter · APIs and tools', lectures: [11, 14, 26] },
    lesson: 'phases/14-agent-engineering/38-verification-gates', project: 'payment-exceptions',
  },
  {
    id: 'retrieval',
    title: 'Build and measure retrieval',
    checkpoint: 'You can run a fixed query set and explain one retrieval miss and whether the generated answer was grounded in the source.',
    instruction: 'Use the same labelled queries for two retrieval approaches. Compare per-query results and separately check support for the final answer.',
    primary: { course: 'donner-core', label: 'Core Track · RAG and evaluation', lectures: [106, 117, 120, 122, 123, 125, 127], minutes: 72 },
    extra: { course: 'ahmed', label: 'Ahmed · retrieval lab', lectures: [118, 130, 133] },
    lesson: 'phases/11-llm-engineering/06-rag', project: 'retrieval',
  },
  {
    id: 'reliability',
    title: 'Debug, evaluate and hand over',
    checkpoint: 'You can recover a simulated failed integration without a duplicate write and show how another person would use your runbook.',
    instruction: 'Capture a trace for a failed update, recover it without a duplicate write and compare results with your test expectations. Keep a short runbook.',
    primary: { course: 'donner-agentic', label: 'Agentic Track · traces and evaluation', lectures: [11, 30, 31, 127, 129], minutes: 53 },
    extra: { course: 'colomer', label: 'Colomer · reproducibility and beta testing', lectures: [412, 413, 427, 428] },
    lesson: 'phases/17-infrastructure-and-production/13-llm-observability', project: 'automation-booking-sync',
  },
  {
  id: 'ship',
  title: 'Ship and defend your work',
  instruction: 'Deploy one of your workflows and keep the repo, a short demo, an evaluation report and a recovery runbook. Use the interview drills to rehearse how it works and what you would improve.',
  checkpoint: 'You can demo a deployed workflow, reproduce the tests, explain one trade-off and show a measured result or a clearly labelled simulation.',
  lesson: 'phases/11-llm-engineering/13-production-app',
  project: 'release',
  },
];

export const learningOverlap = [
  { topic: 'Model APIs and prompting', primary: 'Ed Donner Core Track', overlap: 'Ahmed’s early API demos, Oberleiter’s LLM intro and Colomer’s programming and prompt fundamentals.' },
  { topic: 'n8n and webhooks', primary: 'Ahmed’s n8n module', overlap: 'Donner’s n8n lesson is a short preview. Oberleiter’s Flowise and Make demos teach similar workflow concepts on other platforms.' },
  { topic: 'Structured outputs and validation', primary: 'Ahmed’s Pydantic lessons', overlap: 'Donner’s Agentic Track repeats schema concepts. Use it when you need to connect a schema to agent tools.' },
  { topic: 'Tools, graphs and human review', primary: 'Donner Agentic Track', overlap: 'Ahmed, Oberleiter and Colomer revisit tool calling or agent orchestration. Pick one framework before comparing alternatives.' },
  { topic: 'RAG, embeddings and retrieval evaluation', primary: 'Donner Core Track, week 5', overlap: 'Ahmed’s retrieval lab, Oberleiter’s document preparation and Colomer’s RAG sections revisit the building blocks.' },
  { topic: 'Agent evaluation and tracing', primary: 'Donner Agentic Track', overlap: 'Use Colomer’s LangSmith sections when you want platform-specific detail or another way to debug a workflow.' },
  { topic: 'Fine-tuning and framework breadth', primary: 'Keep for a project that calls for it', overlap: 'Core Track and Ahmed both cover fine-tuning. Explore extra frameworks when a role asks for them or your current toolkit has a gap.' },
];
