import React, { useState, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck, RefreshCw, ChevronLeft, Shield, User, Rocket } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import "./Auth.css";

const Auth = () => {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userProfile, setUserProfile, setStartupProfile, analyzeResume } = useAppContext();
  
  useEffect(() => {
    if (isAuthenticated) {
      if (userProfile?.role === 'founder') {
        navigate('/startup-portal');
      } else if (userProfile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, userProfile]);

  const handleSignIn = async (provider) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(provider, { redirectTo: "/dashboard" });
    } catch (err) {
      setError(err.message || "Failed to sign in. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-container glass-panel"
      >
        <div className="auth-header">
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'var(--accent-gradient)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
          }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <h1>Skill2Earn <span className="text-gradient">X</span></h1>
          <p>The Future of Talent Matching</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="google-auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-form"
            style={{ textAlign: 'center', padding: '1rem 0' }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Securely access your dashboard using your Google account.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => handleSignIn("google")}
                disabled={isLoading}
                className="btn-primary"
                style={{ 
                  width: '100%', 
                  padding: '1.25rem', 
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  background: 'white',
                  color: 'black',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? <RefreshCw className="spin" size={24} /> : (
                  <>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '24px' }} />
                    Continue with Google
                  </>
                )}
              </button>

              <button 
                onClick={() => handleSignIn("github")}
                disabled={isLoading}
                className="btn-secondary"
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? <RefreshCw className="spin" size={20} /> : (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    Continue with GitHub
                  </>
                )}
              </button>
            </div>

            {error && <div className="error-message" style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
          </motion.div>
        </AnimatePresence>

        <div className="auth-footer">
          <p>By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
          
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <button 
              onClick={async () => {
                const key = window.prompt("Enter Talent Viewer Key:");
                if (key === "2026") {
                  await analyzeResume("Guest Viewer", "");
                  setUserProfile(prev => ({ ...prev, role: 'viewer' }));
                  navigate('/dashboard');
                } else if (key !== null) {
                  alert("Invalid Key.");
                }
              }}
              style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--glass-border)',
                color: 'var(--text-tertiary)',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '0 auto',
                width: '100%',
                maxWidth: '220px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
             >
               <User size={14} /> Bypass to Talent Mode
             </button>

             <button 
              onClick={() => {
                const key = window.prompt("Enter Founder Viewer Key:");
                if (key === "2026") {
                  const founderProfile = { name: "Guest Founder", role: 'founder' };
                  setUserProfile(founderProfile);
                  
                  // Initialize a sample startup for the guest mode
                  setStartupProfile({
                    id: "guest-startup-123",
                    title: "SolarGrid AI",
                    problem: "Inefficient power distribution in rural areas.",
                    pitch: "Autonomous AI grid that redistributes solar energy in real-time.",
                    vision: "Global decentralized power network.",
                    impact: "Providing stable energy to 1M households.",
                    owner: "Guest Founder",
                    isHiring: true,
                    hiringRole: "AI Energy Engineer",
                    hiringPositions: "3",
                    status: "Pending Review",
                    riskScore: 24,
                    feasibility: 88,
                    recommendations: ["Expand beta testing sites", "Optimize LLM for edge devices"]
                  });

                  navigate('/startup-portal');
                } else if (key !== null) {
                  alert("Invalid Key.");
                }
              }}
              style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--glass-border)',
                color: 'var(--text-tertiary)',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '0 auto',
                width: '100%',
                maxWidth: '220px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
             >
               <Rocket size={14} /> Bypass to Founder Mode
             </button>

             <button 
              onClick={() => {
                const key = window.prompt("Enter Admin Access Key:");
                if (key === "2026") {
                  setUserProfile({ name: "System Admin", role: 'admin' });
                  navigate('/admin');
                } else if (key !== null) {
                  alert("Invalid Key.");
                }
              }}
              style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--glass-border)',
                color: 'var(--text-tertiary)',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '0 auto',
                width: '100%',
                maxWidth: '220px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
             >
               <Shield size={14} /> Bypass to Admin Mode
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
