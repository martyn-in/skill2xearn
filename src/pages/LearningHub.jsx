import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpen, GraduationCap, Award, CheckCircle2, Play, ExternalLink, ShieldCheck, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LearningHub = () => {
  const { userProfile, t, analyzeResume, addCertificate, roadmap } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [selectedBrief, setSelectedBrief] = useState(null);

  const score = userProfile?.score || 0;

  const courses = roadmap || [];

  const handleSimulateCompletion = (course) => {
    setCompletionProgress(0);
    setEnrolledCourse(course);
    
    // Animate progress
    let prog = 0;
    const interval = setInterval(async () => {
      prog += 5;
      setCompletionProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(async () => {
          // Just finish the simulation, let user download
          setCompletionProgress(100);
        }, 1000);
      }
    }, 100);
  };

  const handleDownloadGeneratedCert = (course) => {
    // Generate a beautiful certificate image (simulation)
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 800, 600);
    
    // Border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, 780, 580);
    
    // Content
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px Inter';
    ctx.fillText('CERTIFICATE OF COMPLETION', 400, 100);
    
    ctx.font = '24px Inter';
    ctx.fillText('This is to certify that', 400, 200);
    
    ctx.font = 'bold 48px Outfit';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(userProfile?.name || 'Valued Learner', 400, 280);
    
    ctx.fillStyle = '#f8fafc';
    ctx.font = '24px Inter';
    ctx.fillText('has successfully completed the course', 400, 350);
    
    ctx.font = 'bold 32px Inter';
    ctx.fillText(course.title, 400, 410);
    
    ctx.font = '20px Inter';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 400, 500);
    ctx.fillText(`Verification ID: SX-${Date.now()}`, 400, 530);
    
    const link = document.createElement('a');
    link.download = `Skill2EarnX_${course.title.replace(/\s+/g,'_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    setEnrolledCourse(null);
    setCompletionProgress(0);
  };

  return (
    <div className="learning-hub-page animate-fade-in" style={{ padding: '2rem' }}>
      <div className="hub-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
            <BookOpen size={40} /> {t.learning} Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Personalized growth engine based on your current Market Readiness Index: **{score}%**</p>
        </div>
        <div style={{ padding: '1rem', background: 'var(--bg-color-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Next Rank Level</span>
          <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{score < 50 ? 'Intermediate' : score < 90 ? 'Elite (Job Ready)' : 'Entrepreneur Match'}</div>
        </div>
      </div>

      <div className="hub-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <button 
          className={`btn-secondary ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
          style={{ background: activeTab === 'courses' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'courses' ? 'white' : 'var(--text-primary)' }}
        >
          <GraduationCap size={18} /> Recommended Tracks
        </button>
        <button 
          className={`btn-secondary ${activeTab === 'assessments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assessments')}
          style={{ background: activeTab === 'assessments' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'assessments' ? 'white' : 'var(--text-primary)' }}
        >
          <Award size={18} /> Skill Assessments
        </button>
      </div>

      <div className="hub-content">
        {activeTab === 'courses' && (
          <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {courses.map(course => (
              <motion.div 
                key={course.id}
                whileHover={{ y: -5 }}
                className="glass-panel course-card"
                style={{ opacity: score >= course.scoreReq ? 1 : 0.5 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="course-level" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.5rem', background: 'var(--bg-color-secondary)', borderRadius: '4px' }}>{course.level}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{course.duration}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{course.title}</h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {course.provider} • {course.impact}
                </div>
                
                {score >= course.scoreReq ? (
                  <button className="btn-primary full-width" onClick={() => handleSimulateCompletion(course)}>
                    <Play size={16} /> Start Module
                  </button>
                ) : (
                  <button className="btn-secondary full-width" disabled style={{ cursor: 'not-allowed' }}>
                    Locked (Skill Gap Detected)
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="assessments-panel">
            <div className="briefs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {[
                { title: "E-Commerce User Flow", type: "UX Research", urgency: "High", icon: "🎨" },
                { title: "Supply Chain Dashboard", type: "Data Viz", urgency: "Medium", icon: "📊" },
                { title: "Micro-SaaS Landing Page", type: "Development", urgency: "High", icon: "🚀" },
                { title: "Financial Risk Report", type: "Analysis", urgency: "Medium", icon: "🛡️" }
              ].map((brief, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="glass-panel"
                  style={{ padding: '1.5rem', borderLeft: `4px solid ${brief.urgency === 'High' ? 'var(--danger)' : 'var(--accent-primary)'}` }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{brief.icon}</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>{brief.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Category: {brief.type}</div>
                  <button className="btn-secondary full-width" onClick={() => setSelectedBrief(brief)}>
                    View Project Brief <ExternalLink size={14} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <ShieldCheck size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
              <h2>Skill Assessment Briefs</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '1rem auto' }}>
                Download these industry-standard project briefs to refine your practical skills. Completing these and uploading proof will significantly boost your profile ranking.
              </p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedBrief && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setSelectedBrief(null)}
          >
            <motion.div 
              className="glass-panel" 
              style={{ width: '600px', padding: '3rem', position: 'relative', background: 'var(--bg-color)', border: '2px solid var(--accent-primary)' }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedBrief(null)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <h2 className="text-gradient" style={{ marginBottom: '0.5rem' }}>{selectedBrief.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Official Industry Brief v2.4 • Confidential Document</p>
              
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Project Objective</h4>
                  <p style={{ fontSize: '0.95rem' }}>Design and document a comprehensive solution for {selectedBrief.title.toLowerCase()} focusing on scalability and user retention in the Southeast Asian market.</p>
                </div>
                
                <div>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Key Requirements</h4>
                  <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                    <li>Cross-platform compatibility (Native + Web)</li>
                    <li>Security-first data architecture</li>
                    <li>Integrated AI analytics for real-time reporting</li>
                    <li>Localization support for Hind/Tel/Eng</li>
                  </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--warning)', fontSize: '0.85rem' }}><strong>Submission Tip:</strong> Upload your final output as a PDF in the 'Certificates' tab to gain +20 Ranking points.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button className="btn-primary" style={{ flex: 1 }} onClick={() => { alert("Downloading Detailed PDF Brief (1.2MB)..."); setSelectedBrief(null); }}>
                      Download Brief PDF
                   </button>
                   <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedBrief(null)}>
                      Close Brief
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {enrolledCourse && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              className="glass-panel" 
              style={{ width: '500px', padding: '3rem', textAlign: 'center' }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>{enrolledCourse.title}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Learning in progress... Identifying key market patterns.</p>
              
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                <motion.div 
                  style={{ height: '100%', background: 'var(--accent-primary)', width: `${completionProgress}%` }}
                />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{completionProgress}% Complete</div>
              
              {completionProgress === 100 && (
                <div style={{ marginTop: '2rem' }}>
                  <button className="btn-primary full-width" onClick={() => handleDownloadGeneratedCert(enrolledCourse)}>
                     Download My Certificate <Download size={18} />
                  </button>
                  <p style={{ fontSize: '0.75rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Download this PNG and upload it in your <strong>Profile &gt; Certificates</strong> section to update your rank.
                  </p>
                </div>
              )}
              
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ color: completionProgress > 30 ? 'var(--success)' : 'var(--text-secondary)' }}>{completionProgress > 30 ? '✓' : '○'} Module 1: Core Fundamentals</div>
                <div style={{ color: completionProgress > 60 ? 'var(--success)' : 'var(--text-secondary)' }}>{completionProgress > 60 ? '✓' : '○'} Module 2: Market Dynamics</div>
                <div style={{ color: completionProgress > 90 ? 'var(--success)' : 'var(--text-secondary)' }}>{completionProgress > 90 ? '✓' : '○'} Module 3: Strategic Excellence</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningHub;
