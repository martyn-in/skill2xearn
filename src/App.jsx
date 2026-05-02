import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useConvexAuth } from "convex/react";
import { motion } from 'framer-motion';
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
import CareerAssistant from './components/CareerAssistant';
import LearningRoadmap from './components/LearningRoadmap';
import MarketPulse from './pages/MarketPulse';
import SkillIntelligence from './components/SkillIntelligence';
import Auth from './pages/Auth';
import { AppProvider, useAppContext } from './context/AppContext';

function Home() {
  const { userProfile, setUserProfile, t } = useAppContext();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === 'job_seeker') {
      navigate('/onboarding');
    } else if (role === 'founder') {
      navigate('/startup-portal');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <div className="home-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, var(--bg-color-secondary) 0%, var(--bg-color) 100%)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div className="hero-glow"></div>
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-0.05em' }}>
          Skill2Earn <span className="text-gradient" style={{ fontWeight: 900 }}>X</span>
        </h1>
        <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', margin: '0 auto 3rem auto', maxWidth: '600px', lineHeight: '1.6' }}>
          The autonomous economic growth engine. Connecting digital talent, startups, and investors in a unified ecosystem.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => handleRoleSelect('job_seeker')} style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User size={24} /> I am a Job Seeker
          </button>
          <button className="btn-secondary" onClick={() => handleRoleSelect('founder')} style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderColor: 'var(--success)', color: 'var(--success)' }}>
            <Rocket size={24} /> I am a Startup Founder
          </button>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
            Already have an account? <span onClick={() => navigate('/auth')} style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Sign in here</span>
          </p>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <button className="btn-secondary" onClick={() => handleRoleSelect('admin')} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', background: 'transparent' }}>
            <Shield size={16} /> Admin Access Gate
          </button>
        </div>

        <div className="home-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '5rem', maxWidth: '1000px' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>AI Analyzer</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Market-mapping resume analysis engine.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Startup Portal</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Level 1 to 3 pitch evaluation & funding.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>Talent Radar</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Elite matching for job-ready individuals.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  
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

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learning" element={<LearningHub />} />
            <Route path="/startup-portal" element={<StartupPortal />} />
            <Route path="/investor" element={<InvestorDashboard />} />
            <Route path="/admin" element={<InvestorDashboard />} />
            <Route path="/startup-rejection" element={<StartupRejection />} />
            <Route path="/intelligence" element={<div className="glass-panel" style={{padding: '2rem'}}><SkillIntelligence /></div>} />
            <Route path="/market-pulse" element={<MarketPulse />} />
            <Route path="/roadmap" element={<LearningRoadmap />} />
            <Route path="/funding" element={<FundingPortal />} />
            <Route path="/policy" element={<PolicyAdmin />} />
          </Route>
        </Routes>
        <CareerAssistant />
      </Router>
    </AppProvider>
  );
}

export default App;
