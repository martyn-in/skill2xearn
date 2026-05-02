import React, { useState, useEffect } from 'react';
import { useConvexAuth } from "convex/react";
import './SecurityGate.css';

const SecurityGate = ({ children }) => {
  const { isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('app_authenticated');
    if (authStatus === 'true' || isConvexAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [isConvexAuthenticated]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'skill') {
      sessionStorage.setItem('app_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setError(false);
      }, 500);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="security-gate-container">
      <div className="security-gate-background">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>
      
      <div className={`security-panel glass-panel ${isShaking ? 'shake-animation' : ''} animate-fade-in`}>
        <div className="security-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        
        <h2 className="security-title">Secured Access</h2>
        <p className="security-subtitle">Please enter the passcode to continue</p>
        
        <form onSubmit={handleSubmit} className="security-form">
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode"
              className={`security-input ${error ? 'input-error' : ''}`}
              autoFocus
            />
          </div>
          
          <button type="submit" className="btn-primary security-btn">
            Unlock Application
          </button>
        </form>
      </div>
    </div>
  );
};
export default SecurityGate;
