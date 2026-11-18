export const careerSources = {
  foundry: {
    title: 'Microsoft Applied Skills · Develop an agent with integrated tools',
    url: 'https://learn.microsoft.com/en-us/credentials/applied-skills/develop-an-agent-with-integrated-tools/',
  },
  fundamentals: {
    title: 'AI-901 · Azure AI Fundamentals',
    url: 'https://learn.microsoft.com/en-gb/credentials/certifications/exams/ai-901/',
  },
  associate: {
    title: 'AI-103 · Azure AI Apps and Agents Developer Associate',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/',
  },
  evaluation: {
    title: 'Microsoft Foundry · Agent evaluation',
    url: 'https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators',
  },
  analysis: {
    title: 'BCS · Foundation Certificate in Business Analysis',
    url: 'https://www.bcs.org/qualifications-and-certifications/certifications-for-professionals/business-analysis/foundation-certificate-in-business-analysis/',
  },
  delivery: {
    title: 'UK Government · Business analyst capability framework',
    url: 'https://understand-digital-data-roles-skills.service.gov.uk/role/business-analyst/',
  },
};

export const roadmap = [
  { id: 'baseline', title: 'Own the Python baseline', focus: 'Validate inputs, reconcile records and test edge cases. Use your credit-control workflow to map the current process and compare a rules-only baseline with assisted review.', evidence: 'Runnable repo, process map and tests for duplicate, missing and partial payments.', project: 'invoice-mismatch' },
  { id: 'requirements', title: 'Define the workflow', focus: 'Write a problem brief, five user stories, acceptance criteria and a small RAID log. Define what the assistant reads, where a reviewer decides and how you will measure usefulness.', evidence: 'Proposed process, acceptance criteria, escalation decision table and pilot scope.', project: 'payment-exceptions' },
  { id: 'retrieval', title: 'Build the retrieval and tools', focus: 'Use Ed Donner’s Core and Agentic lessons while building. Retrieve policy excerpts, add a read-only ledger tool and validate the structured response in Python.', evidence: 'Policy citations, tool traces and reproducible handling of ambiguous references.', project: 'payment-exceptions' },
  { id: 'cloud', title: 'Connect Azure and practise operations', focus: 'Build a Microsoft Foundry agent with one custom tool, exercise its failure path and record what is visible in traces. Use the same identity, logs and storage concepts when revisiting AWS.', evidence: 'Deployable demo or recorded Azure lab, trace and short deployment runbook.', project: 'payment-exceptions' },
  { id: 'evaluation', title: 'Evaluate and run UAT', focus: 'Freeze a labelled dataset, run a baseline and candidate on identical cases, and have someone try five scenarios. Add timeouts, review gates and a rerunnable regression test.', evidence: 'Evaluation report, UAT notes, examples of failures and the follow-up decision.', project: 'payment-exceptions' },
  { id: 'handover', title: 'Show the work and interview', focus: 'Rebuild one slice without AI, give a five-minute walkthrough and answer a timed coding and system design prompt. Add a synthetic Sanko voice-intake walkthrough as your second case study.', evidence: 'Project demo, handover notes, interview rubric and tailored CV evidence.', project: 'sanko-correction-ledger' },
] as const;

export const drills = [
  {
    id: 'python', type: 'Coding', title: 'Reconcile partial payments', minutes: 30, project: 'invoice-mismatch',
    prompt: 'Use Python to match payment records to invoices using invoice ID and amount in integer pence. Implement an explicit result for exact, partial, unknown and ambiguous cases. Talk through the API and tests while you code.',
    example: 'Invoices A £100.00 and B £50.00. A payment of £40.00 against A must leave £60.00 open. Add a duplicate invoice reference and a repeated payment event.',
    rubric: ['A small deterministic function with a clearly defined input and return type.', 'Tests for no match, partial payment, duplicate references and repeat events.', 'Clear handling of invalid input, complexity and the assumptions you made.'],
  },
  {
    id: 'debugging', type: 'Debugging', title: 'A tool times out during case review', minutes: 25, project: 'payment-exceptions',
    prompt: 'The ledger lookup sometimes times out and the assistant still drafts an allocation. Reproduce the failure with a stub, inspect the trace and demonstrate a fix.',
    example: 'Compare a blank result, a timeout and a successful lookup with zero candidates. The business response should distinguish all three.',
    rubric: ['Reproduce the original problem before changing code.', 'Use a bounded retry for a transient read and return a review state when lookup fails.', 'Show a passing regression test and a useful log without including sensitive records.'],
  },
  {
    id: 'design', type: 'System design', title: 'Design a payment exceptions assistant', minutes: 40, project: 'payment-exceptions',
    prompt: 'Sketch a system that can explain payment exceptions from a ledger and a policy document. Split retrieval, tool use, review and monitoring. Explain the smallest deliverable you would ship first.',
    example: 'The retrieved policy conflicts with a ledger note and a tool responds slowly. Decide when to stop, what to log and how to hand off the case.',
    rubric: ['State assumptions, boundaries, dependencies and what can be deterministic.', 'Show where permission and approval are enforced and what happens on a failed read.', 'Define labelled evaluation cases, success thresholds, latency and a deployment plan.'],
  },
  {
    id: 'eval', type: 'Evaluation', title: 'Find the regression behind a better score', minutes: 30, project: 'retrieval',
    prompt: 'The new version cites more sources and gets a higher overall score but misses several mandatory escalations. Decide whether it can ship and show how you would improve the evaluation.',
    example: 'Compare two versions on the same labelled cases. Split policy support, correct status, escalations, latency and cost. Include counts and denominators.',
    rubric: ['Separate retrieval support, task success and policy compliance.', 'Treat a missed mandatory escalation as a release-blocking defect in this exercise.', 'Explain the next isolated change and what would need to pass before rollout.'],
  },
  {
    id: 'contract', type: 'Client scenario', title: 'Turn a stakeholder request into UAT', minutes: 30, project: 'payment-exceptions',
    prompt: 'A finance lead asks for an agent that will automatically resolve payment exceptions. Run a short discovery conversation, propose a limited pilot and draft three UAT scenarios.',
    example: 'The controller wants faster resolution. The reviewer needs a clear audit trail and the business owner will approve the pilot.',
    rubric: ['Clarify the goal, exception types, policy owner, baseline and decision rights.', 'Write measurable acceptance criteria and explicitly handle an ambiguous reference.', 'Explain who signs off, what dependencies remain and what you will learn from the pilot.'],
  },
  {
    id: 'sanko', type: 'Project walkthrough', title: 'Explain a Sanko intake failure', minutes: 15, project: 'sanko-correction-ledger',
    prompt: 'Give a five-minute walkthrough of a synthetic WhatsApp intake from audio to structured record. Choose one failure, show how you diagnosed it and explain what you changed.',
    example: 'The transcript omits a field or a term is unclear. Show provenance, the review decision and how a correction is stored.',
    rubric: ['Identify your specific contribution and one trade-off.', 'Use an actual trace, labelled test or demo recording to support the explanation.', 'Name the limitations, how you measure field accuracy and the next improvement.'],
  },
] as const;

export type RequirementStatus = 'gap' | 'practice' | 'evidence';
export type RoleRequirement = { text: string; status: RequirementStatus; evidence: string; priority?: 'essential' | 'desirable' };

export const roleTemplates = [
  { id: 'automation', label: 'AI Automation Engineer', requirements: [
    'Map a business workflow and choose measurable automation outcomes',
    'Build and maintain a workflow in an automation platform',
    'Integrate REST APIs, webhooks, JSON and a database with scoped credentials',
    'Write and test the integration logic in Python or TypeScript',
    'Validate model outputs and route uncertain actions for human review',
    'Handle repeat delivery and failures with monitoring, safe retries and replay',
    'Show one end-to-end deployment, runbook and evidence of usefulness',
  ] },
  { id: 'engineering', label: 'Applied AI Engineer', requirements: [
    'Develop a tested Python or TypeScript service with a documented API',
    'Implement structured output, tool use and retrieval where useful',
    'Evaluate quality, cost, latency and failure scenarios',
    'Test access controls and deploy with logging and monitoring',
    'Explain architecture, trade-offs and ownership in a project walkthrough',
  ] },
  { id: 'consulting', label: 'AI Solutions Consultant', requirements: [
    'Run stakeholder discovery and identify a use case with measurable value',
    'Explain the client workflow, domain terminology and escalation boundaries',
    'Prototype an AI solution with defined data flows, guardrails and human review',
    'Define evaluation criteria, run a pilot and communicate limitations',
    'Write delivery milestones, risks, dependencies and handover notes',
  ] },
  { id: 'analysis', label: 'Technical Business Analyst', requirements: [
    'Map the current and proposed process and clarify stakeholder responsibilities',
    'Write requirements, user stories and measurable acceptance criteria',
    'Translate the business problem into technical and operational requirements',
    'Plan UAT, trace requirements to test cases and document decisions',
    'Manage change, RAID and handover across business and technical teams',
  ] },
];

export const studyBlocks = [
  { day: 'Monday', slots: '06:00–08:00 · 12:00–14:00 · 19:00–22:00', hours: 7 },
  { day: 'Tuesday', slots: '06:00–08:00 · 20:00–22:00', hours: 4 },
  { day: 'Wednesday', slots: '06:00–08:00 · 20:00–22:00', hours: 4 },
  { day: 'Thursday', slots: '06:00–08:00 · 20:00–22:00', hours: 4 },
  { day: 'Friday', slots: '06:00–08:00 · 12:00–14:00 · 17:30–18:30', hours: 5 },
  { day: 'Saturday', slots: '09:00–12:00 · 15:00–18:00 or 18:00–21:00', hours: 6 },
  { day: 'Sunday', slots: '09:00–12:00 · 14:00–17:00 · 19:00–22:00', hours: 9 },
];

export const coursePlan = [
  { id: 'oberleiter', track: 'AI', title: 'AI Agents · Arnold Oberleiter', minutes: 630, progress: 1 },
  { id: 'donner-core', track: 'AI', title: 'AI Engineer Core Track · Ed Donner', minutes: 2010, progress: 0 },
  { id: 'donner-agentic', track: 'AI', title: 'AI Engineer Agentic Track · Ed Donner', minutes: 1260, progress: 0 },
  { id: 'maarek', track: 'Cloud', title: 'AWS Solutions Architect Associate · Stéphane Maarek', minutes: 1645, progress: 26 },
  { id: 'ahmed', track: 'AI', title: 'LLM Engineering Masterclass · Ryan Ahmed', minutes: 1440, progress: 0 },
  { id: 'colomer', track: 'AI', title: 'Generative AI Bootcamp · Julio Colomer', minutes: 4890, progress: 15 },
  { id: 'max-flutter', track: 'Other', title: 'Flutter & Dart · Maximilian Schwarzmüller', minutes: 1803, progress: 0 },
  { id: 'yu-flutter', track: 'Other', title: 'Flutter Development Bootcamp · Angela Yu', minutes: 1728, progress: 4 },
  { id: 'financial', track: 'Other', title: 'Financial Analyst · 365 Careers', minutes: 1345, progress: 0 },
  { id: 'marketing', track: 'Other', title: 'Growth Hacking · Davis Jones', minutes: 496, progress: 4 },
  { id: 'herbalism', track: 'Other', title: 'Herbalism and Medicine Making · Elizabeth Heck', minutes: 236, progress: 0 },
] as const;

export const defaultPlan = { start: '2026-12-01', hours: 30, practice: 30 };

export function finishDate(start: string, weeklyHours: number, minutes: number) {
  if (minutes <= 0) return null;
  const day = new Date(start + 'T00:00:00Z');
  if (Number.isNaN(day.getTime()) || weeklyHours < 1) return null;
  let freeInWeek = weeklyHours * 60;
  for (let days = 0; days < 3700; days += 1) {
    const weekday = (day.getUTCDay() + 6) % 7;
    if (weekday === 0) freeInWeek = weeklyHours * 60;
    const available = Math.min(freeInWeek, studyBlocks[weekday].hours * 60);
    if (minutes <= available) return day.toISOString().slice(0, 10);
    minutes -= available;
    freeInWeek -= available;
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return null;
}

export function formatPlanDate(value: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', ...options, timeZone: 'UTC',
  }).format(new Date(value + 'T00:00:00Z'));
}
