'use client';

import { ArrowRight, ArrowUpRight, Download, ExternalLink } from 'lucide-react';
import { automationLabs, automationSkills, automationVacancies, automationWeeks } from '@/lib/automation';
import type { Entry, Records } from '@/lib/practice';

export default function AutomationStudio({ records, save, openProject, openInterviews, openBoard }: {
  records: Records;
  save: (key: string, value: Entry) => void;
  openProject: (id: string) => void;
  openInterviews: () => void;
  openBoard: () => void;
}) {
  return <>
    <section className="career-feature">
      <div><span className="eyebrow">AI AUTOMATION ENGINEERING</span><h2>Build workflows you can support.</h2><p>Use n8n to learn orchestration alongside Python or TypeScript for integration and testing. Use the Microsoft lab when a role asks for Power Platform.</p></div>
      <button className="button" onClick={() => openProject('automation-support-triage')}>Start the n8n lab <ArrowRight size={16}/></button>
    </section>
    <section className="career-card automation-plan">
      <h2>Three weeks of practical work</h2><p>Reserve two or three of your existing practical sessions each week and work through these outcomes in order.</p>
      <ol>{automationWeeks.map(week => {
        const key = 'career:automation/' + week.id;
        const entry = records[key];
        return <li key={week.id}><label><input type="checkbox" checked={!!entry?.completed} onChange={event => save(key, { ...entry, completed: event.target.checked })}/><span><strong>{week.title}</strong><small>{week.task}</small></span></label></li>;
      })}</ol>
      <button className="text-button" onClick={openInterviews}>Practise the automation interview <ArrowRight size={15}/></button>
    </section>
    <div className="career-section-title automation-section"><h2>Portfolio projects</h2><p>Keep a workflow export, tests, a failure-and-recovery demo and results you can explain.</p></div>
    <div className="career-grid">
      {automationLabs.map(lab => <article className="career-card" key={lab.id}>
        <span className="eyebrow">{lab.platform}</span><h3>{lab.title}</h3><p>{lab.description}</p>
        <div className="career-inset"><strong>Evidence to keep</strong><p>{lab.proof}</p></div>
        <button className="text-button" onClick={() => openProject(lab.id)}>Open {lab.title} <ArrowUpRight size={15}/></button>
        {lab.id === 'automation-support-triage' && <div className="career-downloads"><a className="text-button" href="/career-labs/automation-practice-workbook.md" download><Download size={14}/>Workbook</a><a className="text-button" href="/career-labs/automation-practice-cases.json" download><Download size={14}/>Practice fixtures</a></div>}
      </article>)}
    </div>
    <section className="career-card automation-section">
      <h2>Skills to look for in job descriptions</h2>
      <div className="career-table-wrap automation-matrix"><table>
        <thead><tr><th scope="col">Area</th><th scope="col">What to practise</th><th scope="col">What to show</th></tr></thead>
        <tbody>{automationSkills.map(item => <tr key={item.skill}><th scope="row">{item.skill}</th><td>{item.practice}</td><td>{item.evidence}</td></tr>)}</tbody>
      </table></div>
      <button className="text-button" onClick={openBoard}>Open the job requirements board <ArrowRight size={15}/></button>
    </section>
    <section className="career-card automation-section">
      <h2>UK role examples</h2><p>Reviewed 18 November 2026. Check the vacancy status and compare responsibilities, required experience, platforms and working arrangements.</p>
      {automationVacancies.map(job => <a className="security-reference" key={job.url} href={job.url} target="_blank" rel="noreferrer">{job.title}<ExternalLink size={14}/></a>)}
    </section>
  </>;
}
