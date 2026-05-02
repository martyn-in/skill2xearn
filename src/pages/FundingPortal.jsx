import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Landmark, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import './FundingPortal.css'; // Reusing global utilities where possible

const FundingPortal = () => {
  const { userProfile } = useAppContext();
  const [applied, setApplied] = useState({});

  // Ensure user exists, though route guard protects this usually
  if (!userProfile) return null;

  // Determine if grants are unlocked based on User Level
  const isUnlocked = userProfile.level === 'Expert' || userProfile.level === 'Intermediate';

  const handleApply = (id) => {
    setApplied(prev => ({ ...prev, [id]: true }));
  };

  const grants = [
    {
      id: 1,
      title: "Digital Connectivity Micro-Loan",
      amount: "₹10,000",
      purpose: "For purchasing a smartphone or broadband setup to empower remote work.",
      unlocked: isUnlocked,
    },
    {
      id: 2,
      title: "MSME Tooling Grant",
      amount: "₹25,000",
      purpose: "Non-repayable grant for raw materials and artisanal tools to scale local production.",
      unlocked: userProfile.level === 'Expert', // Only unlocked for Experts
    }
  ];

  return (
    <div className="funding-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Landmark size={32} /> Financial Inclusion Portal
        </h1>
        <p className="page-subtitle">Access micro-credit and grants designed to eliminate barriers to economic entry. Build your skills to unlock funding.</p>
      </div>

      <div className="funding-grid">
        {grants.map(grant => (
          <div key={grant.id} className={`grant-card glass-panel ${!grant.unlocked ? 'locked' : ''}`}>
            {!grant.unlocked && (
              <div className="locked-overlay">
                <Lock size={32} color="var(--text-secondary)" />
                <p>Skill Level Too Low to Unlock</p>
              </div>
            )}
            
            <div className={`grant-content ${!grant.unlocked ? 'blurred' : ''}`}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{grant.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', height: '40px' }}>{grant.purpose}</p>
              
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 'bold', color: 'var(--success)', marginBottom: '1.5rem' }}>
                {grant.amount}
              </div>

              {applied[grant.id] ? (
                <button className="btn-secondary" style={{ width: '100%', borderColor: 'var(--success)', color: 'var(--success)', cursor: 'default' }} disabled>
                  <CheckCircle size={18} style={{marginRight: '0.5rem'}} /> Request Submitted
                </button>
              ) : (
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleApply(grant.id)} disabled={!grant.unlocked}>
                  Submit Application <ArrowRight size={18} style={{marginLeft: '0.5rem'}} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundingPortal;
