import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Building2, Save, ArrowLeft, Users, PlusSquare, UserCheck } from 'lucide-react';
import './Onboarding.css';

const EmployerMode = () => {
  const { addOpportunity, opportunities } = useAppContext();
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);
  const [view, setView] = useState('post'); // 'post' or 'applicants'

  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    type: 'Full-Time',
    location: '',
    salary: '',
    urgent: false
  });

  const [reqSkills, setReqSkills] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedSkills = reqSkills.split(',').map(s => s.trim()).filter(s => s);
    
    addOpportunity({
      ...jobData,
      skillsRequired: formattedSkills,
    });

    setToast(true);
    setTimeout(() => {
      setToast(false);
      setView('applicants');
    }, 1500);
  };

  return (
    <div className="onboarding-page" style={{ alignItems: 'flex-start' }}>
      <div className="onboarding-card glass-panel animate-fade-in" style={{ marginTop: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Back to User Dashboard
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <Building2 /> MSME Employer Portal
          </h1>
          <div className="tab-group" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button 
              className={`btn-secondary ${view === 'post' ? 'active' : ''}`} 
              onClick={() => setView('post')}
              style={{ padding: '0.5rem 1rem', background: view === 'post' ? 'var(--accent-primary)' : 'transparent', color: 'var(--text-primary)', border: 'none' }}
            >
              <PlusSquare size={16} style={{ marginRight: '0.5rem' }} /> Post Job
            </button>
            <button 
              className={`btn-secondary ${view === 'applicants' ? 'active' : ''}`} 
              onClick={() => setView('applicants')}
              style={{ padding: '0.5rem 1rem', background: view === 'applicants' ? 'var(--accent-primary)' : 'transparent', color: 'var(--text-primary)', border: 'none' }}
            >
              <Users size={16} style={{ marginRight: '0.5rem' }} /> Applicants
            </button>
          </div>
        </div>

        {view === 'post' ? (
          <>
            <p>Post a gig or job instantly. Our AI will automatically match it with local digitally-empowered youth.</p>

            {toast && (
              <div style={{ background: 'var(--success)', color: 'var(--text-primary)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                Job successfully posted to the network!
              </div>
            )}

            <form onSubmit={handleSubmit} className="onboarding-form">
              <div className="form-section">
                <div className="form-group">
                  <label>Opportunity Title</label>
                  <input required type="text" name="title" value={jobData.title} onChange={handleChange} placeholder="e.g. Virtual Assistant" />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company/MSME Name</label>
                    <input required type="text" name="company" value={jobData.company} onChange={handleChange} placeholder="e.g. RuralCraft Co-Op" />
                  </div>
                  <div className="form-group">
                    <label>Employment Type</label>
                    <select name="type" value={jobData.type} onChange={handleChange} style={{background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '0.85rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)'}}>
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Partnership / Freelance</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Location</label>
                    <input required type="text" name="location" value={jobData.location} onChange={handleChange} placeholder="e.g. Remote or Local District" />
                  </div>
                  <div className="form-group">
                    <label>Salary/Revenue Range</label>
                    <input required type="text" name="salary" value={jobData.salary} onChange={handleChange} placeholder="e.g. ₹15,000 - ₹20,000/mo" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Skills Required (Comma separated)</label>
                  <input required type="text" value={reqSkills} onChange={e => setReqSkills(e.target.value)} placeholder="e.g. Digital Literacy, Customer Comms, Spreadsheets" />
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <input type="checkbox" name="urgent" checked={jobData.urgent} onChange={handleChange} style={{ width: 'auto' }} />
                  <label>Mark as Urgent Need</label>
                </div>
              </div>

              <button type="submit" className="btn-primary submit-btn">
                Publish Opportunity <Save size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="applicants-view">
            <h3 style={{ marginBottom: '1.5rem' }}>Recent Job Applications</h3>
            {opportunities.filter(o => o.applicants && o.applicants.length > 0).length === 0 ? (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No applications received yet for your posted jobs.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {opportunities
                  .filter(o => o.applicants && o.applicants.length > 0)
                  .map(job => (
                    <div key={job.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0 }}>{job.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{job.applicants.length} Applicant(s)</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {job.applicants.map((app, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-color-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div>
                              <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UserCheck size={16} className="text-gradient" /> {app.name}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{app.email}</div>
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                {app.skills.map((s, si) => (
                                  <span key={si} style={{ fontSize: '0.7rem', background: 'var(--bg-color-secondary)', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                                    {s.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                              <div style={{ marginTop: '0.5rem' }}>
                                <button className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Contact</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerMode;
