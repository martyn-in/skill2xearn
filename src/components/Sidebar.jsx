import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, Briefcase, TrendingUp, BookOpen, MessageSquare, Landmark, LayoutList, Rocket, Shield, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = () => {
  const { userProfile, setUserProfile, setIsChatOpen, t } = useAppContext();
  const role = userProfile?.role || 'job_seeker';
  const navigate = useNavigate();

  const handleSwitchRole = () => {
    setUserProfile(null);
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">SX</div>
        <span className="brand-name">Skill2Earn X</span>
      </div>
      
      <nav className="sidebar-nav">
        {(!role || role === 'job_seeker') && (
          <>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <LayoutDashboard size={20} />
              <span>{t.dashboard}</span>
            </NavLink>
            
            <div className="nav-group-label">Ecosystem</div>
            
            <NavLink to="/learning" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <BookOpen size={20} />
              <span>{t.learning} Hub</span>
            </NavLink>
            <NavLink to="/roadmap" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Compass size={20} />
              <span>Learning Roadmap</span>
            </NavLink>
            <NavLink to="/investor" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Landmark size={20} />
              <span>{t.investor} Radar</span>
            </NavLink>
            
            <div className="nav-group-label">Intelligence</div>

            <NavLink to="/intelligence" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Compass size={20} />
              <span>Skill Pulse</span>
            </NavLink>
            <NavLink to="/market-pulse" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <TrendingUp size={20} />
              <span>Market Pulse</span>
            </NavLink>
          </>
        )}

        {role === 'founder' && (
          <>
            <div className="nav-group-label">Founder Toolkit</div>
            <NavLink to="/startup-portal" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Rocket size={20} />
              <span>{t.startup} Portal</span>
            </NavLink>
            <NavLink to="/investor" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Landmark size={20} />
              <span>{t.investor} Radar</span>
            </NavLink>
          </>
        )}

        {role === 'admin' && (
          <>
            <div className="nav-group-label">System</div>
            <NavLink to="/admin" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Shield size={20} />
              <span>Admin Control</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item btn-assistant" style={{ marginBottom: '0.5rem', background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={handleSwitchRole}>
          <LogOut size={20} />
          <span>Switch Role / Home</span>
        </button>
        <button className="nav-item btn-assistant" onClick={() => setIsChatOpen(true)}>
          <MessageSquare size={20} />
          <span>Ask SX Assistant</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
