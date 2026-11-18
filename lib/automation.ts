export const automationReferences = {
  webhook: { title: 'n8n · Webhook node', url: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/' },
  errors: { title: 'n8n · Error workflows', url: 'https://docs.n8n.io/flow-logic/error-handling/' },
  powerAutomate: { title: 'Microsoft Learn · Solution-aware cloud flows', url: 'https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/understand-benefits-solution-aware-flows' },
  cloudFlowErrors: { title: 'Microsoft Learn · Troubleshoot cloud flow errors', url: 'https://learn.microsoft.com/en-us/power-automate/troubleshoot-flow-errors' },
};

export const automationVacancies = [
  { title: 'Blue Light Card · AI and Automation Engineer', url: 'https://careers.bluelightcard.co.uk/jobs/8690942-ai-and-automation-engineer' },
  { title: 'Linford · AI & Automation Engineer', url: 'https://linford.io/careers/ai-automation-engineer' },
  { title: 'CloserStill Media · AI Automation Engineer', url: 'https://careers.closerstillmedia.com/jobs/8705599-ai-automation-engineer' },
  { title: 'Myn · AI Automation Engineer (contract)', url: 'https://uk.linkedin.com/jobs/view/ai-automation-engineer-contract-london-at-myn-4477402639' },
];

export const automationSkills = [
  { skill: 'Process discovery', practice: 'Map who does what today, where cases fail and what faster or better would mean.', evidence: 'Current and proposed process, baseline and acceptance criteria.' },
  { skill: 'Workflow orchestration', practice: 'Build in n8n. Work with triggers, branching, sub-workflows, credentials and error runs.', evidence: 'Sanitised workflow export and a clean-environment setup guide.' },
  { skill: 'Integration and coding', practice: 'Use REST, JSON, webhooks, scoped authentication or OAuth, pagination and SQL. Put validation or replay logic in tested Python or TypeScript.', evidence: 'Small service or script, schema, test suite and a reproducible webhook run.' },
  { skill: 'Applied AI and evaluation', practice: 'Bound the model to extraction or triage. Validate structured output, compare against a rules baseline and send uncertain cases for review.', evidence: 'Labelled examples, per-case evaluation and a sample review decision.' },
  { skill: 'Reliability and operations', practice: 'Handle duplicate events, timeouts, rate limits and partial failures. Add useful logs, alerts and an operator-controlled replay path.', evidence: 'Failure drill and runbook with a trace, safe recovery and known limits.' },
  { skill: 'Delivery and business impact', practice: 'Run UAT, record who signs off, and measure time saved, error rate or rework on a defined sample.', evidence: 'Pilot plan, UAT results, demo and a measured outcome labelled as real or simulated.' },
];

export const automationLabs = [
  { id: 'automation-support-triage', title: 'Support Intake & Triage', platform: 'n8n + Python or TypeScript', description: 'Classify incoming synthetic tickets, look up the account and route uncertain cases to a reviewer. Compare AI triage with a rules baseline.', proof: 'Workflow export, labelled fixture results, duplicate and failure tests, and a short demo.' },
  { id: 'automation-booking-sync', title: 'Booking Sync & Replay', platform: 'n8n + SQL + API integration', description: 'Build on your Booking Change Checker. Sync approved changes to a sandbox booking system and recover from repeats or partial outages.', proof: 'State diagram, idempotency tests, failure trace and replay runbook.' },
  { id: 'automation-approval-flow', title: 'Invoice Exception Approvals', platform: 'Power Automate + Microsoft 365', description: 'Practise an enterprise approval workflow for a synthetic invoice exception, including reminders, escalations and portability across environments.', proof: 'Solution export, approval history, environment setup notes and signed-off UAT scenarios.' },
];

export const automationWeeks = [
  { id: 'map-and-build', title: 'Map and build the n8n happy path', task: 'Use the triage lab to map the process, write the input schema and connect a webhook, account lookup and mock ticket system.' },
  { id: 'review-and-recover', title: 'Add AI, review and failure recovery', task: 'Compare rules with model output, route uncertainty for review and demonstrate safe replay after a transient API failure.' },
  { id: 'ownership-and-evidence', title: 'Show ownership and business impact', task: 'Time the workflow on the same cases, write the operator runbook and practise the automation scenario in Interview practice. Then choose booking sync or the Microsoft approval flow for your next role.' },
];

export const automationDrills = [
  {
    id: 'automation-replay', type: 'Automation design', title: 'Recover an interrupted workflow', minutes: 35, project: 'automation-booking-sync',
    prompt: 'An approved booking webhook is delivered twice. The target API commits the first update but times out before returning a response. Draw or code how your workflow records state, retries and recovers.',
    example: 'Use one correlation ID, the source event ID and a test target that supports either idempotency keys or lookup by external reference. Explain how you handle a repeat and an out-of-order update.',
    rubric: ['Define a database-backed deduplication boundary and a version check.', 'Resolve uncertain writes before replay and retry only within a bounded policy.', 'Show the run trace, a reproducible failure test and the operator action to recover.'],
  },
  {
    id: 'automation-discovery', type: 'Automation delivery', title: 'Choose a workflow worth automating', minutes: 25, project: 'automation-support-triage',
    prompt: 'An operations lead wants AI to handle every incoming support request. Propose a pilot, pick the rules and model responsibilities, and define what you would measure before expansion.',
    example: 'Requests arrive through two channels, tickets can repeat, and sensitive or uncertain cases need an owner to review them.',
    rubric: ['Map users, baseline performance, common exceptions and ownership.', 'Specify model output validation, escalation and what the workflow can write.', 'Give measurable UAT criteria and explain how you would estimate time saved and rework.'],
  },
] as const;
