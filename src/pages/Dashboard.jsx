import React, { useState } from 'react';
import { Target, TrendingUp, Award, Zap, Rocket, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import SkillIntelligence from '../components/SkillIntelligence';
import OpportunityFeed from '../components/OpportunityFeed';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { userProfile, clearData, t, matches, updateMatchStatus } = useAppContext();
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState(null);

  if (!userProfile) {
    navigate('/onboarding');
    return null;
  }

  const handleReset = () => {
    clearData();
    navigate('/onboarding');
  };

  const getRankColor = () => {
    if (analysisScore >= 90) return 'var(--success)';
    if (analysisScore >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  const analysisScore = userProfile.score || 0;
  const analysisRank = userProfile.rank || "Unknown";

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">{t.dashboard}: {userProfile.name}</h1>
          <p className="page-subtitle">
            <span style={{ fontSize: '0.9rem', opacity: 0.7, marginRight: '1rem' }}>{userProfile.email}</span>
            Your Skill Readiness Score: <span className="text-gradient" style={{ fontWeight: 800 }}>{analysisScore}%</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/startup-portal')}>
            <Rocket size={18} /> {t.startup}
          </button>
          <button className="btn-secondary" onClick={handleReset} style={{borderColor: 'var(--danger)', color: 'var(--danger)'}}>
            <Zap size={18} /> Reset Hub
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rank-banner glass-panel" 
        style={{ borderLeft: `8px solid ${getRankColor()}`, background: 'var(--bg-color-secondary)' }}
      >
        <div className="rank-main">
          <Award size={48} style={{ color: getRankColor() }} />
          <div>
            <h3>Current Rank: {analysisRank}</h3>
            <p>You are in the top {100 - analysisScore}% of digital talent in your region.</p>
          </div>
        </div>
        <div className="rank-action">
          {analysisScore >= 90 ? (
            <div className="job-ready-badge">
              <CheckCircle size={20} /> JOB READY
            </div>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/learning')}>
              Improve Score <ArrowRight size={16} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Employment Pipeline Tracks */}
      {matches.filter(m => m.talentName === userProfile.name).map(match => (
        <motion.div 
          key={match._id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel" 
          style={{ 
            marginTop: '1.5rem', 
            background: match.status === 'Hired' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            border: `2px solid ${match.status === 'Hired' ? 'var(--success)' : 'var(--accent-primary)'}`,
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: match.status === 'Hired' ? 'var(--success)' : 'var(--accent-primary)', padding: '0.75rem', borderRadius: '50%', color: 'white' }}>
              <Rocket size={32} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: match.status === 'Hired' ? 'var(--success)' : 'var(--accent-primary)' }}>
                {match.status === 'Offered' ? 'New Industrial Proposal!' : 
                 match.status === 'Accepted' ? 'Proposal Accepted' :
                 match.status === 'Interview' ? 'Interview Round' : 'Hired!'}
              </h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '1.1rem' }}>
                {match.status === 'Offered' && `The Admin has proposed a project at ${match.startupName} as a ${match.role}.`}
                {match.status === 'Accepted' && `Waiting for admin to schedule your interview at ${match.startupName}.`}
                {match.status === 'Interview' && `Prepare for your interview at ${match.startupName}. Check your email for details.`}
                {match.status === 'Hired' && `Congratulations! You are officially hired at ${match.startupName}.`}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {match.status === 'Offered' && (
              <button 
                className="btn-primary" 
                style={{ padding: '0.8rem 2rem' }} 
                onClick={() => setSelectedOffer(match)}
              >
                View Project Details <ArrowRight size={18} />
              </button>
            )}
            {match.status === 'Hired' && (
              <div className="job-ready-badge" style={{ padding: '0.8rem 2rem' }}>
                <CheckCircle size={20} /> HIRED
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div 
          className="modal-overlay" 
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setSelectedOffer(null)}
        >
          <motion.div 
            className="glass-panel" 
            style={{ width: '600px', maxWidth: '95vw', padding: '3rem', textAlign: 'center' }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-gradient">Project Proposal</h2>
            <div style={{ margin: '1.5rem 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', opacity: 0.6 }}>COMPANY</label>
                  <p style={{ fontWeight: 800 }}>{selectedOffer.startupName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <label style={{ fontSize: '0.75rem', opacity: 0.6 }}>ROLE</label>
                  <p style={{ fontWeight: 800 }}>{selectedOffer.role}</p>
                </div>
              </div>
              
              <label style={{ fontSize: '0.75rem', opacity: 0.6 }}>PROJECT SCOPE & DETAILS</label>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                {selectedOffer.projectDetails}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1 }} 
                onClick={async () => {
                  await updateMatchStatus(selectedOffer._id, 'Accepted');
                  alert("Offer Accepted! The Admin will now schedule your interview.");
                  setSelectedOffer(null);
                }}
              >
                Accept & Progress
              </button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedOffer(null)}>
                Decline
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper blue">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Market Demand</span>
            <span className="stat-value">High</span>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper green">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Next Milestone</span>
            <span className="stat-value">Elite Certification</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper purple">
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">AI Insights</span>
            <span className="stat-value">3 Paths Found</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3>{t.learning} Recommendations</h3>
            <button className="btn-secondary" onClick={() => navigate('/learning')}>View All</button>
          </div>
          <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'transparent' }}>
            {userProfile.skills && userProfile.skills.length > 0 ? (
              <div className="suggestion-card info">
                <h4>Dynamic Roadmap Active</h4>
                <p>Based on your <strong>{userProfile.skills[0]?.name}</strong> skills, our ecosystem is analyzing real market opportunities for you.</p>
              </div>
            ) : (
              <div className="suggestion-card warning">
                <h4>No Skills Found</h4>
                <p>Please complete your AI Skill Analysis to receive real industrial recommendations.</p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3>Skill Intelligence Analytics</h3>
            <button className="btn-secondary">View Deep Dive</button>
          </div>
          <div className="panel-content" style={{ background: 'transparent' }}>
            <SkillIntelligence />
          </div>
        </div>
      </div>

      <div className="motivational-footer" style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
        <p>"The only way to do great work is to love what you do." — Steve Jobs</p>
      </div>
    </div>
  );
};

export default Dashboard;
