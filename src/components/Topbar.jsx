import React from 'react';
import { Bell, Search, User, Building, ShieldCheck, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';

const Topbar = () => {
  const { userProfile, lang, setLang, t, theme, setTheme, setIsProfileOpen, isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLangChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ marginRight: '1rem', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="language-selector">
          <Globe size={18} className="lang-icon" />
          <select value={lang} onChange={handleLangChange} className="lang-select">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
        
        <button 
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {userProfile && (
        <>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search for opportunities, skills, or insights..." />
          </div>

          <div className="topbar-actions">



            <div className="notification-bell-wrapper">
              <div className="notification-bell" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                <Bell size={20} />
                <span className="badge">3</span>
              </div>

              {isNotificationsOpen && (
                <div className="notifications-dropdown glass-panel animate-fade-in">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <span className="mark-read">Mark all as read</span>
                  </div>
                  <div className="dropdown-content">
                    <div className="notification-item unread">
                      <div className="item-dot"></div>
                      <div className="item-info">
                        <p><strong>New Opportunity:</strong> A new startup is looking for an AI Engineer.</p>
                        <span>2 mins ago</span>
                      </div>
                    </div>
                    <div className="notification-item unread">
                      <div className="item-dot"></div>
                      <div className="item-info">
                        <p><strong>Stake Earned:</strong> You received +500 SP for completing onboarding.</p>
                        <span>1 hour ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="item-info">
                        <p>Welcome to Skill2Earn X! Start your journey by analyzing your resume.</p>
                        <span>Yesterday</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-footer">
                    View All Notifications
                  </div>
                </div>
              )}
            </div>
            
            <div className="user-profile" onClick={() => setIsProfileOpen(true)}>
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">{userProfile.name}</span>
                <span className="user-email">{userProfile.email}</span>
                <span className="user-score">{userProfile.score}% Readiness</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Topbar;
