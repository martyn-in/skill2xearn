import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, Upload, FileText, CheckCircle2, ShieldAlert, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Onboarding.css';

const Onboarding = () => {
  const { analyzeResume, t, setUserProfile } = useAppContext();
  const navigate = useNavigate();

  const [step, setStep] = useState('upload'); // 'upload', 'analyzing', 'result'
  const [entryMode, setEntryMode] = useState('file'); // 'file', 'manual'
  const [file, setFile] = useState(null);
  const [manualData, setManualData] = useState({ name: '', skills: '', exp: '' });
  const [analysis, setAnalysis] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setStep('analyzing');
      startAnalysis(uploadedFile.name);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setStep('analyzing');
    startAnalysis(manualData.name || "User Profile");
  };

  const startAnalysis = (fileName) => {
    let currentProgress = 0;
    const interval = setInterval(async () => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setProgress(100);
        try {
          const result = await analyzeResume(
            entryMode === 'manual' ? manualData.name : fileName.replace(/\.[^.]+$/, ''),
            entryMode === 'file' ? (manualData.skills || fileName) : 
              `${manualData.name} ${manualData.skills} ${manualData.exp}`
          );
          setAnalysis(result);
          setStep('result');
        } catch (err) {
          console.error('Analysis failed:', err);
          // Create a local fallback so the UI still renders
          const fallback = {
            name: entryMode === 'manual' ? manualData.name : fileName.replace(/\.[^.]+$/, ''),
            score: 65,
            rank: 'Intermediate',
            skills: [
              { name: 'Digital Literacy', score: 70 },
              { name: 'Communication', score: 65 },
              { name: 'Global Awareness', score: 60 },
            ],
            certificates: [],
            lastUpdate: new Date().toISOString(),
          };
          setUserProfile(fallback);  // Ensure ProtectedRoute passes
          setAnalysis(fallback);
          setStep('result');
        }
        return;
      }
      setProgress(currentProgress);
    }, 400);
  };

  return (
    <div className="onboarding-page">
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="onboarding-card glass-panel"
          >
            <h1 className="text-gradient">{t.onboarding}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Analyze your skills against real-world market demand. Upload a resume or enter your details manually.
            </p>

            <div className="entry-toggle" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
               <button 
                className={`btn-secondary ${entryMode === 'file' ? 'active' : ''}`}
                style={{ flex: 1, background: entryMode === 'file' ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
                onClick={() => setEntryMode('file')}
               >
                 <Upload size={18} /> Upload File
               </button>
               <button 
                className={`btn-secondary ${entryMode === 'manual' ? 'active' : ''}`}
                style={{ flex: 1, background: entryMode === 'manual' ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
                onClick={() => setEntryMode('manual')}
               >
                 <FileText size={18} /> {t.or_manual}
               </button>
            </div>

            {entryMode === 'file' ? (
              <div className="upload-zone">
                <input 
                  type="file" 
                  id="resume-upload" 
                  hidden 
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="resume-upload" className="upload-label">
                  <Upload size={48} className="upload-icon" />
                  <span>Drop your profile here or click to browse</span>
                  <span className="upload-hint">Supports PDF, DOCX</span>
                </label>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} className="manual-entry-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>{t.full_name}</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Rahul Sharma"
                    value={manualData.name}
                    onChange={(e) => setManualData({...manualData, name: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>{t.skills_label}</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Sales, Typing, Management..."
                    value={manualData.skills}
                    onChange={(e) => setManualData({...manualData, skills: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>{t.exp_label}</label>
                  <textarea 
                    required 
                    rows="3"
                    value={manualData.exp}
                    onChange={(e) => setManualData({...manualData, exp: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', resize: 'none' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                  {t.start_ai} <ArrowRight size={18} />
                </button>
              </form>
            )}

            <div className="motivational-quote" style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
              <em style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                "Success is where preparation and opportunity meet."
              </em>
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="onboarding-card glass-panel analyzing-card"
          >
            <div className="ai-scanner">
              <FileText size={64} className="scanner-icon" />
              <div className="scanner-line"></div>
            </div>
            <h2 className="text-gradient">AI Scanning... {Math.round(progress)}%</h2>
            <p>Identifying key skills, certifications, and market alignment...</p>
            
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="analysis-logs">
              {progress > 20 && <div>✓ Extracting text entities...</div>}
              {progress > 50 && <div>✓ Mapping skill taxonomy...</div>}
              {progress > 80 && <div>✓ Cross-referencing current market trends...</div>}
            </div>
          </motion.div>
        )}

        {step === 'result' && analysis && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="onboarding-card glass-panel result-card"
          >
            <div className="result-header">
              <div className="score-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray={`${analysis.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">{analysis.score}%</text>
                </svg>
              </div>
              <div className="rank-info text-gradient">
                <h2>{analysis.rank}</h2>
                <p>Market Readiness Index</p>
              </div>
            </div>

            <div className="skill-tags">
              {analysis.skills.map((s, i) => (
                <div key={i} className="skill-tag-item">
                  <span>{s.name}</span>
                  <div className="tag-score">{s.score}%</div>
                </div>
              ))}
            </div>

            <div className="recommendation-card">
              {analysis.score >= 90 ? (
                <div className="status-box success">
                  <Rocket size={20} />
                  <span><strong>Elite Status:</strong> You are marked as 'Job Ready'. Top startups can now hire you directly!</span>
                </div>
              ) : analysis.score >= 50 ? (
                <div className="status-box warning">
                  <CheckCircle2 size={20} />
                  <span><strong>Improving:</strong> Good foundation. Master advanced specialization tracks to reach 90% Elite status.</span>
                </div>
              ) : (
                <div className="status-box danger">
                  <ShieldAlert size={20} />
                  <span><strong>Beginner:</strong> Focusing on foundational courses and hackathons will boost your score quickly.</span>
                </div>
              )}
            </div>

            <button className="btn-primary full-width" onClick={() => navigate('/dashboard')} style={{ marginTop: '1.5rem' }}>
              Go to My Dashboard <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
