# AI automation practice workbook

Use the companion JSON with an owned local workspace and mock APIs. All events and expected outcomes are fictional. Keep the expected fields out of prompts and inputs.

## Support Intake & Triage

1. Draw the current and proposed process. Define an owner for access, billing, booking and general enquiries.
2. Make a rules baseline. Accept a webhook with an event ID, account ID and message. Validate non-empty fields and check the account with a mock API. A repeated event must reuse its result.
3. Add a model for ambiguous language. Validate a structured category and explanation against the fixed categories. Send vague requests, billing disputes, unknown accounts, unavailable dependencies and malformed model outputs to a reviewer.
4. Run T01–T08 while building. Reserve T09–T12 for the end. T12 exercises the model-backed failure path. Record it separately if the rules-only version never calls a model.
5. Report correct category and review decisions, duplicate drafts, time and estimated model cost. Show one useful success and one failure with its trace.

## Booking Sync & Replay

1. Keep the source event ID, current booking version and human approval in your sandbox. Use a fake target and start each case at the version in the fixture.
2. Make each approved version have at most one effect. Reject stale or unapproved events. If the target may have committed before a timeout, look up its state before trying again.
3. Run B01–B06. Count target writes even when an API timed out after committing. On repeated rate-limited reads or writes, stop within your retry budget and leave a visible operator action.
4. Record a short walkthrough of one failure, the evidence you inspected and the recovery action. Include a runbook that lets someone else reproduce it.

## Evidence to put in your portfolio

- Process map and acceptance criteria with named reviewer responsibilities
- Sanitised n8n export or a repository containing the scripts and tests
- Before-and-after results with counts, denominator and sample limits
- A short demo and runbook covering safe retry, review and replay

Measure the same cases with manual and assisted handling. Mark the results as practice data. In interviews, explain which part needs a model, which part uses ordinary code, and who owns the workflow when it fails.
