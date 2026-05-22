import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, Briefcase, TrendingUp, BookOpen, MessageSquare, Landmark, LayoutList, Rocket, Shield, LogOut, Heart, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = () => {
  const { userProfile, setUserProfile, setIsChatOpen, t, isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const role = userProfile?.role || 'job_seeker';
  const navigate = useNavigate();

  const handleSwitchRole = () => {
    setUserProfile(null);
    setIsSidebarOpen(false);
    navigate('/');
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-logo">SX</div>
        <span className="brand-name">Skill2Earn X</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
          <LayoutDashboard size={20} />
          <span>{t.dashboard}</span>
        </NavLink>

        {(!role || role === 'job_seeker' || role === 'viewer' || role === 'founder') && (
          <>
            <div className="nav-group-label">Ecosystem</div>
            
            <NavLink to="/learning" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
              <BookOpen size={20} />
              <span>{t.learning} Hub</span>
            </NavLink>
            <NavLink to="/roadmap" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
              <Compass size={20} />
              <span>Learning Roadmap</span>
            </NavLink>
            <NavLink to="/startup-portal" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
              <Rocket size={20} />
              <span>{t.startup} Portal</span>
            </NavLink>
            <NavLink to="/matchmaker" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
              <Heart size={20} />
              <span>Matchmaker</span>
            </NavLink>
            <NavLink to="/gigs" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
              <LayoutList size={20} />
              <span>Workflows</span>
            </NavLink>
            <NavLink to="/leaderboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
              <Trophy size={20} />
              <span>Leaderboard</span>
            </NavLink>
            
            <div className="nav-group-label">Intelligence & Capital</div>

            <NavLink to="/intelligence" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
              <Compass size={20} />
              <span>Skill Pulse</span>
            </NavLink>
            <NavLink to="/market-pulse" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
              <TrendingUp size={20} />
              <span>Market Pulse</span>
            </NavLink>
            <NavLink to="/investor" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
              <Landmark size={20} />
              <span>{t.investor} Radar</span>
            </NavLink>
          </>
        )}

        <div className="sidebar-bottom">
          <div className="nav-group-label">Support</div>
          <button 
            className="nav-item" 
            onClick={() => { handleSwitchRole(); handleLinkClick(); }}
            style={{ color: 'var(--warning)' }}
          >
            <LogOut size={20} />
            <span>Switch Role / Home</span>
          </button>
          <button 
            className="nav-item btn-assistant" 
            onClick={() => { setIsChatOpen(true); handleLinkClick(); }}
          >
            <MessageSquare size={20} />
            <span>Ask SX Assistant</span>
          </button>

          {role === 'admin' && (
            <>
              <div className="nav-group-label">System</div>
              <NavLink to="/admin" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
                <Shield size={20} />
                <span>Hiring Portal</span>
              </NavLink>
              <NavLink to="/investor" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
                <Landmark size={20} />
                <span>Investor Radar</span>
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
