'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Check, Code2, Copy } from 'lucide-react';
import { buildPrompt, emptyWalkthrough, teachBackPrompt, walkthroughPrefix, type CodeWalkthrough as Walkthrough } from '@/lib/code-walkthrough';
import type { Entry, Project, Records } from '@/lib/practice';

const steps = ['Scope', 'Trace', 'Prove'];
const requiredFields = [
  ['change', 'goal'],
  ['revision', 'trace', 'failure'],
  ['prediction', 'evidence'],
] as const;

type Props = {
  project: Project;
  records: Records;
  save: (key: string, entry: Entry) => void;
  copy: (text: string) => void;
  openTutor: (question: string) => void;
};

export default function CodeWalkthrough({ project, records, save, copy, openTutor }: Props) {
  const prefix = walkthroughPrefix(project.id);
  const history = Object.entries(records).filter(([key, entry]) => key.startsWith(prefix) && entry.walkthrough)
    .sort(([, a], [, b]) => (b.date ?? '').localeCompare(a.date ?? ''));
  const [selection, setSelection] = useState<string | null>();
  const selectedKey = selection === undefined ? history[0]?.[0] : selection;
  const selected = selectedKey ? records[selectedKey]?.walkthrough : undefined;

  return <section className="career-card code-walkthrough" aria-labelledby="walkthrough-heading">
    <div className="walkthrough-heading">
      <div><span className="eyebrow">AI-ASSISTED CODING</span><h3 id="walkthrough-heading"><Code2 size={19}/>Code walkthrough</h3>
        <p>Pick one AI-assisted change. Trace it in the repository, then make a small edit or write a test yourself.</p></div>
      {history.length > 0 && <button type="button" className="button secondary" onClick={() => setSelection(null)}>New walkthrough</button>}
    </div>
    {history.length > 0 && <div className="walkthrough-history">
      <label className="input-label" htmlFor="walkthrough-history">Saved changes</label>
      <select id="walkthrough-history" value={selectedKey ?? ''} onChange={event => setSelection(event.target.value || null)}>
        <option value="">New walkthrough</option>
        {history.map(([key, entry]) => <option value={key} key={key}>{entry.title} · {entry.completed ? 'Complete' : 'Draft'}</option>)}
      </select>
    </div>}
    <WalkthroughForm
      key={selectedKey ?? 'new'}
      initial={selected ?? emptyWalkthrough}
      project={project}
      onSave={walkthrough => {
        const key = selectedKey ?? prefix + crypto.randomUUID();
        save(key, { title: walkthrough.change.trim(), date: new Date().toISOString(), completed: walkthrough.step === steps.length, walkthrough });
        setSelection(key);
      }}
      copy={copy}
      openTutor={openTutor}
    />
  </section>;
}

function WalkthroughForm({ initial, project, onSave, copy, openTutor }: {
  initial: Walkthrough;
  project: Project;
  onSave: (walkthrough: Walkthrough) => void;
} & Pick<Props, 'copy' | 'openTutor'>) {
  const [draft, setDraft] = useState<Walkthrough>();
  const [question, setQuestion] = useState('');
  const [saved, setSaved] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const form = draft ?? initial;
  const { step } = form;
  const ready = requiredFields[step]?.every(name => form[name].trim().length > 0) ?? false;
  const complete = step === steps.length;

  function edit(field: keyof Omit<Walkthrough, 'step'>, value: string) {
    setDraft({ ...form, [field]: value });
    setSaved('');
  }

  function persist(nextStep: number) {
    onSave({ ...form, step: nextStep });
    setDraft(undefined);
    setSaved(nextStep === step ? 'Draft saved' : '');
    if (nextStep !== step) heading.current?.focus();
  }

  function advance(event: FormEvent) {
    event.preventDefault();
    if (ready) persist(step + 1);
  }

  return <form className="walkthrough-form" onSubmit={advance}>
    <ol className="tutor-steps" aria-label="Walkthrough progress">{steps.map((label, index) =>
      <li className={index === step ? 'current' : ''} key={label} aria-current={index === step ? 'step' : undefined}>
        <span aria-hidden="true">{index < step ? '✓' : index + 1}</span>{label}
      </li>
    )}</ol>
    <h4 ref={heading} tabIndex={-1}>{['Scope one change', 'Trace the implementation', 'Prove your understanding', 'Walkthrough complete'][step]}</h4>
    {step === 0 && <>
      <label htmlFor="walkthrough-change">What change are you building?</label>
      <input id="walkthrough-change" maxLength={120} value={form.change} onChange={event => edit('change', event.target.value)}
        placeholder={project.id === 'ros2-diagnostics' ? 'Detect stale odometry' : 'Name one feature or bug fix'}/>
      <label htmlFor="walkthrough-goal">What should happen when it works?</label>
      <textarea id="walkthrough-goal" rows={2} maxLength={1400} value={form.goal} onChange={event => edit('goal', event.target.value)}
        placeholder={project.id === 'ros2-diagnostics' ? 'Report stale after a full second without a new odometry sample.' : 'Give one input and the observable result you expect.'}/>
      <button type="button" className="button secondary" disabled={!ready} onClick={() => copy(buildPrompt(project.name, form))}><Copy size={15}/>Copy build prompt</button>
    </>}
    {step === 1 && <>
      <p>Open the commit or diff in your editor. Follow a real input through the files and functions you can point to.</p>
      <label htmlFor="walkthrough-revision">Commit, pull request, or file paths</label>
      <input id="walkthrough-revision" maxLength={500} value={form.revision} onChange={event => edit('revision', event.target.value)}
        placeholder="Commit SHA, PR URL, or changed files"/>
      <label htmlFor="walkthrough-trace">Explain the code path in your own words</label>
      <textarea id="walkthrough-trace" rows={4} maxLength={2500} value={form.trace} onChange={event => edit('trace', event.target.value)}
        placeholder="What receives the input? Where is the decision made? What leaves the function or service?"/>
      <label htmlFor="walkthrough-failure">What could fail, and where is it handled?</label>
      <textarea id="walkthrough-failure" rows={2} maxLength={1400} value={form.failure} onChange={event => edit('failure', event.target.value)}
        placeholder="Name one failure and where you would look for it."/>
      <button type="button" className="button secondary" disabled={!form.revision.trim()} onClick={() => copy(teachBackPrompt(project.name, form.change, form.revision))}><Copy size={15}/>Copy teach-back prompt</button>
      <details className="career-details">
        <summary>Study a concept from the code</summary>
        <div className="walkthrough-concept">
          <label htmlFor="walkthrough-question">What would you like to understand?</label>
          <input id="walkthrough-question" maxLength={500} value={question} onChange={event => setQuestion(event.target.value)}
            placeholder="How do I catch stale odometry in ROS 2?"/>
          <button type="button" className="button secondary" disabled={question.trim().length < 3} onClick={() => { persist(step); openTutor(question.trim()); }}>Open in Study Tutor</button>
        </div>
      </details>
    </>}
    {step === 2 && <>
      <p>Try one small change yourself. Write down what you expect before running it.</p>
      <label htmlFor="walkthrough-prediction">Your edit or test and predicted result</label>
      <textarea id="walkthrough-prediction" rows={3} maxLength={1800} value={form.prediction} onChange={event => edit('prediction', event.target.value)}
        placeholder="I’ll test the timeout boundary. At exactly one second I expect the stream to become stale."/>
      <label htmlFor="walkthrough-evidence">What you ran and what actually happened</label>
      <textarea id="walkthrough-evidence" rows={4} maxLength={2500} value={form.evidence} onChange={event => edit('evidence', event.target.value)}
        placeholder="Record a test command or reproduction steps, the result, and what you learned."/>
    </>}
    {complete ? <dl className="walkthrough-result">
      <dt>Change</dt><dd>{form.change}</dd>
      <dt>Expected behaviour</dt><dd>{form.goal}</dd>
      <dt>Reviewed code</dt><dd>{form.revision}</dd>
      <dt>Your explanation</dt><dd>{form.trace}</dd>
      <dt>Failure case</dt><dd>{form.failure}</dd>
      <dt>Your prediction</dt><dd>{form.prediction}</dd>
      <dt>What you ran and observed</dt><dd>{form.evidence}</dd>
    </dl> : <div className="form-actions">
      <button type="submit" className="button" disabled={!ready}>
        {step === 0 ? 'Trace the code' : step === 1 ? 'Plan an independent test' : 'Complete walkthrough'}
        {step === 2 && <Check size={15}/>}
      </button>
      {step > 0 && <button type="button" className="button secondary" onClick={() => persist(step - 1)}>Back</button>}
      <button type="button" className="text-button" disabled={!draft || !form.change.trim()} onClick={() => persist(step)}>Save draft</button>
    </div>}
    <p role="status" hidden={!saved}>{saved}</p>
  </form>;
}
