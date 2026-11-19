'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, CircleHelp } from 'lucide-react';
import { roboticsMilestones, roboticsSources } from '@/lib/robotics';
import { roboticsQuestions } from '../public/practice/robotics.js';
import type { Entry, Records } from '@/lib/practice';

type Props = {
  records: Records;
  save: (key: string, entry: Entry) => void;
  openProject: (id: string) => void;
  openTutor: (id: string) => void;
};

export default function RoboticsStudio({ records, save, openProject, openTutor }: Props) {
  const complete = roboticsMilestones.filter(milestone => records['career:robotics/' + milestone.id]?.completed).length;
  return <>
    <section className="career-feature robotics-feature">
      <div><span className="eyebrow">DECEMBER 2026–DECEMBER 2027</span>
        <h2>Mobile robotics software</h2>
        <p>Become ready for a robotics software role by building, testing and debugging an indoor rover. Keep one applied AI automation project moving for your first round of applications.</p>
        <p><strong>{complete} of {roboticsMilestones.length} milestones complete</strong></p>
      </div>
      <a className="button" href="/practice/?track=robotics">Practise robotics</a>
    </section>
    <div className="career-grid">
      {roboticsMilestones.map(milestone => {
        const key = 'career:robotics/' + milestone.id;
        return <article className="career-card" key={key}>
          <span className="eyebrow">{milestone.when}</span><h3>{milestone.title}</h3><p>{milestone.task}</p>
          <div className="career-inset"><strong>Evidence to keep</strong><p>{milestone.evidence}</p></div>
          <div className="career-actions">
            <button className="text-button" onClick={() => openProject(milestone.project)}>Project brief <ArrowUpRight size={16}/></button>
            <button className="text-button" onClick={() => openTutor(milestone.lesson)}>Guided lesson <ArrowUpRight size={16}/></button>
          </div>
          <label className="career-check"><input type="checkbox" checked={!!records[key]?.completed}
            onChange={event => save(key, { ...records[key], completed: event.target.checked })}/>Milestone complete</label>
        </article>;
      })}
    </div>
    <RoboticsQuiz records={records} save={save}/>
    <div className="section-heading"><div><h2>Robotics resource shelf</h2><p>Start with Robotisim and the Nav2 guide. Pull in the rest when a build exposes a gap.</p></div></div>
    <div className="career-grid">
      {roboticsSources.map(source => <article key={source.url} className="career-card"><h3>{source.title}</h3><p>{source.use}</p>
        <a className="text-button" href={source.url} target="_blank" rel="noreferrer">Open resource <ArrowUpRight size={15}/></a></article>)}
    </div>
  </>;
}

const sets = [
  { label: 'ROS 2 and navigation', questions: roboticsQuestions.slice(0, 6) },
  { label: 'Reliability and perception', questions: roboticsQuestions.slice(6) },
];

export function RoboticsQuiz({ records, save }: Pick<Props, 'records' | 'save'>) {
  const [selected, setSelected] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const { questions } = sets[selected];
  const key = 'career:robotics-quiz/' + selected;
  const last = records[key]?.quizAnswers;
  const score = (responses: number[]) => questions.filter((question, index) => question.correct === responses[index]).length;

  function reset(next: number) {
    setSelected(next);
    setAnswers([]);
    setRevealed(false);
  }

  return <details className="career-card robotics-quiz">
    <summary><CircleHelp size={19}/>Robotics understanding checks</summary>
    <div className="career-tabs" aria-label="Robotics quiz sets">{sets.map((set, i) =>
      <button key={set.label} type="button" aria-pressed={selected === i} onClick={() => reset(i)}>{set.label}</button>
    )}</div>
    {last && !revealed && <p>Last attempt in this set was {score(last)} of {questions.length} correct.</p>}
    <div className="quiz-questions">
      {questions.map((question, index) => <fieldset className="quiz-question robotics-question" key={question.id}>
        <legend>{question.title}</legend><p>{question.prompt}</p>
        {question.choices.map((choice, option) => <label key={choice} className={revealed && option === question.correct ? 'correct' : ''}>
          <input type="radio" name={'robotics-quiz-' + question.id} checked={answers[index] === option} disabled={revealed}
            onChange={() => setAnswers(previous => { const next = [...previous]; next[index] = option; return next; })}/>{choice}
        </label>)}
        {revealed && <p className="quiz-feedback">{answers[index] === question.correct ? 'Correct. ' : 'Revisit this idea. '}{question.explanation}</p>}
      </fieldset>)}
    </div>
    {revealed ? <div className="quiz-result"><strong role="status"><Check size={16}/> {score(answers)} of {questions.length} correct</strong>
      <button className="button secondary" onClick={() => reset(selected)}>Try again</button></div> :
      <button className="button" disabled={questions.some((_, index) => answers[index] === undefined)}
        onClick={() => { save(key, { quizAnswers: answers, completed: true, date: new Date().toISOString() }); setRevealed(true); }}>Check my understanding</button>}
  </details>;
}
