import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, Calendar, CheckCircle, XCircle, Rocket, Search, Filter, ArrowRight, Eye, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css'; // Reusing dashboard styles

const HiringAdmin = () => {
  const { allUsers, matches, scheduleInterview, selectForHiring, updateMatchStatus } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'All') return matchesSearch;
    if (filterStatus === 'Elite') return matchesSearch && user.isElite;
    if (filterStatus === 'Interviewing') return matchesSearch && matches.some(m => m.talentName === user.name && m.status === 'Interview');
    if (filterStatus === 'Hired') return matchesSearch && matches.some(m => m.talentName === user.name && m.status === 'Hired');
    return matchesSearch;
  });

  const getUserMatches = (userName) => matches.filter(m => m.talentName === userName);

  const handleScheduleInterview = async (matchId) => {
    if (!interviewDate) {
      alert("Please select a date.");
      return;
    }
    await scheduleInterview(matchId, interviewDate);
    alert("Interview scheduled!");
    setInterviewDate('');
  };

  const handleHire = async (matchId) => {
    if (window.confirm("Are you sure you want to hire this talent?")) {
      await selectForHiring(matchId, 'Selected');
      alert("Talent hired successfully!");
    }
  };

  const handleReject = async (matchId) => {
    if (window.confirm("Are you sure you want to reject this applicant?")) {
      await selectForHiring(matchId, 'Rejected');
      alert("Applicant rejected.");
    }
  };

  return (
    <div className="dashboard-page animate-fade-in" style={{ padding: '2rem' }}>
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title text-gradient" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={32} /> Talent Workflow
          </h1>
          <p className="page-subtitle">Observe user progression, schedule interviews, and finalize hiring decisions.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Talents</span>
            <span className="stat-value">{allUsers.length}</span>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper purple">
            <Rocket size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Elite Pool</span>
            <span className="stat-value">{allUsers.filter(u => u.isElite).length}</span>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Hired</span>
            <span className="stat-value">{matches.filter(m => m.status === 'Hired').length}</span>
          </div>
        </div>
      </div>
      
      {/* Incoming Applications */}
      <div className="glass-panel" style={{ marginBottom: '2.5rem', border: '1px solid rgba(59,130,246,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
             <Clock size={20} /> Incoming Talent Applications
          </h3>
          <span style={{ background: 'var(--accent-primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>
            {matches.filter(m => m.status === 'Pending Approval').length} New
          </span>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {matches.filter(m => m.status === 'Pending Approval').length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>No pending applications currently.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matches.filter(m => m.status === 'Pending Approval').map((app, i) => (
                <div key={app._id || i} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{app.talentName} → {app.startupName}</h4>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Applied for: <strong>{app.role}</strong></p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => updateMatchStatus(app._id, 'Rejected')}
                    >
                      Reject
                    </button>
                    <button 
                      className="btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => updateMatchStatus(app._id, 'Offered')}
                    >
                      Approve & Send Proposal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search talent by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', background: 'var(--bg-color-secondary)', border: '1px solid var(--glass-border)', color: 'white' }}
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-color-secondary)', border: '1px solid var(--glass-border)', color: 'white' }}
          >
            <option value="All">All Talents</option>
            <option value="Elite">Elite Only</option>
            <option value="Interviewing">In Interview</option>
            <option value="Hired">Hired</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '1rem' }}>TALENT NAME</th>
                <th style={{ padding: '1rem' }}>READINESS SCORE</th>
                <th style={{ padding: '1rem' }}>RANK</th>
                <th style={{ padding: '1rem' }}>STATUS</th>
                <th style={{ padding: '1rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => {
                const userMatch = getUserMatches(user.name)[0];
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontWeight: 700 }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{user.email || 'Email Private'}</div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <span className="text-gradient" style={{ fontWeight: 800 }}>{user.score || 0}%</span>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        background: user.isElite ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: user.isElite ? 'var(--success)' : 'var(--text-secondary)',
                        border: `1px solid ${user.isElite ? 'var(--success)' : 'var(--glass-border)'}`
                      }}>
                        {user.rank || 'Unranked'}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                       <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                          {userMatch ? userMatch.status : 'No Proposal'}
                       </span>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <button className="btn-secondary" onClick={() => setSelectedUser(user)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                        <Eye size={14} /> View Progress
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details / Actions Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div 
            className="modal-overlay" 
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div 
              className="glass-panel" 
              style={{ width: '700px', maxWidth: '95vw', padding: '3rem', maxHeight: '90vh', overflowY: 'auto' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '2rem' }}>{selectedUser.name}</h2>
                <p style={{ opacity: 0.7 }}>Progression Track & AI Analysis</p>
              </div>

              <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>AI Resume Analysis</h4>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{selectedUser.marketAnalysis || 'No market analysis available yet.'}</p>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Skill Set</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedUser.skills?.map((s, i) => (
                      <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                        {s.name} ({s.score}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--accent-primary)' }}>
                <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <Calendar size={18} /> Hiring Actions
                </h4>
                
                {getUserMatches(selectedUser.name).length > 0 ? (
                  getUserMatches(selectedUser.name).map((match, idx) => (
                    <div key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                          <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>PROPOSED ROLE</p>
                          <p style={{ fontWeight: 800 }}>{match.role} @ {match.startupName}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>CURRENT STATUS</p>
                          <p style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{match.status}</p>
                        </div>
                      </div>

                      {match.status === 'Offered' && (
                        <div className="status-box warning" style={{ textAlign: 'center' }}>
                           <p>Waiting for talent to accept the proposal.</p>
                        </div>
                      )}

                      {match.status === 'Accepted' && (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block', marginBottom: '0.5rem' }}>SCHEDULE INTERVIEW</label>
                            <input 
                              type="datetime-local" 
                              value={interviewDate}
                              onChange={(e) => setInterviewDate(e.target.value)}
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                          </div>
                          <button className="btn-primary" onClick={() => handleScheduleInterview(match._id)}>
                             Set Date
                          </button>
                        </div>
                      )}

                      {match.status === 'Interview' && (
                        <div>
                           <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--accent-primary)' }}>
                              <p style={{ fontSize: '0.85rem' }}><strong>Scheduled for:</strong> {new Date(match.interviewDate).toLocaleString()}</p>
                           </div>
                           <div style={{ display: 'flex', gap: '1rem' }}>
                              <button className="btn-primary" style={{ flex: 1, background: 'var(--success)' }} onClick={() => handleHire(match._id)}>
                                 <CheckCircle size={18} /> Confirm Hire
                              </button>
                              <button className="btn-secondary" style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleReject(match._id)}>
                                 <XCircle size={18} /> Reject
                              </button>
                           </div>
                        </div>
                      )}

                      {match.status === 'Hired' && (
                        <div className="status-box success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                           <CheckCircle size={24} style={{ marginBottom: '0.5rem' }} />
                           <p><strong>This talent has been hired!</strong></p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <p style={{ opacity: 0.6, marginBottom: '1.5rem' }}>No active proposals for this user yet.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                       <div>
                          <label style={{ fontSize: '0.75rem', opacity: 0.6 }}>PROPOSE TO STARTUP</label>
                          <select id="startup-select" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', color: 'white', marginTop: '0.4rem' }}>
                             <option>Select Startup...</option>
                             {useAppContext().allStartups.map((s, i) => (
                               <option key={i} value={s.title}>{s.title}</option>
                             ))}
                          </select>
                       </div>
                       <div>
                          <label style={{ fontSize: '0.75rem', opacity: 0.6 }}>ROLE</label>
                          <input id="role-input" type="text" placeholder="e.g. Senior AI Engineer" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', color: 'white', marginTop: '0.4rem' }} />
                       </div>
                       <button 
                        className="btn-primary full-width"
                        onClick={async () => {
                          const startup = document.getElementById('startup-select').value;
                          const role = document.getElementById('role-input').value;
                          if (startup === 'Select Startup...' || !role) {
                            alert("Please fill in all details.");
                            return;
                          }
                          await useAppContext().createMatch(selectedUser.name, startup, role, `Proposal from Admin: Matching your ${selectedUser.skills[0]?.name || 'expertise'} with ${startup}'s requirements.`);
                          alert("Proposal Sent!");
                          setSelectedUser(null);
                        }}
                       >
                         Send Project Proposal
                       </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="btn-secondary full-width" onClick={() => setSelectedUser(null)} style={{ marginTop: '2rem' }}>
                Close Portal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HiringAdmin;
