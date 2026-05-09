import React, { useState } from 'react';
import { Target, TrendingUp, Award, Zap, Rocket, ArrowRight, CheckCircle, Briefcase, MessageSquare, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import SkillIntelligence from '../components/SkillIntelligence';
import OpportunityFeed from '../components/OpportunityFeed';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { userProfile, clearData, t, matches, allStartups, updateMatchStatus, setIsChatOpen } = useAppContext();
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
          <h1 className="page-title">
            {t.dashboard}: {userProfile.name || 'Digital Talent'}
            {analysisScore >= 90 && (
              <span className="verified-badge">
                <CheckCircle size={14} /> VERIFIED TALENT
              </span>
            )}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <p className="page-subtitle">
              Your Skill Readiness Score: <span className="text-gradient" style={{ fontWeight: 800 }}>{analysisScore}%</span>
            </p>
          </div>
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
            <p>You are in the top {Math.max(1, 100 - analysisScore)}% of digital talent in your region.</p>
          </div>
        </div>
        <div className="rank-action">
          {analysisScore >= 90 ? (
            <div className="job-ready-badge">
              <CheckCircle size={20} /> JOB READY
            </div>
          ) : !userProfile.name || analysisScore === 0 ? (
            <button className="btn-primary" onClick={() => navigate('/onboarding')}>
              Activate AI Analyzer <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/learning')}>
              Improve Score <ArrowRight size={16} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Gig Management Summary */}
      <div className="dashboard-panel glass-panel" style={{ gridColumn: 'span 2' }}>
        <div className="panel-header">
          <h3>Workflow Summary</h3>
          <button className="btn-secondary" onClick={() => navigate('/gigs')}>
             <Briefcase size={16} /> Open Workflow Hub
          </button>
        </div>
        <div className="panel-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
             <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Proposals</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{matches.filter(m => m.talentName === userProfile?.name).length}</div>
             </div>
             <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Hired / Active</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{matches.filter(m => m.talentName === userProfile?.name && m.status === 'Hired').length}</div>
             </div>
             <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(245, 158, 11, 0.05)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Staked Points</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>2,500 SP</div>
             </div>
          </div>
        </div>
      </div>

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
            <Rocket size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Proposals</span>
            <span className="stat-value">{matches.filter(m => m.talentName === userProfile.name).length}</span>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper green">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Next Target</span>
            <span className="stat-value">{analysisScore >= 90 ? 'Elite Pool' : '90% Elite'}</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper purple">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Profile Status</span>
            <span className="stat-value">{analysisScore >= 90 ? 'Ready' : 'Learning'}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Discover Startups (Promoted) */}
        <div className="dashboard-panel glass-panel" style={{ border: '1px solid var(--accent-primary)', background: 'rgba(59, 130, 246, 0.03)' }}>
          <div className="panel-header">
            <h3>Discover Startups</h3>
            <button className="btn-primary" onClick={() => navigate('/matchmaker')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
               Matchmaker
            </button>
          </div>
          <div className="panel-content">
            <div className="suggestion-card info" style={{ borderLeftColor: 'var(--accent-primary)' }}>
              <h4>Elite Opportunities</h4>
              <p>We've found 12 ventures seeking your {userProfile.rank} level skills. Explore them now.</p>
            </div>
          </div>
        </div>

        {/* Market Outlook */}
        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3>Market Outlook</h3>
            <button className="btn-secondary" onClick={() => navigate('/onboarding')}>Analyze</button>
          </div>
          <div className="panel-content">
            <p style={{ fontSize: '0.95rem', opacity: 0.9, fontStyle: 'italic', color: 'var(--accent-primary)' }}>
               "{userProfile.marketAnalysis || 'Analyzing market trends...'}"
            </p>
          </div>
        </div>

        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3>Gap Analysis & Roadmap</h3>
            <button className="btn-secondary" onClick={() => navigate('/learning')}>Optimize</button>
          </div>
          <div className="panel-content">
            <div className="roadmap-container">
               <div className="roadmap-item">
                  <div className="roadmap-status complete">
                     <CheckCircle size={20} />
                  </div>
                  <div className="roadmap-info">
                     <h4>Phase 1: Skill Discovery</h4>
                     <p>Resume analyzed. Foundation identified.</p>
                  </div>
               </div>
               <div className="roadmap-item">
                  <div className={`roadmap-status ${analysisScore >= 90 ? 'complete' : 'active'}`}>
                     {analysisScore >= 90 ? <CheckCircle size={20} /> : <Zap size={20} />}
                  </div>
                  <div className="roadmap-info">
                     <h4>Phase 2: Elite Verification</h4>
                     <p>{analysisScore >= 90 ? 'Target achieved.' : `Currently at ${analysisScore}%. Needs 90% for Elite status.`}</p>
                  </div>
               </div>
               <div className="roadmap-item">
                  <div className={`roadmap-status ${analysisScore >= 90 ? 'active' : 'locked'}`}>
                     <Rocket size={20} />
                  </div>
                  <div className="roadmap-info">
                     <h4>Phase 3: Startup Matching</h4>
                     <p>Direct gateway to high-growth ventures.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3>Skill Intelligence Analytics</h3>
            <button className="btn-secondary">View Deep Dive</button>
          </div>
          <div className="panel-content">
            <SkillIntelligence />
          </div>
        </div>

        {/* Switch Role Panel */}
        <div className="dashboard-panel glass-panel" onClick={handleReset} style={{ cursor: 'pointer' }}>
          <div className="panel-header" style={{ border: 'none' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap className="text-warning" size={24} /> Switch Role / Home
            </h3>
          </div>
          <div className="panel-content" style={{ paddingTop: 0 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Transition between Talent and Entrepreneur modes or return home.</p>
          </div>
        </div>

        {/* Ask Assistant Panel */}
        <div className="dashboard-panel glass-panel" onClick={() => setIsChatOpen(true)} style={{ cursor: 'pointer' }}>
          <div className="panel-header" style={{ border: 'none' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MessageSquare className="text-primary" size={24} /> Ask SX Assistant
            </h3>
          </div>
          <div className="panel-content" style={{ paddingTop: 0 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Get immediate AI guidance on your career.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
