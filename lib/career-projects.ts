import { careerSources } from './career';
import type { Project } from './practice';

export const paymentExceptionsProject: Project = {
  id: 'payment-exceptions',
  name: 'Payment Exceptions Assistant',
  tag: 'AZURE, AGENTS & UAT',
  track: 'AI',
  level: 'Intermediate',
  color: '#52674d',
  applies: 'Credit control / AI consulting',
  original: true,
  evidenceBundle: true,
  description: 'Use synthetic invoices and policies to investigate exceptions, cite evidence and send ambiguous cases for review.',
  brief: 'Build a Python assistant for partial payments, unallocated cash and disputed invoices. Start from the invoice mismatch finder’s deterministic matching logic. Add a read-only ledger tool and retrieval over fictional policy excerpts. Validate a structured response containing the proposed case status, source references and whether a reviewer is required. Keep the simulated ledger read-only. Demonstrate the workflow on Microsoft Foundry using synthetic records.',
  prerequisites: ['Python validation and tests', 'Structured outputs and tool calling', 'Invoice mismatch finder or a comparable rules-only baseline'],
  skills: ['Python', 'Azure / Foundry', 'RAG', 'Process mapping', 'Controls', 'Evaluation', 'UAT'],
  buildSessions: [
    { title: 'Map the business process', steps: [
      'Write the problem brief, current and proposed flow, stakeholder roles and five user stories.',
      'Define outcomes and evidence for partial, unallocated and disputed cases.',
      'Write acceptance criteria and a short RAID log. Assign sign-off and reviewer responsibilities.',
    ], doneWhen: 'Someone else can explain what should happen when the reference matches two invoices.' },
    { title: 'Build the read-only workflow', steps: [
      'Create synthetic invoice, remittance and fictional policy fixtures. Implement a rules-only baseline.',
      'Add a schema-validated lookup tool, policy retrieval and citations on every evidence-backed recommendation.',
      'Require review for ambiguous cases, conflicting evidence and lookup failures. Trace tool calls and the review decision.',
    ], doneWhen: 'An ambiguous case shows both invoice candidates, leaves allocation pending and clearly asks for review.' },
    { title: 'Deploy and exercise a failure', steps: [
      'Connect the workflow to Microsoft Foundry and configure one custom read-only tool.',
      'Trace a successful case and reproduce a tool timeout. Write a runbook for finding the failure and recovering.',
      'Record the service identity, permissions, logging and how the demo can be reproduced.',
    ], doneWhen: 'The demo includes a successful request and a deliberate failed lookup with a visible review outcome.' },
    { title: 'Prove usefulness and prepare the handover', steps: [
      'Freeze about 25 labelled cases. Compare both versions on the same records, including missing and contradictory evidence.',
      'Ask a reviewer to run five user acceptance scenarios and capture feedback, or label the exercise as a self-run simulation.',
      'Publish a short demo, evaluation table, known limitations and a proposed decision for a limited pilot.',
    ], doneWhen: 'The report identifies at least one error, gives a reproducible test command and ties the pilot decision to observed results.' },
  ],
  checks: [
    'The process map and acceptance criteria cover the reviewer’s responsibilities.',
    'Policy references and the ledger tool trace are visible in the result.',
    'Missing data, ambiguous references and tool failures reliably request review.',
    'The evaluation compares the candidate and baseline on the same labelled cases.',
    'The UAT scenarios, demo and handover show findings and limits.',
  ],
  valueTest: 'Run the same synthetic cases with manual review and assisted review. Record counts, review time, incorrect recommendations and rework for each method. Report the sample size and limitations. Use missed mandatory escalations as a stop criterion for the pilot.',
  sources: [careerSources.foundry, careerSources.evaluation, careerSources.analysis, careerSources.delivery],
};
