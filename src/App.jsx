import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useConvexAuth } from "convex/react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, Rocket, Shield, RefreshCw } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import StartupPortal from './pages/StartupPortal';
import InvestorDashboard from './pages/InvestorDashboard';
import StartupRejection from './pages/StartupRejection';
import LearningHub from './pages/LearningHub';
import FundingPortal from './pages/FundingPortal';
import PolicyAdmin from './pages/PolicyAdmin';
import HiringAdmin from './pages/HiringAdmin';
import CareerAssistant from './components/CareerAssistant';
import LearningRoadmap from './components/LearningRoadmap';
import MarketPulse from './pages/MarketPulse';
import SkillIntelligence from './components/SkillIntelligence';
import Auth from './pages/Auth';
import GigManager from './pages/GigManager';
import Matchmaker from './components/Matchmaker';
import Leaderboard from './components/Leaderboard';
import { AppProvider, useAppContext } from './context/AppContext';

function Home() {
  const { userProfile, setUserProfile, analyzeResume, t } = useAppContext();
  const navigate = useNavigate();

  const handleRoleSelect = async (role) => {
    if (role === 'admin') {
      setUserProfile(prev => prev ? { ...prev, role, name: "System Admin" } : { role, name: "System Admin" });
      navigate('/investor');
      return;
    }

    if (role === 'job_seeker') {
      // Initialize a baseline profile so the dashboard isn't empty/zero
      await analyzeResume("Digital Talent", "");
      setUserProfile(prev => ({ ...prev, role }));
      navigate('/dashboard');
      return;
    }

    setUserProfile(prev => prev ? { ...prev, role } : { role });
    if (role === 'founder') {
      navigate('/startup-portal');
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-glow pulse-slow"></div>
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        className="hero-content"
      >
        <div className="hero-badge-wrapper">
          <span className="hero-badge">
            Powered by Autonomous AI
          </span>
        </div>

        <h1 className="hero-title">
          Skill2Earn <span className="text-gradient">X</span>
        </h1>
        
        <p className="hero-subtitle">
          The autonomous economic growth engine. Connecting digital talent, startups, and investors in a unified elite ecosystem.
        </p>
        
        <div className="hero-actions">
          <button className="btn-primary hero-btn" onClick={() => handleRoleSelect('job_seeker')}>
            <User size={22} /> I am a Job Seeker
          </button>
          <button className="btn-secondary hero-btn" onClick={() => handleRoleSelect('founder')}>
            <Rocket size={22} /> I am a Startup Founder
          </button>
        </div>

        <div className="hero-secondary-actions animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Returning member? <span onClick={() => navigate('/auth')} style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Sign in to your portal</span>
          </p>
          
          <button 
            className="btn-secondary" 
            onClick={() => handleRoleSelect('admin')} 
            style={{ 
              padding: '0.6rem 1.25rem', 
              fontSize: '0.8rem', 
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.02)',
              opacity: 0.7
            }}
          >
            <Shield size={14} /> Admin Gate
          </button>
        </div>

        <div className="hero-features">
          {[
            { title: 'AI Analyzer', desc: 'Market-mapping resume analysis engine.', color: 'var(--accent-primary)' },
            { title: 'Elite Talent', desc: 'Connecting top 1% talent with founders.', color: 'var(--success)' },
            { title: 'Smart Funding', desc: 'AI-driven pitch evaluation & capital.', color: 'var(--accent-secondary)' }
          ].map((feat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="glass-panel feature-card"
            >
              <div className="feature-line" style={{ background: feat.color }}></div>
              <h4 className="feature-title">{feat.title}</h4>
              <p className="feature-desc">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { userProfile } = useAppContext();
  
  if (userProfile?.role === 'admin' || userProfile?.role === 'viewer') {
    return children;
  }
  
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: 'white', fontFamily: 'sans-serif' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    style={{ height: '100%' }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/learning" element={<PageWrapper><LearningHub /></PageWrapper>} />
            <Route path="/investor" element={<PageWrapper><InvestorDashboard /></PageWrapper>} />
            <Route path="/intelligence" element={<div className="glass-panel" style={{padding: '2rem'}}><SkillIntelligence /></div>} />
            <Route path="/market-pulse" element={<PageWrapper><MarketPulse /></PageWrapper>} />
            <Route path="/roadmap" element={<PageWrapper><LearningRoadmap /></PageWrapper>} />
            <Route path="/funding" element={<FundingPortal />} />
            <Route path="/policy" element={<PolicyAdmin />} />
            
            {/* Newly secured routes */}
            <Route path="/startup-portal" element={<PageWrapper><StartupPortal /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><HiringAdmin /></PageWrapper>} />
            <Route path="/startup-rejection" element={<PageWrapper><StartupRejection /></PageWrapper>} />
            <Route path="/matchmaker" element={<PageWrapper><div className="glass-panel" style={{padding: '3rem'}}><Matchmaker /></div></PageWrapper>} />
            <Route path="/leaderboard" element={<PageWrapper><div className="glass-panel" style={{padding: '3rem'}}><Leaderboard /></div></PageWrapper>} />
            <Route path="/gigs" element={<PageWrapper><GigManager /></PageWrapper>} />
          </Route>
        </Routes>
      </AnimatePresence>
      <CareerAssistant />
    </AppProvider>
  );
}

export default App;
