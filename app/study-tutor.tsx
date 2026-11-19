'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BookOpen, ChevronRight, Clock3, Lightbulb } from 'lucide-react';
import { planQuestion, type TutorPlan, type TutorProgress } from '@/lib/tutor';
import type { Entry, Records } from '@/lib/practice';

export const tutorRecordPrefix = 'career:tutor/';

const exampleQuestions = [
  'How do I catch stale odometry in ROS 2?',
  'How does Nav2 use a saved map?',
  'How do I evaluate a RAG system?',
];
const stepNames = ['Understand', 'Build & test', 'Recall'];
const planLabels = { curated: 'Guided Fieldwork lesson', catalog: 'Fieldwork course match', independent: 'Independent study plan', model: 'Model-assisted study plan' };

type Props = {
  records: Records;
  save: (key: string, value: Entry) => void;
  initialId: string | null;
  onSelect: (key: string | null) => void;
  openLesson: (id: string) => void;
  openProject: (id: string) => void;
  startTimer: (title: string) => void;
  logTime: (title: string) => void;
};

export default function StudyTutor({ records, save, initialId, onSelect, openLesson, openProject, startTimer, logTime }: Props) {
  const [question, setQuestion] = useState('');
  const [provider, setProvider] = useState<'ollama' | 'openai' | null>(null);
  const [composing, setComposing] = useState(false);
  const [status, setStatus] = useState('');
  const request = useRef<AbortController | null>(null);
  const current = initialId ? records[initialId]?.tutor : undefined;
  const history = Object.entries(records)
    .filter(([key, entry]) => key.startsWith(tutorRecordPrefix) && entry.tutor)
    .sort(([, a], [, b]) => (b.date ?? '').localeCompare(a.date ?? ''));

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/tutor', { cache: 'no-store', signal: controller.signal })
      .then(response => response.ok ? response.json<{ provider?: unknown }>() : null)
      .then(data => {
        if (data?.provider === 'ollama' || data?.provider === 'openai') setProvider(data.provider);
      }).catch(() => {});
    return () => { controller.abort(); request.current?.abort(); };
  }, []);

  function start(text: string, plan = planQuestion(text)) {
    const key = tutorRecordPrefix + crypto.randomUUID();
    save(key, { title: plan.title, date: new Date().toISOString(), tutor: { question: text, plan, step: 0 } });
    onSelect(key);
    setQuestion('');
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = question.trim();
    if (text.length < 3) return;
    setStatus('');
    start(text);
  }

  async function getModelPlan() {
    if (!current || !initialId) return;
    const controller = new AbortController();
    request.current = controller;
    setComposing(true);
    setStatus('');
    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: current.question }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Unavailable');
      const { plan } = await response.json() as { plan: TutorPlan };
      if (!controller.signal.aborted) start(current.question, plan);
    } catch {
      if (!controller.signal.aborted) setStatus('The model is unavailable. You can continue with this study plan.');
    } finally {
      request.current = null;
      setComposing(false);
    }
  }

  return <div className="study-tutor">
    <div className="page-heading">
      <div><div className="eyebrow">STUDY TUTOR</div><h1>Learn it by doing.</h1>
      <p>Ask a question. Predict what will happen, try a small exercise and explain what you observed.</p></div>
    </div>
    {current && initialId ? <>
      <button className="text-button tutor-back" onClick={() => { request.current?.abort(); setStatus(''); onSelect(null); }}>New question</button>
      <TutorSession key={initialId} progress={current} save={progress => save(initialId, { title: progress.plan.title, date: new Date().toISOString(), completed: progress.step === 3, tutor: progress })}
        openLesson={openLesson} openProject={openProject} startTimer={startTimer} logTime={logTime}/>
      {provider && current.plan.origin !== 'curated' && current.plan.origin !== 'model' && current.step === 0 &&
        <section className="career-card tutor-provider">
          <h2>Want a topic-specific exercise?</h2>
          <p>{provider === 'ollama' ? 'Generate a second plan with the Ollama model running on this computer.' : 'Send this question to the configured OpenAI API to generate a second plan.'}</p>
          <button className="button secondary" disabled={composing} onClick={getModelPlan}>{composing ? 'Preparing your plan…' : 'Generate a guided plan'}</button>
          <p role="status">{status}</p>
        </section>}
    </> : <form className="career-card tutor-question" onSubmit={onSubmit}>
      <label className="input-label" htmlFor="tutor-question">What do you want to learn?</label>
      <textarea id="tutor-question" value={question} onChange={event => setQuestion(event.target.value)} maxLength={500} rows={3} placeholder="How do I debug a rover that loses its position?"/>
      <button className="button" disabled={question.trim().length < 3}>Create a study session</button>
      <div className="tutor-examples" aria-label="Example questions">{exampleQuestions.map(example =>
        <button type="button" className="button secondary" key={example} onClick={() => start(example)}>{example}</button>
      )}</div>
    </form>}
    {history.length > 0 && <section className="tutor-history">
      <div className="section-heading"><h2>Your study sessions</h2></div>
      <div className="career-grid">{history.map(([key, entry]) => <button key={key} type="button" className="career-card tutor-history-card" aria-current={key === initialId ? 'true' : undefined}
        onClick={() => { request.current?.abort(); setStatus(''); onSelect(key); window.scrollTo({ top: 0 }); }}>
        <strong>{entry.title}</strong><small>{entry.tutor?.question}</small><span>{entry.completed ? 'Session complete' : stepNames[entry.tutor?.step ?? 0]}</span>
      </button>)}</div>
    </section>}
  </div>;
}

function TutorSession({ progress, save, openLesson, openProject, startTimer, logTime }: {
  progress: TutorProgress;
  save: (progress: TutorProgress) => void;
} & Pick<Props, 'openLesson' | 'openProject' | 'startTimer' | 'logTime'>) {
  const { plan, step } = progress;
  const [draft, setDraft] = useState<string>();
  const [verified, setVerified] = useState<boolean>();
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const value = draft ?? (step === 0 ? progress.prediction : step === 1 ? progress.evidence : progress.recall) ?? '';
  const hasChecked = verified ?? progress.verified ?? false;

  function advance() {
    const key = step === 0 ? 'prediction' : step === 1 ? 'evidence' : 'recall';
    save({ ...progress, step: step + 1, [key]: value.trim(), verified: hasChecked });
    setDraft(undefined);
    setVerified(undefined);
    stepHeading.current?.focus();
  }

  function keepDraft() {
    const key = step === 0 ? 'prediction' : step === 1 ? 'evidence' : 'recall';
    save({ ...progress, [key]: value, verified: hasChecked });
  }

  return <article className="career-card tutor-plan">
    <header><span className="eyebrow">{planLabels[plan.origin]}</span><h2 tabIndex={-1} ref={stepHeading}>{plan.title}</h2><p>{progress.question}</p></header>
    <ol className="tutor-steps" aria-label="Study session progress">{stepNames.map((name, i) =>
      <li className={i === step ? 'current' : ''} aria-current={i === step ? 'step' : undefined} key={name}><span>{i < step ? '✓' : i + 1}</span>{name}</li>
    )}</ol>
    {step === 0 && <>
      <p>{plan.concept}</p>
      {(plan.lessons.length > 0 || plan.sources.length > 0) && <div className="tutor-links">
        {plan.lessons.map(lesson => <button className="text-button" key={lesson.id} onClick={() => { keepDraft(); openLesson(lesson.id); }}><BookOpen size={16}/>{lesson.title}</button>)}
        {plan.sources.map(source => <a className="text-button" key={source.url} href={source.url} target="_blank" rel="noreferrer"><BookOpen size={16}/>{source.title}</a>)}
      </div>}
      <div className="career-inset"><strong>What you’ll try</strong><p>{plan.exercise}</p></div>
      <label className="input-label" htmlFor="tutor-work">What do you expect to happen, and why?</label>
    </>}
    {step === 1 && <>
      <h3>Try it yourself</h3><p>{plan.exercise}</p>
      <p className="tutor-prediction"><strong>Your prediction</strong> {progress.prediction}</p>
      <div className="form-actions">
        <button className="button secondary" onClick={() => startTimer(plan.title)}><Clock3 size={16}/>Start a focus timer</button>
        {plan.project && <button className="button secondary" onClick={() => { keepDraft(); openProject(plan.project!); }}>Open project brief</button>}
      </div>
      <details className="career-details"><summary><Lightbulb size={16}/>Show a hint</summary><p>{plan.hint}</p></details>
      <label className="input-label" htmlFor="tutor-work">What did you observe? Add a test result, log, or short explanation.</label>
    </>}
    {step === 2 && <>
      <h3>Explain it from memory</h3><p>{plan.check}</p>
      <label className="input-label" htmlFor="tutor-work">Write your explanation in your own words</label>
    </>}
    {step < 3 && <textarea id="tutor-work" rows={4} maxLength={2500} value={value} onChange={event => setDraft(event.target.value)}/>}
    {step === 2 && (value.trim() || hasChecked) && <details className="career-details tutor-rubric">
      <summary>Compare with the rubric</summary>
      <ul>{plan.criteria.map(criterion => <li key={criterion}>{criterion}</li>)}</ul>
      <label className="career-check"><input type="checkbox" checked={hasChecked} onChange={event => setVerified(event.target.checked)}/>I compared my explanation with the rubric</label>
    </details>}
    {step < 3 && <div className="form-actions">
      <button className="button" disabled={!value.trim() || step === 2 && !hasChecked} onClick={advance}>
        {step === 0 ? 'Start the exercise' : step === 1 ? 'Move to recall' : 'Finish study session'} <ChevronRight size={16}/>
      </button>
      <button className="button secondary" onClick={keepDraft} disabled={draft === undefined && verified === undefined}>Save draft</button>
    </div>}
    {step === 3 && <div className="tutor-finish">
      <h3>Session complete</h3>
      <dl><dt>Your prediction</dt><dd>{progress.prediction}</dd><dt>Evidence from the exercise</dt><dd>{progress.evidence}</dd><dt>Your explanation</dt><dd>{progress.recall}</dd></dl>
      <button className="button secondary" onClick={() => logTime(plan.title)}><Clock3 size={16}/>Log study time</button>
    </div>}
  </article>;
}
