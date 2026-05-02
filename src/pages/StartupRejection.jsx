import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AlertCircle, ArrowLeft, Lightbulb, TrendingUp, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const StartupRejection = () => {
  const { startupProfile } = useAppContext();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/startup-portal');
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  if (!startupProfile) return null;

  return (
    <div className="rejection-page" style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.05) 0%, var(--bg-color) 100%)'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel" 
        style={{ maxWidth: '700px', width: '100%', textAlign: 'center', padding: '3rem' }}
      >
        <div className="rejection-icon" style={{ marginBottom: '1.5rem', color: 'var(--danger)' }}>
          <AlertCircle size={64} />
        </div>
        
        <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Pivot & Improve</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your current feasibility score of **{startupProfile.feasibility}%** is below the market entry threshold. 
          Our AI has identified specific improvement vectors for your idea.
        </p>

        <div className="suggestions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', marginBottom: '2.5rem' }}>
          <div className="suggestion-item glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--accent-primary)' }}>
            <Lightbulb size={20} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Refine Market Fit</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Narrow down your target audience for Level 2 resonance.</p>
          </div>
          <div className="suggestion-item glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--success)' }}>
            <TrendingUp size={20} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Scalability Logic</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Update your 5-year vision with specific digital milestones.</p>
          </div>
        </div>

        <div className="motivational-block" style={{ marginBottom: '3rem', padding: '1.5rem', background: 'var(--bg-color-secondary)', borderRadius: 'var(--radius-md)', fontStyle: 'italic' }}>
          <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
            "I have not failed. I've just found 10,000 ways that won't work."
          </p>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>— Thomas Edison</span>
        </div>

        <div className="redirect-footer">
          <div className="redirect-timer" style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Auto-redirecting to Startup Portal in **{timeLeft}s**...
          </div>
          <button className="btn-secondary" onClick={() => navigate('/startup-portal')} style={{ gap: '0.75rem' }}>
            <ArrowLeft size={18} /> Return Manually
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StartupRejection;
