import React from 'react';
import { Bell, Search, User, Building, ShieldCheck, Globe, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';

const Topbar = () => {
  const { userProfile, lang, setLang, t, theme, setTheme, setIsProfileOpen } = useAppContext();
  const navigate = useNavigate();

  const handleLangChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="language-selector">
          <Globe size={18} className="lang-icon" />
          <select value={lang} onChange={handleLangChange} className="lang-select">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
        
        <button 
          style={{ padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} color="var(--text-primary)" /> : <Moon size={18} color="var(--text-primary)" />}
        </button>
      </div>

      {userProfile && (
        <>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search for opportunities, skills, or insights..." />
          </div>

          <div className="topbar-actions">



            <div className="notification-bell">
              <Bell size={20} />
              <span className="badge">3</span>
            </div>
            
            <div className="user-profile" onClick={() => setIsProfileOpen(true)} style={{ cursor: 'pointer' }}>
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{userProfile.name}</span>
                <span className="user-email" style={{ fontSize: '0.7rem', opacity: 0.6 }}>{userProfile.email}</span>
                <span className="user-score">{userProfile.score}%</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Topbar;
