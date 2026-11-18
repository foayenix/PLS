import { automationReferences } from './automation';
import type { Project } from './practice';

export const automationProjects: Project[] = [
  {
    id: 'automation-support-triage', name: 'Support Intake & Triage', tag: 'N8N, INTEGRATIONS & EVALUATION', original: true, evidenceBundle: true, track: 'AI', level: 'Beginner → intermediate',
    color: '#4C8591', applies: 'AI automation / service operations',
    description: 'Turn synthetic support events into auditable tickets and route uncertain cases for review.',
    brief: 'Build an n8n workflow that validates webhook input, looks up a fake customer account, classifies a request and writes a draft to a mock helpdesk. Start with deterministic routing. Evaluate an LLM classifier that returns a constrained category and short rationale. Route missing account information, policy exceptions and invalid model output to review. Use synthetic data and an owned sandbox.',
    prerequisites: ['JSON and HTTP basics', 'A local n8n workspace', 'Small Python or TypeScript functions and tests'],
    skills: ['n8n', 'REST APIs', 'Webhooks', 'SQL', 'Structured outputs', 'Quality evaluation'],
    buildSessions: [
      { title: 'Map the workflow and test the intake', steps: ['Choose four ticket categories and define who owns each one.', 'Write an input schema, a synthetic webhook fixture and a rules baseline.', 'Connect a webhook, schema validator, account lookup and draft ticket node to local or mock endpoints.'], doneWhen: 'A valid test event creates a traceable draft and malformed input is recorded for triage.' },
      { title: 'Add structured classification and a review queue', steps: ['Validate the model output against a fixed schema before routing.', 'Send low-confidence, unsupported or sensitive cases to a named reviewer. Set confidence thresholds using labelled examples.', 'Record the workflow, correlation ID, decision and review outcome with sensitive fields omitted.'], doneWhen: 'Explain which actions are deterministic and show a model result that correctly goes to review.' },
      { title: 'Exercise duplicate events and failure paths', steps: ['Store an event key under a unique constraint. Repeated delivery must reuse the same record.', 'Use bounded retries on transient lookups and route validation and persistent failures to a review queue.', 'Simulate an unavailable account API and a repeated event, then exercise an operator-controlled replay.'], doneWhen: 'Repeating a valid event leaves one draft. A failed lookup is traceable and recoverable.' },
      { title: 'Measure and package the pilot', steps: ['Run rules and model approaches on the same labelled cases.', 'Measure correct routing, missed escalations, write duplicates, review time and per-case cost.', 'Export a sanitised workflow, test output, setup guide and short demo.'], doneWhen: 'Another person can replay a case and understand the trade-off between rules and model routing.' },
    ],
    checks: ['One event produces at most one draft under repeat delivery.', 'Each delayed or invalid input has a clear review state.', 'The same labelled cases compare the rules and model versions.', 'The export, tests and runbook work with sandbox data.'],
    valueTest: 'Compare manual and assisted triage on the same synthetic batch. Record the number of correct routes, missed reviews, duplicate drafts and time spent. Name the largest source of rework and show the next change it motivates.',
    sources: [automationReferences.webhook, automationReferences.errors],
  },
  {
    id: 'automation-booking-sync', name: 'Booking Sync & Replay', tag: 'API INTEGRATION & RELIABILITY', original: true, evidenceBundle: true, track: 'AI', level: 'Intermediate',
    color: '#B66F55', applies: 'Crescent Moon / integration engineering',
    description: 'Deliver staff-approved booking changes once and recover from API failures without losing track of state.',
    brief: 'Extend the Booking Change Checker into an event-driven integration. Accept approved changes from a simulated booking source and sync them to a mock target. Keep source events, approval and delivery attempts in a store with a unique event ID and version checks. Keep target writes behind staff approval. Make the recovery path visible.',
    prerequisites: ['Booking Change Checker or equivalent draft-and-approve flow', 'REST and SQL basics', 'A sandbox target that supports idempotency keys or lookup by reference'],
    skills: ['Webhooks', 'SQL', 'Idempotency', 'Retries', 'Operations', 'State management'],
    buildSessions: [
      { title: 'Define the event and state model', steps: ['Name the source of truth for a booking. Define event ID, booking ID, version, approval and delivery status.', 'Store events under a unique key and record duplicate and stale versions without writing to the target.'], doneWhen: 'You can show one record for repeated delivery and explain what happens to out-of-order events.' },
      { title: 'Build the approved update path', steps: ['Accept a staff decision in your sandbox. Send only approved records to a mock target.', 'Include an idempotency key if the target supports it. Otherwise reconcile the current target state by external reference before another attempt.'], doneWhen: 'A rejected change has no target write and an approved change has a trace.' },
      { title: 'Recover from partial failure', steps: ['Simulate a rate limit, a timeout before commit, and a timeout after commit.', 'Use bounded retries or an operator queue as appropriate. Reconcile uncertain results before replay.'], doneWhen: 'After a simulated timeout following a commit, replay converges on one correct target record.' },
      { title: 'Prepare the operator handover', steps: ['Export traces with correlation IDs, status, attempt count and redacted payload details.', 'Write a short runbook covering backlog inspection, release, replay and rollback. Record a five-minute failure-and-recovery demo.'], doneWhen: 'A reviewer follows your runbook to recover a test event and can tell what changed.' },
    ],
    checks: ['Unapproved and stale changes cannot reach the target.', 'Duplicate, rate limit and partial failure cases are repeatable.', 'The runbook distinguishes safe retry from manual reconciliation.', 'The demo proves one approved update and one safe recovery.'],
    valueTest: 'Compare the manual recovery steps and time for a batch of fictional booking changes with the workflow. Count duplicates prevented, missed updates and unresolved cases.',
    sources: [automationReferences.webhook, automationReferences.errors],
  },
  {
    id: 'automation-approval-flow', name: 'Invoice Exception Approvals', tag: 'POWER AUTOMATE & DELIVERY', original: true, evidenceBundle: true, track: 'AI', level: 'Intermediate',
    color: '#627259', applies: 'Microsoft enterprise automation',
    description: 'Build an auditable Microsoft approval flow for synthetic invoice exceptions.',
    brief: 'Use a Microsoft test environment and a dummy SharePoint or Dataverse list to route invoice exceptions for an internal decision. Reuse the status and exception design from the Payment Exceptions Assistant. Store a reason for approval, rejection or expiry. Practise moving a solution-aware flow between environments. Keep financial execution outside this lab.',
    prerequisites: ['Access to a Power Platform test environment', 'A synthetic invoice exception list', 'A simple process map with named approver roles'],
    skills: ['Power Automate', 'Microsoft 365', 'Approvals', 'Environment variables', 'UAT', 'Handover'],
    buildSessions: [
      { title: 'Define the approval contract', steps: ['Write acceptance criteria for approval, rejection, escalation and expiry.', 'Create a synthetic SharePoint or Dataverse list with a status and audit fields. Map who can make a decision.'], doneWhen: 'Five example cases have expected outcomes and an assigned business owner.' },
      { title: 'Build the solution-aware flow', steps: ['Create a solution-aware cloud flow in a test environment. Reference test configuration through environment variables or managed connections.', 'Record an approver decision once. Use test users or a simulated approver in your sandbox.'], doneWhen: 'An approval and a rejection each have a complete audit trail and repeat updates do not trigger a second decision.' },
      { title: 'Test timeouts and move environments', steps: ['Exercise reminders, expiry, reassignment and a failed connection.', 'Export the solution and document importing it with new test settings, including how to disable or revert the flow.'], doneWhen: 'You can identify a failed run and explain which settings change in the target environment.' },
      { title: 'Run UAT and show the trade-offs', steps: ['Ask a reviewer to run the five scenarios, or label a self-run simulation.', 'Package the solution export, results, rollback instructions and a short walkthrough. Compare the flow’s approval and handover model with your n8n project.'], doneWhen: 'A reviewer can reproduce an escalation, explain who signs off and name any remaining exception.' },
    ],
    checks: ['Approval, rejection and expiry remain distinguishable in the audit trail.', 'Credentials and site IDs can be configured for a test environment.', 'UAT includes repeated triggers, unavailable approver and failed connection.', 'The runbook includes handover and rollback.'],
    valueTest: 'Measure decision time, duplicate requests and cases escalated in a small fictional batch. Record what an approver found unclear and what changed before the next pilot.',
    sources: [automationReferences.powerAutomate, automationReferences.cloudFlowErrors],
  },
];
