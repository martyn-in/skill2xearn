import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LayoutList, MoreHorizontal, CheckCircle, Users, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import './GigManager.css';

const GigManager = () => {
  const { matches, userProfile } = useAppContext();
  
  // Get jobs the user applied to or is in progress with
  const appliedGigs = (matches || []).filter(m => m.talentName === userProfile?.name);

  return (
    <div className="gig-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LayoutList size={32} /> Workflow Manager
        </h1>
        <p className="page-subtitle">Track your active applications, current gig milestones, and completed contracts.</p>
        
        <div className="gig-actions-bar" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div className="squad-toggle glass-panel" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <Users size={18} className="text-gradient" />
             <div style={{ fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700 }}>Squad Mode:</span> OFF
             </div>
             <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Enable</button>
          </div>
          <div className="staking-summary glass-panel" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <Zap size={18} style={{ color: 'var(--warning)' }} />
             <div style={{ fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700 }}>Staked Points:</span> 2,500 SP
             </div>
          </div>
          <button 
            className="btn-secondary" 
            style={{ padding: '0.5rem 1rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
            onClick={() => { if(window.confirm("Remove all workflows?")) useAppContext().removeAllMatches(); }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {/* Column 1: Applications */}
        <div className="kanban-column">
          <div className="column-header">
            <h3>Pending</h3>
            <span className="count-badge">{appliedGigs.length}</span>
          </div>
          
          <div className="column-content">
            {appliedGigs.length === 0 ? (
              <div className="empty-state">No active applications. Check the Opportunity Feed!</div>
            ) : (
              appliedGigs.map((gig, i) => (
                <div key={gig._id || i} className="kanban-card glass-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>{gig.role}</h4>
                    <ShieldCheck size={14} className="text-gradient" title="Skill Staked" />
                  </div>
                  <span className="company">{gig.startupName}</span>
                  <div className="card-footer">
                    <span className="payment text-gradient">{gig.status}</span>
                    <div className="card-tags">
                       <span className="tag-staking">STAKED</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Active Gigs */}
        <div className="kanban-column">
          <div className="column-header">
            <h3>Ongoing</h3>
            <span className="count-badge">0</span>
          </div>
          
          <div className="column-content">
             <div className="empty-state">Move an application here once hired.</div>
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="kanban-column">
          <div className="column-header">
            <h3>Settled</h3>
            <span className="count-badge">0</span>
          </div>
          
          <div className="column-content">
             <div className="empty-state">No completed gigs yet.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigManager;
