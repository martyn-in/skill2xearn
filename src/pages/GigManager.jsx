import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LayoutList, MoreHorizontal, CheckCircle } from 'lucide-react';
import './GigManager.css';

const GigManager = () => {
  const { opportunities } = useAppContext();
  
  // Get jobs the user applied to
  const appliedGigs = opportunities.filter(opp => opp.applied);

  return (
    <div className="gig-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LayoutList size={32} /> Gig Workforce Manager
        </h1>
        <p className="page-subtitle">Track your active applications, current gig milestones, and completed contracts.</p>
      </div>

      <div className="kanban-board">
        {/* Column 1: Applications */}
        <div className="kanban-column">
          <div className="column-header">
            <h3>Applied Pipeline</h3>
            <span className="count-badge">{appliedGigs.length}</span>
          </div>
          
          <div className="column-content">
            {appliedGigs.length === 0 ? (
              <div className="empty-state">No active applications. Check the Opportunity Feed!</div>
            ) : (
              appliedGigs.map(gig => (
                <div key={gig.id} className="kanban-card glass-panel">
                  <h4>{gig.title}</h4>
                  <span className="company">{gig.company}</span>
                  <div className="card-footer">
                    <span className="payment text-gradient">{gig.salary}</span>
                    <MoreHorizontal size={16} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Active Gigs */}
        <div className="kanban-column">
          <div className="column-header">
            <h3>Active in Progress</h3>
            <span className="count-badge">0</span>
          </div>
          
          <div className="column-content">
             <div className="empty-state">Move an application here once hired.</div>
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="kanban-column">
          <div className="column-header">
            <h3>Completed & Paid</h3>
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
