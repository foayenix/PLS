'use client';

import { ArrowUpRight, BookOpen, Check, ChevronDown, FolderKanban, Target } from 'lucide-react';
import { learningOverlap, learningPath, type SyllabusSelection } from '@/lib/udemy-syllabus';
import type { Entry, Records } from '@/lib/practice';

const videoMinutes = learningPath.reduce((total, stage) => total + (stage.primary?.minutes ?? 0), 0);
const lectureCount = learningPath.reduce((total, stage) => total + (stage.primary?.lectures.length ?? 0), 0);

function stageKey(id: string) {
  return 'career:learning-path/' + id;
}

export function learningPathProgress(records: Records) {
  return {
    count: learningPath.filter(stage => records[stageKey(stage.id)]?.completed).length,
    next: learningPath.find(stage => !records[stageKey(stage.id)]?.completed),
  };
}

export default function LearningPath({ records, save, openWatchList, openLesson, openProject, openInterviews }: {
  records: Records;
  save: (key: string, entry: Entry) => void;
  openWatchList: (selection: SyllabusSelection) => void;
  openLesson: (id: string) => void;
  openProject: (id: string) => void;
  openInterviews: () => void;
}) {
  const { count, next } = learningPathProgress(records);

  return <div className="career-studio learning-path">
    <div className="page-heading">
      <div><h1>The path to applied AI engineering.</h1><p>Work towards one deployed project you can build, evaluate, troubleshoot and defend in an interview.</p></div>
      <div className="path-total"><strong>{count}<span>/{learningPath.length}</span></strong><small>checkpoints passed</small></div>
    </div>
    <section className="career-feature learning-path-intro">
      <div>
        {next && <span className="eyebrow">NEXT CHECKPOINT</span>}
        <h2>{next?.title || 'All checkpoints passed'}</h2>
        <p>Start at the first checkpoint you can’t yet demonstrate. Use the selected lessons when you need them, then show what you can do in the practical.</p>
      </div>
      <p className="path-video-total"><strong>{lectureCount} selected videos</strong><span>{Math.floor(videoMinutes / 60)}h {videoMinutes % 60}m of video, plus build time</span></p>
    </section>
    <ol className="ascent-list">
      {learningPath.map((stage, i) => {
        const key = stageKey(stage.id);
        const entry = records[key];
        const done = !!entry?.completed;
        const primary = stage.primary;
        const extra = stage.extra;
        return <li key={stage.id}>
          <span className={'ascent-marker' + (stage.id === next?.id ? ' current' : '') + (done ? ' passed' : '')} aria-hidden="true">{done ? <Check size={15}/> : i + 1}</span>
          <details className="career-card ascent-stage" open={stage.id === next?.id}>
            <summary>
              <span><strong>{stage.title}</strong><small>{done ? 'Checkpoint passed' : stage.id === 'ship' ? 'Capstone' : primary?.minutes + ' min of selected video'}</small></span>
              <ChevronDown size={17} aria-hidden="true"/>
            </summary>
            <p>{stage.instruction}</p>
            <div className="career-inset">
              <strong>Ready to move on when</strong><p>{stage.checkpoint}</p>
            </div>
            <div className="ascent-actions">
              {primary && <button className="button secondary" onClick={() => openWatchList(primary)}><BookOpen size={15}/>{primary.label} · {primary.lectures.length} videos <ArrowUpRight size={13}/></button>}
              <button className="text-button" onClick={() => openLesson(stage.lesson)}>Fieldwork reading <ArrowUpRight size={14}/></button>
              <button className="text-button" onClick={() => openProject(stage.project)}><FolderKanban size={15}/>Open practical <ArrowUpRight size={14}/></button>
              {stage.id === 'ship' && <button className="text-button" onClick={openInterviews}>Interview drills <ArrowUpRight size={14}/></button>}
            </div>
            {extra && <details className="ascent-extra">
              <summary>Extra practice if you need it</summary>
              <button className="text-button" onClick={() => openWatchList(extra)}>{extra.label} <ArrowUpRight size={14}/></button>
            </details>}
            <label className="career-check ascent-check">
              <input type="checkbox" aria-label={'I can demonstrate this checkpoint for ' + stage.title} checked={done} onChange={event => save(key, { ...entry, completed: event.target.checked })}/>
              I can demonstrate this checkpoint
            </label>
          </details>
        </li>;
      })}
    </ol>

    <details className="career-card learning-overlap">
      <summary>Where your Udemy courses overlap <ChevronDown size={17} aria-hidden="true"/></summary>
      <p>These recommendations come from the five syllabuses you shared. Follow the primary source for each skill and use the other examples when you want more practice.</p>
      <div className="career-table-wrap"><table>
        <thead><tr><th scope="col">Skill</th><th scope="col">Use first</th><th scope="col">Overlapping material and when to revisit</th></tr></thead>
        <tbody>{learningOverlap.map(row => <tr key={row.topic}><th scope="row">{row.topic}</th><td>{row.primary}</td><td>{row.overlap}</td></tr>)}</tbody>
      </table></div>
      <p className="fine-print">The Course planner estimates full-course completion. This path measures the practical checkpoints above.</p>
    </details>
    <div className="source-notice"><Target size={18}/><p>Use the reference lessons below to fill a gap. If you already have a project that demonstrates a checkpoint, use it as your evidence and move to the next stage.</p></div>
  </div>;
}
