import React from 'react';
import { useAppContext } from '../context/AppContext';
import { MapPin, Briefcase, Zap, CheckCircle } from 'lucide-react';
import './OpportunityFeed.css';

const OpportunityFeed = () => {
  const { opportunities, applyToJob } = useAppContext();

  return (
    <div className="opportunity-feed">
      {opportunities.length === 0 && (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No opportunities found. Switch to Employer Portal to post one!
        </div>
      )}
      {opportunities.map((job) => (
        <div key={job.id} className={`job-card ${job.applied ? 'applied' : ''}`}>
          <div className="job-header">
            <div>
              <h4 className="job-title">{job.title}</h4>
              <span className="job-company">{job.company}</span>
            </div>
            {job.applied ? (
              <div className="match-badge high" style={{ background: 'var(--glass-border)', color: 'var(--text-secondary)' }}>
                Applied
              </div>
            ) : (
              <div className={`match-badge ${job.matchScore >= 85 ? 'high' : 'medium'}`}>
                <Zap size={14} />
                {job.matchScore}% Match
              </div>
            )}
          </div>
          
          <div className="job-meta">
            <span className="meta-item"><Briefcase size={14} /> {job.type}</span>
            <span className="meta-item"><MapPin size={14} /> {job.location}</span>
          </div>

          <div className="job-salary">{job.salary}</div>

          <div className="job-reason">
            <CheckCircle size={14} className="reason-icon" />
            <p>{job.matchReason}</p>
          </div>

          {!job.applied && (
            <div className="job-actions">
              <button className="btn-primary" onClick={() => applyToJob(job.id)} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Apply Now</button>
              <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Save & Track</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OpportunityFeed;
