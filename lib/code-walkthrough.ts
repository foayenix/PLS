export type CodeWalkthrough = {
  step: number;
  change: string;
  goal: string;
  revision: string;
  trace: string;
  failure: string;
  prediction: string;
  evidence: string;
};

export const emptyWalkthrough: CodeWalkthrough = {
  step: 0, change: '', goal: '', revision: '', trace: '', failure: '', prediction: '', evidence: '',
};

export function walkthroughPrefix(projectId: string) {
  return 'project:' + projectId + '/walkthrough/';
}

export function buildPrompt(projectName: string, walkthrough: CodeWalkthrough) {
  return [
    'Help me implement one change in ' + projectName + '.',
    'Change: ' + walkthrough.change.trim(),
    'Expected behaviour: ' + walkthrough.goal.trim(),
    'First propose a focused plan and name the files you expect to touch. Flag any ambiguity or dependency before proceeding.',
    'After the change, show the entry point, trace one input through the main functions to the output, and identify one boundary or failure case.',
    'List the command to reproduce the tests and distinguish tests you ran from checks you are proposing.',
    'End by giving me one small edit or test to implement myself. Give me a hint if I ask.',
  ].join('\n\n');
}

export function teachBackPrompt(projectName: string, change: string, revision: string) {
  return [
    'Coach me on this change in ' + projectName + '.',
    'Change: ' + change.trim(),
    'Commit or files to review: ' + revision.trim(),
    'Use the diff I share or the actual repository files you can see. Ask me for the relevant source if context is missing.',
    'Ask one question at a time about the entry point, data flow, or a failure case. Wait for my answer before you give feedback. Point me towards a specific function or test when I get stuck.',
    'Finish with one small independent edit or test. Ask me what I predict, then wait for my result before discussing the explanation.',
  ].join('\n\n');
}
