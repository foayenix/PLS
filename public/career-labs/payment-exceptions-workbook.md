# Payment Exceptions Assistant
## Practical workbook

Use the companion JSON case pack in a local Python project. The cases, ledger and policies are fictional. Currency values use integer pence. Read the expected outcomes only to evaluate your implementation and keep the final split out of prompts and tool responses.

### Build and test

1. Define a typed input and result schema. Include the case status, matching invoice IDs, policy references and whether a review is required.
2. Implement a rules-only baseline. Make ledger and policy lookups separate functions so you can substitute test fixtures.
3. Add a read-only lookup tool and a policy retriever. Validate the model's structured output in Python. Send missing, ambiguous or conflicting evidence to a reviewer.
4. Stub a timeout and reproduce it with a regression test. Keep a trace with the case ID, tool name, outcome, cited policy version and review decision.
5. Work on the `development` cases first. Freeze the `holdout` split until you compare your baseline and candidate. Report the result for each named case. Re-run both versions on the same split.

### Business analysis worksheet

- Business problem, process owner and current decision time
- Current process, handoffs and known exceptions
- Proposed process, human decision points and responsibilities
- Five user stories written as a role, a need and a business outcome
- Acceptance criteria written as a setup, an action and an observable result
- RAID log with an owner and next action for each risk, assumption, issue and dependency
- Pilot scope, rollout decision and named sign-off responsibility

### User acceptance walkthrough

Ask a reviewer to run one case from each category below. Record the expected outcome, observation, pass or fail, and anything the reviewer found unclear. Label a self-run exercise as a simulation.

| Scenario | What the reviewer checks |
| --- | --- |
| Valid partial payment | Correct invoice, remaining amount and supporting policy |
| Reference matches two invoices | Both candidates visible, allocation pending and human review required |
| Open dispute | Dispute evidence visible and processing routed for review |
| Unavailable ledger | Error visible, review requested and no allocation suggested |
| Duplicate payment event | Duplicate detected and referred for review |

### Results to keep

Record the case counts, evidence support, task success, missed escalations, latency and approximate cost. Time the same small batch with and without the assistant, then report the sample size and the rework required in each condition. In your handover, name one limitation, describe how to reproduce results, and explain which failures would stop a pilot.
