'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { syllabi, type SyllabusId, type SyllabusLecture, type SyllabusSelection } from '@/lib/udemy-syllabus';
import type { Entry, Records } from '@/lib/practice';

export default function SyllabusStudio({ initialCourse, selection, records, save, notify, openPath }: {
  initialCourse?: SyllabusId;
  selection?: SyllabusSelection;
  records: Records;
  save: (key: string, entry: Entry) => void;
  notify: (message: string) => void;
  openPath: () => void;
}) {
  const [course, setCourse] = useState<SyllabusId>(selection?.course || initialCourse || 'donner-core');
  const [focus, setFocus] = useState<number[]>(selection?.lectures || []);
  const current = syllabi[course];

  return <>
    <section className="career-feature">
      <div><span className="eyebrow">UDEMY SYLLABUS</span><h2>Course outlines.</h2><p>Search the five imported outlines and track individual lectures. Use your learning path to choose the next skill to practise.</p></div>
      <button className="button secondary" onClick={openPath}><ArrowLeft size={16}/>My learning path</button>
    </section>
      <section className="career-card syllabus-select">
        <label className="input-label" htmlFor="syllabus-course">Udemy course</label>
        <select id="syllabus-course" value={course} onChange={event => {
          setCourse(event.target.value as SyllabusId);
          setFocus([]);
        }}>
          {Object.entries(syllabi).map(([id, item]) => <option key={id} value={id}>{item.title}</option>)}
        </select>
        <a className="text-button" href={current.url} target="_blank" rel="noreferrer">Open this course on Udemy <ExternalLink size={14}/></a>
      </section>
      <LectureList key={course + ':' + focus.join(',')} course={course} focus={focus} clearFocus={() => setFocus([])} records={records} save={save} notify={notify}/>
  </>;
}

function LectureList({ course, focus, clearFocus, records, save, notify }: {
  course: SyllabusId;
  focus: number[];
  clearFocus: () => void;
  records: Records;
  save: (key: string, entry: Entry) => void;
  notify: (message: string) => void;
}) {
  const [lectures, setLectures] = useState<SyllabusLecture[]>([]);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState(0);
  const [status, setStatus] = useState('all');
  const [limit, setLimit] = useState(40);
  const syllabus = syllabi[course];

  useEffect(() => {
    const controller = new AbortController();
    fetch('/course-syllabi/' + course + '.json', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Syllabus unavailable');
        return response.json() as Promise<SyllabusLecture[]>;
      })
      .then(data => {
        if (!controller.signal.aborted) setLectures(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [course, attempt]);

  if (error) return <section className="career-card syllabus-select"><p>The course outline couldn’t load.</p><button className="button secondary" onClick={() => { setError(false); setAttempt(value => value + 1); }}>Try again</button></section>;
  if (!lectures.length) return <p className="syllabus-select" role="status">Loading course outline…</p>;

  const key = 'career:syllabus/' + course;
  const entry = records[key];
  const done = new Set(entry?.checks ?? lectures.filter(lecture => lecture.completed).map(lecture => String(lecture.number)));
  const totalMinutes = lectures.reduce((minutes, lecture) => minutes + (lecture.minutes ?? 0), 0);
  const remainingMinutes = lectures.reduce((minutes, lecture) => minutes + (done.has(String(lecture.number)) ? 0 : (lecture.minutes ?? 0)), 0);
  const doneCount = lectures.filter(lecture => done.has(String(lecture.number))).length;
  const nextGroup = syllabus.groups.find(([start]) => start > group)?.[0] || (lectures.length + 1);
  const search = query.trim().toLowerCase();
  const matching = lectures.filter(lecture => {
    const isDone = done.has(String(lecture.number));
    return (!focus.length || focus.includes(lecture.number))
      && (!group || lecture.number >= group && lecture.number < nextGroup)
      && (status === 'all' || (status === 'complete') === isDone)
      && (!search || lecture.title.toLowerCase().includes(search) || String(lecture.number) === search.replace(/^#/, ''));
  });
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  return <section className="career-card syllabus-list">
    <div className="career-actions">
      <div><h3>{doneCount} of {lectures.length} entries complete</h3><p>{hours}h {minutes}m of listed video left in this course</p></div>
      <button className="button secondary" onClick={() => {
        const plannerKey = 'career:course/' + course;
        const estimate = Math.round((1 - remainingMinutes / totalMinutes) * 100);
        const progressPercent = doneCount === lectures.length ? 100 : Math.min(99, estimate);
        save(plannerKey, { ...records[plannerKey], progressPercent });
        notify('Course planner progress updated to ' + progressPercent + '%.');
      }}>Use progress in Course planner</button>
    </div>
    <div className="syllabus-controls">
      <label>Search lectures<input type="search" value={query} onChange={event => { setQuery(event.target.value); setLimit(40); }} placeholder="Search by title or number"/></label>
      {!focus.length && <label>Study block<select value={group} onChange={event => { setGroup(Number(event.target.value)); setLimit(40); }}>
        <option value={0}>All study blocks</option>
        {syllabus.groups.map(([start, title]) => <option key={start} value={start}>{title}</option>)}
      </select></label>}
      <label>Show<select value={status} onChange={event => { setStatus(event.target.value); setLimit(40); }}>
        <option value="all">All entries</option><option value="incomplete">To do</option><option value="complete">Completed</option>
      </select></label>
    </div>
    {focus.length > 0 && <div className="career-actions syllabus-selection"><p>Selected lectures from your study route.</p><button className="text-button" onClick={clearFocus}>Show full course outline <ArrowRight size={14}/></button></div>}
    <p className="fine-print syllabus-count">{matching.length} {matching.length === 1 ? 'entry' : 'entries'} shown by your filters</p>
    {matching.length > 0 ? <ol className="syllabus-lectures">
      {matching.slice(0, limit).map(lecture => {
        const index = String(lecture.number);
        return <li key={index}><label>
          <input type="checkbox" checked={done.has(index)} onChange={event => {
            if (event.target.checked) done.add(index);
            else done.delete(index);
            save(key, { ...entry, checks: [...done] });
          }}/>
          <span className="syllabus-number">#{lecture.number}</span>
          <span>{lecture.title}</span>
          <small>{lecture.minutes === null ? 'Lab' : lecture.minutes + ' min'}</small>
        </label></li>;
      })}
    </ol> : <p>No entries match these filters.</p>}
    {matching.length > limit && <button className="button secondary syllabus-more" onClick={() => setLimit(value => value + 40)}>Show more entries</button>}
    <p className="fine-print syllabus-note">Lecture titles, rounded durations and starting completion come from your pasted outline. Study blocks group related lectures in Fieldwork. Your checkmarks are saved here, and you can apply the timed-video percentage to the planner.</p>
  </section>;
}
