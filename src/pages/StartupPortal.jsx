import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Rocket, Target, Lightbulb, Users, ArrowRight, BarChart3, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './StartupPortal.css';

const StartupPortal = () => {
  const { submitStartup, startupProfile, t, matches } = useAppContext();
  const navigate = useNavigate();

  const [step, setStep] = useState(startupProfile ? 'status' : 'input'); // 'input', 'evaluating', 'status'
  const [formData, setFormData] = useState({
    vision: '',
    impact: '',
    isHiring: false,
    hiringRole: '',
    hiringPositions: ''
  });
  const [evalProgress, setEvalProgress] = useState(0);
  const [showPitchArchitect, setShowPitchArchitect] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('evaluating');
    startEvaluation();
  };

  const startEvaluation = () => {
    let current = 0;
    const interval = setInterval(async () => {
      current += Math.random() * 20;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setEvalProgress(100);
        try {
          await submitStartup(formData);
        } catch (err) {
          console.error('Startup submission failed:', err);
        }
        setStep('status');
        return;
      }
      setEvalProgress(current);
    }, 500);
  };

  const feasibilityData = startupProfile ? [
    { name: 'Market', value: 85 },
    { name: 'Tech', value: 70 },
    { name: 'Finance', value: startupProfile.feasibility },
    { name: 'Innovation', value: 90 },
  ] : [];

  return (
    <div className="startup-portal animate-fade-in">
      <div className="portal-container">
        <div className="portal-sidebar-info">
          <h1 className="text-gradient"><Rocket size={32} /> {t.startup}</h1>
          <p>Level 1: Ideas → Level 2: AI Scaling → Level 3: Funding</p>
          
          <div className="portal-steps">
            <div className={`step-item ${step === 'input' ? 'active' : 'completed'}`}>
              <div className="step-num">1</div>
              <span>Vision & Pitch</span>
            </div>
            <div className={`step-item ${step === 'evaluating' ? 'active' : step === 'status' ? 'completed' : ''}`}>
              <div className="step-num">2</div>
              <span>AI Feasibility</span>
            </div>
            <div className={`step-item ${step === 'status' ? 'active' : ''}`}>
              <div className="step-num">3</div>
              <span>Investor Review</span>
            </div>
          </div>

          <div className="portal-helper glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
            <Lightbulb size={24} className="text-gradient" style={{ marginBottom: '1rem' }} />
            <h4>Need Help?</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Use our AI architect to structure your pitch for maximum impact.</p>
            <button className="btn-secondary full-width" onClick={() => setShowPitchArchitect(true)}>
              Launch Pitch Architect
            </button>
          </div>
        </div>

        <div className="portal-main-panel glass-panel">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.form 
                key="input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit} 
                className="startup-form"
              >
                <div className="form-grid">
                  <div className="form-group">
                    <label>Startup Name</label>
                    <input required name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. AgriTech AI" />
                  </div>
                  <div className="form-group">
                    <label>Problem Statement</label>
                    <input required name="problem" value={formData.problem} onChange={handleInputChange} placeholder="What pain point are you solving?" />
                  </div>
                </div>

                <div className="form-group">
                  <label>The Pitch (Elevator style)</label>
                  <textarea required name="pitch" value={formData.pitch} onChange={handleInputChange} rows="3" placeholder="Explain your core value proposition..."></textarea>
                </div>

                <div className="form-group">
                  <label>5-Year Vision</label>
                  <textarea required name="vision" value={formData.vision} onChange={handleInputChange} rows="2" placeholder="Where do you see this in 5 years?"></textarea>
                </div>

                <div className="form-group">
                  <label>Real-World Impact</label>
                  <input required name="impact" value={formData.impact} onChange={handleInputChange} placeholder="e.g. Scaling digital crafts for 10k artisans" />
                </div>

                <div className="form-section glass-panel" style={{ padding: '1.5rem', marginTop: '1rem', border: '1px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Users size={20} className="text-gradient" />
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Elite Mass Hiring Request</h3>
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <input 
                      type="checkbox" 
                      id="isHiring" 
                      name="isHiring" 
                      checked={formData.isHiring} 
                      onChange={(e) => setFormData({...formData, isHiring: e.target.checked})} 
                      style={{ width: '20px', height: '20px' }}
                    />
                    <label htmlFor="isHiring" style={{ cursor: 'pointer', fontWeight: 600 }}>Enable Elite Matchmaking for this startup</label>
                  </div>
                  
                  {formData.isHiring && (
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Target Job Role</label>
                        <input name="hiringRole" value={formData.hiringRole} onChange={handleInputChange} placeholder="e.g. AI Operations Lead" />
                      </div>
                      <div className="form-group">
                        <label>Vacancies</label>
                        <input type="number" name="hiringPositions" value={formData.hiringPositions} onChange={handleInputChange} placeholder="No. of positions" />
                      </div>
                    </div>
                  )}
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
                    Note: Hiring will only be activated once an Investor approves and funds your proposal.
                  </p>
                </div>

                <button type="submit" className="btn-primary full-width" style={{ marginTop: '1.5rem' }}>
                  Begin AI Analysis <ArrowRight size={18} />
                </button>
              </motion.form>
            )}

            {step === 'evaluating' && (
              <motion.div 
                key="evaluating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="portal-evaluating"
              >
                <div className="eval-ai-core">
                  <div className="ai-pulse"></div>
                  <BarChart3 size={64} className="text-gradient" />
                </div>
                <h2>Analyzing Feasibility... {Math.round(evalProgress)}%</h2>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${evalProgress}%` }}></div>
                </div>
                <div className="eval-logs">
                  {evalProgress > 20 && <p>✓ Market size estimation complete...</p>}
                  {evalProgress > 50 && <p>✓ Risk factor profiling...</p>}
                  {evalProgress > 80 && <p>✓ Investment readiness scoring...</p>}
                </div>
              </motion.div>
            )}

            {step === 'status' && startupProfile && (
              <motion.div 
                key="status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="portal-status"
              >
                <div className="status-header">
                  <div className={`status-badge ${startupProfile.riskScore < 50 ? 'safe' : 'risky'}`}>
                    {startupProfile.riskScore < 50 ? <ShieldCheck /> : <AlertCircle />}
                    {startupProfile.status}
                  </div>
                  <h3>Level 2 AI Insights</h3>
                </div>

                <div className="status-grid">
                  <div className="feasibility-chart-container">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={feasibilityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                        <YAxis hide />
                        <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)' }} />
                        <Bar dataKey="value" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="recommendations-box">
                    <h4>AI Roadmap for Success</h4>
                    <ul>
                      {startupProfile.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="risk-indicator">
                  <div className="risk-label">
                    <span>AI Risk Factor</span>
                    <span>{startupProfile.riskScore}%</span>
                  </div>
                  <div className="risk-bar-bg">
                    <div className="risk-bar" style={{ width: `${startupProfile.riskScore}%`, background: startupProfile.riskScore > 50 ? 'var(--danger)' : 'var(--success)' }}></div>
                  </div>
                </div>

                 {startupProfile.riskScore > 50 ? (
                  <div className="evaluation-rejection">
                    <p>Investor interest is low due to high risk. Redirecting to improvement portal...</p>
                    <button className="btn-secondary full-width" onClick={() => navigate('/startup-rejection')}>Go to Improvement Portal</button>
                  </div>
                ) : (
                  <div className="evaluation-success">
                    <p>Level 2 Validation Success! Your pitch is now in the **Investor Review Pool (Level 3)**.</p>
                    
                    {startupProfile.status === 'Funded' && (
                      <div className="recruited-team-section glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Users className="text-gradient" /> Recruited Elite Team
                          </h3>
                          <span className="status-badge safe">
                            {matches.filter(m => m.startupName === startupProfile.title).length} / {startupProfile.hiringPositions} Hired
                          </span>
                        </div>
                        
                        <div className="team-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {matches.filter(m => m.startupName === startupProfile.title).length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                              Recruitment engine is active. Waiting for candidates to qualify...
                            </p>
                          ) : (
                            matches.filter(m => m.startupName === startupProfile.title).map((member, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-color-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                <div>
                                  <div style={{ fontWeight: 700 }}>{member.talentName}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Role: {member.role}</div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Elite Certified ✓</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    <button className="btn-primary full-width" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showPitchArchitect && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              className="glass-panel" 
              style={{ width: '600px', padding: '3rem', position: 'relative' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className="text-gradient">Smart Pitch Architect</h2>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: '2rem' }}>Our AI will help you structure your vision for investors.</p>
              
              <div className="architect-flow">
                <div className="form-group">
                  <label>Briefly describe your idea</label>
                  <textarea 
                    rows="4" 
                    placeholder="Enter a raw description of what you're building..."
                    onChange={(e) => {
                      if (e.target.value.length > 50) {
                        setAiSuggestions("AI Suggestion: Focus on the 'Autonomous Execution' aspect. Investors in 2026 are highly interested in self-scaling systems.");
                      }
                    }}
                  ></textarea>
                </div>

                {aiSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-primary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}
                  >
                    {aiSuggestions}
                  </motion.div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={() => setShowPitchArchitect(false)}>
                    Generate Structure
                  </button>
                  <button className="btn-secondary" onClick={() => setShowPitchArchitect(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StartupPortal;
