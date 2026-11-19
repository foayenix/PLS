'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Clock3, ExternalLink, Plus } from 'lucide-react';
import { careerSources, coursePlan, defaultPlan, drills, finishDate, formatPlanDate, roadmap, roleTemplates, studyBlocks, type RequirementStatus, type RoleRequirement } from '@/lib/career';
import { automationDrills } from '@/lib/automation';
import AutomationStudio from './automation-studio';
import SyllabusStudio from './syllabus-studio';
import RoboticsStudio from './robotics-studio';
import { roboticsDrills, roboticsMilestones } from '@/lib/robotics';
import { isSyllabusCourse, type SyllabusId, type SyllabusSelection } from '@/lib/udemy-syllabus';
import type { Entry, Records } from '@/lib/practice';

type StudioProps = {
  records: Records;
  save: (key: string, value: Entry) => void;
  notify: (message: string) => void;
  openProject: (id: string) => void;
  openPath: () => void;
  openTutor: (id: string) => void;
  initialTab?: 'syllabus' | 'interviews' | 'robotics';
  watchList?: SyllabusSelection;
};

const tabs = [
  ['robotics', 'Robotics roadmap'],
  ['roadmap', 'AI portfolio plan'],
  ['practice', 'Practical work'],
  ['automation', 'AI automation'],
  ['interviews', 'Interview practice'],
  ['contracts', 'Contract readiness'],
  ['courses', 'Course planner'],
  ['syllabus', 'Udemy syllabus'],
] as const;

type Tab = typeof tabs[number][0];

export default function CareerStudio(props: StudioProps) {
  const [tab, setTab] = useState<Tab>(props.initialTab || 'robotics');
  const [syllabusCourse, setSyllabusCourse] = useState<SyllabusId>();
  const [watchList, setWatchList] = useState(props.watchList);
  const [interviewDrill, setInterviewDrill] = useState<string>(drills[0].id);
  const done = roboticsMilestones.filter(milestone => props.records['career:robotics/' + milestone.id]?.completed).length;
  return <div className="career-studio">
    <div className="page-heading">
      <div><div className="eyebrow">CAREER STUDIO</div><h1>Your path to robotics.</h1><p>Work towards a mobile robotics software role by December 2027. Keep applied AI and automation as your first route into engineering work.</p></div>
      <div className="path-total"><strong>{done}<span>/{roboticsMilestones.length}</span></strong><small>robotics milestones</small></div>
    </div>
    <nav className="career-tabs" aria-label="Career Studio sections">
      {tabs.map(([id, label]) => <button type="button" key={id} aria-pressed={tab === id} onClick={() => { setSyllabusCourse(undefined); setWatchList(undefined); setTab(id); }}>{label}</button>)}
    </nav>
    {tab === 'robotics' && <RoboticsStudio {...props}/>}
    {tab === 'roadmap' && <Roadmap {...props} onPractice={() => setTab('practice')}/>}
    {tab === 'practice' && <PracticalWork openProject={props.openProject}/>}
    {tab === 'automation' && <AutomationStudio {...props} openInterviews={() => { setInterviewDrill(automationDrills[0].id); setTab('interviews'); }} openBoard={() => setTab('contracts')}/>}
    {tab === 'interviews' && <InterviewPractice {...props} selected={interviewDrill} setSelected={setInterviewDrill}/>}
    {tab === 'contracts' && <ContractReadiness {...props} openAutomation={() => setTab('automation')}/>}
    {tab === 'courses' && <CoursePlanner {...props} openSyllabus={id => { setSyllabusCourse(id); setWatchList(undefined); setTab('syllabus'); window.scrollTo({ top: 0 }); }}/>}
    {tab === 'syllabus' && <SyllabusStudio {...props} initialCourse={syllabusCourse} selection={watchList}/>}
  </div>;
}

function Roadmap({ records, save, openProject, openPath, onPractice }: StudioProps & { onPractice: () => void }) {
  const start = records['career:course-plan']?.startedOn || defaultPlan.start;
  return <>
    <section className="career-feature">
      <div><span className="eyebrow">SIX-WEEK PORTFOLIO PLAN · START {formatPlanDate(start)}</span><h2>From a reliable baseline to a case study.</h2><p>Reserve 10–12 hours a week for building and interview practice. Use My learning path to choose lessons and carry missed work into the next available block.</p><button className="text-button career-path-link" onClick={openPath}>Open my learning path <ArrowUpRight size={14}/></button></div>
      <button className="button" onClick={onPractice}>Open practical work <ArrowRight size={16}/></button>
    </section>
    <div className="career-grid">
      {roadmap.map((week, index) => {
        const key = 'career:week/' + week.id;
        const entry = records[key];
        return <article className="career-card" key={week.id}>
          <span className="eyebrow">WEEK {index + 1}</span>
          <h3>{week.title}</h3><p>{week.focus}</p>
          <div className="career-inset"><strong>Evidence to keep</strong><p>{week.evidence}</p></div>
          <div className="career-actions">
            <button className="text-button" onClick={() => openProject(week.project)}>Open project <ArrowUpRight size={15}/></button>
            <label className="career-check"><input type="checkbox" checked={!!entry?.completed} onChange={event => save(key, { ...entry, completed: event.target.checked })}/> Milestone complete</label>
          </div>
        </article>;
      })}
    </div>
  </>;
}

function PracticalWork({ openProject }: Pick<StudioProps, 'openProject'>) {
  const labs = [
    { title: 'Payment Exceptions Assistant', label: 'FLAGSHIP BUILD', project: 'payment-exceptions', text: 'Take synthetic payments from a rules-only baseline to a Python and Foundry assistant with source citations, a read-only ledger tool and human review.', evidence: 'Process map, five user stories, RAID log, 25 labelled cases, UAT notes, trace, demo and handover.' },
    { title: 'Sanko correction ledger', label: 'SECOND CASE STUDY', project: 'sanko-correction-ledger', text: 'Take a synthetic WhatsApp voice note through transcription, schema validation, provenance, human review and a saved correction.', evidence: 'A three-minute walkthrough, field-level metrics and one failure you diagnosed and fixed.' },
    { title: 'Invoice mismatch finder', label: 'PYTHON BASELINE', project: 'invoice-mismatch', text: 'Rebuild the matching function without AI assistance. Use integer pence and test duplicate references, partial payments and missing records.', evidence: 'Deterministic fixtures, a repeatable test command and an explanation of edge cases.' },
  ];
  return <>
    <div className="career-section-title"><h2>What to build and keep</h2><p>Keep the repo, test report and a short walkthrough together in Project Lab.</p></div>
    <div className="career-grid">
      {labs.map(lab => <article className="career-card" key={lab.project}>
        <span className="eyebrow">{lab.label}</span><h3>{lab.title}</h3><p>{lab.text}</p>
        <div className="career-inset"><strong>Evidence to keep</strong><p>{lab.evidence}</p></div>
        <button className="text-button" onClick={() => openProject(lab.project)}>Open project brief <ArrowUpRight size={15}/></button>
        {lab.project === 'payment-exceptions' && <div className="career-downloads">
          <a className="text-button" href="/career-labs/payment-exceptions-workbook.md" download>Download workbook <ArrowUpRight size={14}/></a>
          <a className="text-button" href="/career-labs/payment-exceptions-cases.json" download>Download 25 labelled cases <ArrowUpRight size={14}/></a>
        </div>}
      </article>)}
      <article className="career-card">
        <span className="eyebrow">CLOUD PRACTICE</span><h3>Operate one small workflow</h3>
        <p>Try a custom tool in Microsoft Foundry and trace a failed lookup. For AWS practice, let a Lambda read a synthetic transcript from S3 with scoped IAM access, then trace bad input in CloudWatch.</p>
        <div className="career-inset"><strong>Evidence to keep</strong><p>One working request, a failed request, a sanitized trace and a runbook that another engineer can follow.</p></div>
        <a className="text-button" href={careerSources.foundry.url} target="_blank" rel="noreferrer">Open Foundry lab <ExternalLink size={14}/></a>
      </article>
    </div>
  </>;
}

const interviewDrills = [...drills, ...automationDrills, ...roboticsDrills];

function InterviewPractice({ records, save, notify, openProject, selected, setSelected }: StudioProps & { selected: string; setSelected: (id: string) => void }) {
  const drill = interviewDrills.find(item => item.id === selected) || interviewDrills[0];
  return <>
    <div className="career-section-title"><h2>Practise out loud, against the clock</h2><p>Attempt a prompt independently, then score your answer and save what you’d improve. Follow each employer’s rules when you interview.</p></div>
    <div className="career-drill-grid">
      <div className="career-drill-list" aria-label="Interview exercises">
        {interviewDrills.map(item => <button key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>
          <span className="eyebrow">{item.type} · {item.minutes} min</span>
          <strong>{item.title}</strong>
          {records['career:drill/' + item.id]?.completed && <Check size={16} aria-label="Attempt logged"/>}
        </button>)}
      </div>
      <Drill key={drill.id} drill={drill} entry={records['career:drill/' + drill.id]} save={value => save('career:drill/' + drill.id, value)} notify={notify} openProject={openProject}/>
    </div>
  </>;
}

function Drill({ drill, entry, save, notify, openProject }: {
  drill: typeof interviewDrills[number];
  entry?: Entry;
  save: (entry: Entry) => void;
  notify: StudioProps['notify'];
  openProject: StudioProps['openProject'];
}) {
  const duration = drill.minutes * 60;
  const [remaining, setRemaining] = useState(duration);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [note, setNote] = useState<string>();
  const [checks, setChecks] = useState<string[]>();
  useEffect(() => {
    if (deadline === null) return;
    const timer = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (!left) setDeadline(null);
    }, 250);
    return () => window.clearInterval(timer);
  }, [deadline]);
  const chosen = checks ?? entry?.checks ?? [];
  const text = note ?? entry?.note ?? '';
  const displayedTime = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  return <article className="career-card career-drill">
    <span className="eyebrow">{drill.type}</span>
    <h3>{drill.title}</h3><p>{drill.prompt}</p>
    <div className="career-inset"><strong>Practice input</strong><p>{drill.example}</p></div>
    <div className="career-actions career-timer">
      <span aria-label={displayedTime + ' remaining'}><Clock3 size={16}/>{displayedTime}</span>
      <button className="button secondary" disabled={!remaining} onClick={() => deadline === null ? setDeadline(Date.now() + remaining * 1000) : setDeadline(null)}>{deadline !== null ? 'Pause' : remaining === duration ? 'Start timer' : 'Resume'}</button>
      <button className="text-button" onClick={() => { setRemaining(duration); setDeadline(null); }}>Reset timer</button>
    </div>
    <details className="career-details">
      <summary>Reveal scoring rubric</summary>
      <p>Give yourself one point for each criterion you can demonstrate.</p>
      <div className="checklist">{drill.rubric.map((item, index) => {
        const key = String(index);
        return <label key={item}><input type="checkbox" checked={chosen.includes(key)} onChange={event => setChecks(event.target.checked ? [...chosen, key] : chosen.filter(value => value !== key))}/><span>{item}</span></label>;
      })}</div>
    </details>
    <label className="input-label" htmlFor={'drill-notes-' + drill.id}>What worked, what failed and what to practise next</label>
    <textarea id={'drill-notes-' + drill.id} rows={4} maxLength={5000} value={text} onChange={event => setNote(event.target.value)} placeholder="Add a short reflection or a link to your attempt."/>
    <div className="career-actions">
      <button className="button" disabled={!text.trim()} onClick={() => {
        const elapsed = duration - (deadline === null ? remaining : Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
        setDeadline(null);
        setRemaining(duration - elapsed);
        save({ ...entry, completed: true, title: drill.title, note: text.trim(), checks: chosen, date: new Date().toISOString(), elapsedSeconds: elapsed || undefined });
        notify('Interview attempt saved.');
      }}>Save attempt <Check size={15}/></button>
      <button className="text-button" onClick={() => openProject(drill.project)}>Open related project <ArrowUpRight size={14}/></button>
    </div>
    {entry?.completed && <p className="fine-print">Last attempt scored {entry.checks?.length || 0}/{drill.rubric.length}{entry.elapsedSeconds ? ' · ' + Math.ceil(entry.elapsedSeconds / 60) + ' min timed' : ''}.</p>}
  </article>;
}

const statusLabels: Record<RequirementStatus, string> = {
  gap: 'Gap to address',
  practice: 'Practising',
  evidence: 'Evidence ready',
};

function ContractReadiness({ records, save, notify, openAutomation }: StudioProps & { openAutomation: () => void }) {
  const [selected, setSelected] = useState('new');
  const roles = Object.entries(records).filter(([key]) => key.startsWith('career:role/'));
  const role = roles.find(([key]) => key === selected)?.[1] || {};
  return <>
    <section className="career-feature">
      <div><span className="eyebrow">JOB AND CONTRACT PREPARATION</span><h2>Map each role to your evidence.</h2><p>Use a blank board or start with a template. Prioritise what the advert actually requires, and keep a link to the evidence or practice task for each item.</p></div>
      <button className="button secondary" onClick={openAutomation}>Open automation training <ArrowRight size={16}/></button>
    </section>
    <div className="career-grid career-resources">
      <article className="career-card"><span className="eyebrow">AZURE CREDENTIALS</span><h3>Start with the Foundry lab</h3><p>Build and test one workflow before targeting AI-103. Use AI-901 material to fill fundamentals gaps.</p>
        {[careerSources.foundry, careerSources.associate, careerSources.fundamentals, careerSources.evaluation].map(resource => <a key={resource.url} className="security-reference" href={resource.url} target="_blank" rel="noreferrer">{resource.title}<ExternalLink size={14}/></a>)}
      </article>
      <article className="career-card"><span className="eyebrow">BUSINESS ANALYSIS & DELIVERY</span><h3>Practise the work of change</h3><p>Map a process, write acceptance criteria, keep a RAID log and lead a UAT walkthrough. Where possible, use a real reporting or process change to practise stakeholder discovery and sign-off.</p>
        {[careerSources.analysis, careerSources.delivery].map(resource => <a key={resource.url} className="security-reference" href={resource.url} target="_blank" rel="noreferrer">{resource.title}<ExternalLink size={14}/></a>)}
      </article>
    </div>
    <section className="career-card career-role">
      <div className="career-actions">
        <div><h2>Job description practice board</h2><p>Save a role, add its requirements and attach an honest example or a practical to close each gap.</p></div>
        <button className="button secondary" onClick={() => setSelected('new')}><Plus size={15}/>New role</button>
      </div>
      {roles.length > 0 && <><label className="input-label" htmlFor="career-role-select">Choose a saved role or draft</label>
      <select id="career-role-select" value={selected} onChange={event => setSelected(event.target.value)}>
        <option value="new">New role draft</option>
        {roles.map(([key, entry]) => <option key={key} value={key}>{entry.title}</option>)}
      </select></>}
      <RoleEditor key={selected} entry={role} isNew={selected === 'new'} onSave={value => {
        const key = selected === 'new' ? 'career:role/' + crypto.randomUUID() : selected;
        save(key, value);
        setSelected(key);
        notify('Role and evidence saved.');
      }}/>
    </section>
  </>;
}

function RoleEditor({ entry, isNew, onSave }: { entry: Entry; isNew: boolean; onSave: (value: Entry) => void }) {
  const [draft, setDraft] = useState<Partial<Entry>>({});
  const [requirement, setRequirement] = useState('');
  const [template, setTemplate] = useState('');
  const { title = '', url = '', roleDescription = '', requirements = [] } = { ...entry, ...draft };
  const mustHaves = requirements.filter(item => item.priority !== 'desirable');
  const hasEvidence = (item: RoleRequirement) => item.status === 'evidence' && !!item.evidence.trim();
  function changeRequirement(index: number, value: Partial<RoleRequirement>) {
    setDraft({ ...draft, requirements: requirements.map((item, position) => position === index ? { ...item, ...value } : item) });
  }
  function appendRequirements(lines: string[]) {
    const unique = [...new Set(lines.map(line => line.trim().slice(0, 250)).filter(Boolean))];
    const newItems = unique.filter(line => !requirements.some(item => item.text === line));
    return [...requirements, ...newItems.map((text): RoleRequirement => ({ text, status: 'gap', evidence: '', priority: 'essential' }))].slice(0, 20);
  }
  function addRequirements() {
    setDraft({ ...draft, requirements: appendRequirements(requirement.split('\n')) });
    setRequirement('');
  }
  return <form onSubmit={event => {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({ ...entry, title: title.trim(), url: url.trim(), roleDescription: roleDescription.trim(),
      requirements: appendRequirements(requirement.split('\n')) });
    setDraft({});
    setRequirement('');
  }}>
    <label className="input-label" htmlFor="career-role-title">Role title</label>
    <input id="career-role-title" value={title} required maxLength={180} onChange={event => setDraft({ ...draft, title: event.target.value })} placeholder="Applied AI Engineer"/>
    <label className="input-label" htmlFor="career-role-url">Job advert link (optional)</label>
    <input id="career-role-url" type="url" pattern="https?://.+" maxLength={1000} value={url} onChange={event => setDraft({ ...draft, url: event.target.value })} placeholder="https://…"/>
    <label className="input-label" htmlFor="career-role-description">Advert or role notes</label>
    <textarea id="career-role-description" value={roleDescription} rows={4} maxLength={12000} onChange={event => setDraft({ ...draft, roleDescription: event.target.value })} placeholder="Paste the advert or note the deliverables, experience, working arrangements and interview process."/>
    <div className="career-role-template">
      <label className="input-label" htmlFor="career-role-template">Optional requirements template</label>
      <div><select id="career-role-template" value={template} onChange={event => setTemplate(event.target.value)}>
        <option value="">Choose a role template</option>
        {roleTemplates.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <button type="button" className="button secondary" disabled={!template || requirements.length >= 20} onClick={() => {
        const selectedTemplate = roleTemplates.find(item => item.id === template);
        if (selectedTemplate) setDraft({ ...draft, requirements: appendRequirements(selectedTemplate.requirements) });
      }}><Plus size={14}/>Add template requirements</button></div>
    </div>
    {requirements.length > 0 && <div className="career-requirements">
      <h3>{requirements.filter(hasEvidence).length} of {requirements.length} requirements with evidence</h3>
      <p>{mustHaves.filter(hasEvidence).length} of {mustHaves.length} essential requirements with evidence</p>
      {requirements.map((item, index) => <fieldset className="career-inset" key={item.text}>
        <legend>{item.text}</legend>
        <div className="career-requirement-row career-requirement-priority">
          <select aria-label={'Priority for ' + item.text} value={item.priority || 'essential'} onChange={event => changeRequirement(index, { priority: event.target.value as RoleRequirement['priority'] })}>
            <option value="essential">Essential</option><option value="desirable">Desirable</option>
          </select>
          <select aria-label={'Status for ' + item.text} value={item.status} onChange={event => changeRequirement(index, { status: event.target.value as RequirementStatus })}>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <input aria-label={'Evidence or practice for ' + item.text} placeholder="Evidence link, example or next practice" value={item.evidence} maxLength={700} onChange={event => changeRequirement(index, { evidence: event.target.value })}/>
          <button type="button" className="text-button" aria-label={'Remove ' + item.text} onClick={() => setDraft({ ...draft, requirements: requirements.filter((_, position) => position !== index) })}>Remove</button>
        </div>
      </fieldset>)}
    </div>}
    {requirements.length < 20 && <><label className="input-label" htmlFor="career-role-requirement">Add requirements, one per line</label>
      <textarea id="career-role-requirement" value={requirement} rows={2} maxLength={1500} onChange={event => setRequirement(event.target.value)} placeholder="Write acceptance criteria and run user acceptance testing"/>
      <button className="text-button career-add-requirement" type="button" disabled={!requirement.trim()} onClick={addRequirements}><Plus size={14}/>Add to board</button></>}
    <div className="career-actions"><button className="button" type="submit">{isNew ? 'Save new role' : 'Save role and evidence'} <Check size={15}/></button></div>
  </form>;
}

function CoursePlanner({ records, save, notify, openSyllabus }: StudioProps & { openSyllabus: (id: SyllabusId) => void }) {
  const saved = records['career:course-plan'];
  const [draft, setDraft] = useState<Partial<typeof defaultPlan>>({});
  const [progressDrafts, setProgressDrafts] = useState<Record<string, string>>({});
  const [track, setTrack] = useState('All');
  const { start, hours, practice } = {
    start: saved?.startedOn ?? defaultPlan.start,
    hours: saved?.weeklyGoal ?? defaultPlan.hours,
    practice: saved?.practiceMinutes ?? defaultPlan.practice,
    ...draft,
  };
  const filtered = coursePlan.filter(course => track === 'All' || course.track === track);
  let total = 0;
  const planned = filtered.map(course => {
    const prior = records['career:course/' + course.id]?.progressPercent ?? course.progress;
    const progress = progressDrafts[course.id] ? Math.min(100, Math.max(0, Number(progressDrafts[course.id]))) : prior;
    const remaining = course.minutes * (1 - progress / 100);
    total += remaining;
    return { ...course, prior, remaining, date: remaining ? finishDate(start, hours, Math.ceil(total * (1 + practice / 60))) : null };
  });
  const finish = finishDate(start, hours, Math.ceil(total * (1 + practice / 60)));
  return <>
    <div className="career-section-title"><h2>Plan the Udemy courses around your week</h2><p>Full-course estimates for your five AI courses, AWS and the other courses you listed. Follow My learning path for the selected lectures and practical checkpoints.</p></div>
    <section className="career-card">
      <form className="career-planner-form" onSubmit={event => {
        event.preventDefault();
        save('career:course-plan', { ...saved, startedOn: start, weeklyGoal: hours, practiceMinutes: practice });
        setDraft({});
        notify('Course schedule saved.');
      }}>
        <label>Start date<input type="date" value={start} required min="2026-01-01" max="2035-12-31" onChange={event => setDraft({ ...draft, start: event.target.value })}/></label>
        <label>Hours per week<input type="number" value={hours || ''} min={1} max={39} required onChange={event => setDraft({ ...draft, hours: Number(event.target.value) })}/></label>
        <label>Practice per video hour<select value={practice} onChange={event => setDraft({ ...draft, practice: Number(event.target.value) })}>
          <option value={0}>Video only</option><option value={30}>30 minutes</option><option value={60}>60 minutes</option>
        </select></label>
        <button type="submit" className="button">Save schedule <Check size={15}/></button>
      </form>
      <details className="career-details career-schedule">
        <summary>Your provisional study blocks</summary>
        <dl>{studyBlocks.map(day => <div key={day.day}><dt>{day.day}</dt><dd>{day.slots}</dd></div>)}</dl>
        <p>39 hours maximum. Use one Saturday afternoon or evening block. Carry missed work to the next available block.</p>
      </details>
    </section>
    <section className="career-card career-courses">
      <div className="career-actions">
        <div><h3>{Math.round(total / 60)} video hours remaining</h3><p>{finish ? 'Estimated finish ' + formatPlanDate(finish) : 'Update your schedule or course progress to see an estimate.'}</p></div>
        <label className="career-course-filter">Show courses<select value={track} onChange={event => setTrack(event.target.value)}>
          {['All', 'AI', 'Cloud', 'Other'].map(option => <option key={option} value={option}>{option}</option>)}
        </select></label>
      </div>
      <div className="career-table-wrap"><table>
        <thead><tr><th scope="col">Course</th><th scope="col">Progress (%)</th><th scope="col">Video left</th><th scope="col">Estimated finish</th></tr></thead>
        <tbody>{planned.map(course => <tr key={course.id}>
          <th scope="row">{course.title}<small>{course.track}</small>{isSyllabusCourse(course.id) && <button className="text-button syllabus-planner-link" onClick={() => { if (isSyllabusCourse(course.id)) openSyllabus(course.id); }}>View syllabus <ArrowUpRight size={12}/></button>}</th>
          <td><input type="number" min={0} max={100} aria-label={course.title + ' progress percentage'} value={progressDrafts[course.id] ?? course.prior} onChange={event => setProgressDrafts({ ...progressDrafts, [course.id]: event.target.value })} onBlur={event => {
            const next = event.target.value.trim() ? Math.min(100, Math.max(0, Math.round(Number(event.target.value)))) : course.prior;
            if (next !== course.prior) save('career:course/' + course.id, { progressPercent: next });
            setProgressDrafts(current => Object.fromEntries(Object.entries(current).filter(([id]) => id !== course.id)));
          }} onKeyDown={event => { if (event.key === 'Enter') event.currentTarget.blur(); }}/></td>
          <td>{hoursAndMinutes(course.remaining)}</td><td>{course.remaining ? formatPlanDate(course.date) : 'Completed'}</td>
        </tr>)}</tbody>
      </table></div>
      <p className="fine-print">Dates assume sequential study in the shown order and use your saved progress to estimate video left. These estimates include your chosen practice allowance.</p>
    </section>
  </>;
}

function hoursAndMinutes(value: number) {
  const minutes = Math.round(value);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m` : minutes + 'm';
}
