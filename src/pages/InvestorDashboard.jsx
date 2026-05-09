import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Landmark, Users, TrendingUp, ShieldCheck, XCircle, DollarSign, ArrowRight, Rocket, Shield, Clock, LogOut, AlertTriangle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Security constants ───────────────────────────────────────────────────────
const ADMIN_KEY        = '2026';
const SESSION_TIMEOUT  = 30 * 60 * 1000; // 30 minutes
const LOCKOUT_DURATION = 5  * 60 * 1000; // 5 minutes after 3 failed attempts
const MAX_ATTEMPTS     = 3;

// ─── In-memory auth state (NEVER written to localStorage / sessionStorage) ───
// This module-level variable resets every page load — no one can bypass it.
let _adminAuthorizedUntil = 0; // epoch ms when admin session expires
let _failedAttempts = 0;
let _lockedUntil = 0;

const InvestorDashboard = () => {
  const { allStartups, allUsers, updateStartupStatus, removeStartup, removeAllStartups, removeUser, removeAllUsers, shortlistPool, createMatch, updateMatchStatus, matches, userProfile, t } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminView = userProfile?.role === 'admin';

  const [accessKey, setAccessKey]     = React.useState('');
  const [fundingInputs, setFundingInputs] = React.useState({});
  const [matchingTalent, setMatchingTalent] = React.useState(null);
  const [matchingStartupId, setMatchingStartupId] = React.useState('');
  const [projectDetails, setProjectDetails] = React.useState('');
  
  // Public users only see Funded startups. Admin sees everything.
  const displayedStartups = isAdminView 
    ? allStartups 
    : allStartups.filter(s => s.status === 'Funded');

  const [isAuthorized, setIsAuthorized] = React.useState(() => {
    // Only allow if the in-memory timer hasn't expired
    return _adminAuthorizedUntil > Date.now();
  });
  const [timeLeft, setTimeLeft]       = React.useState(0);       // seconds remaining in session
  const [attemptsLeft, setAttemptsLeft] = React.useState(MAX_ATTEMPTS - _failedAttempts);
  const [lockSecondsLeft, setLockSecondsLeft] = React.useState(0);
  const [error, setError]             = React.useState('');
  const timerRef = useRef(null);
  const lockTimerRef = useRef(null);

  // ── Start the 30-min session countdown ──────────────────────────────────────
  const startSessionTimer = (expiresAt) => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        _adminAuthorizedUntil = 0;
        setIsAuthorized(false);
        setTimeLeft(0);
        setError('Session expired. Please re-authenticate.');
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
  };

  // ── Start lockout countdown after too many failed attempts ──────────────────
  const startLockCountdown = (expiresAt) => {
    clearInterval(lockTimerRef.current);
    lockTimerRef.current = setInterval(() => {
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(lockTimerRef.current);
        _lockedUntil = 0;
        _failedAttempts = 0;
        setLockSecondsLeft(0);
        setAttemptsLeft(MAX_ATTEMPTS);
        setError('');
      } else {
        setLockSecondsLeft(remaining);
      }
    }, 1000);
  };

  // ── If already authorized on mount, resume countdown ────────────────────────
  useEffect(() => {
    if (isAdminView && isAuthorized && _adminAuthorizedUntil > Date.now()) {
      startSessionTimer(_adminAuthorizedUntil);
    }
    if (_lockedUntil > Date.now()) {
      setLockSecondsLeft(Math.floor((_lockedUntil - Date.now()) / 1000));
      startLockCountdown(_lockedUntil);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(lockTimerRef.current);
    };
  }, []);

  // ── Handle key submission ────────────────────────────────────────────────────
  const handleAuth = (e) => {
    e.preventDefault();
    setError('');

    if (_lockedUntil > Date.now()) {
      setError(`Too many attempts. Try again in ${Math.ceil((_lockedUntil - Date.now()) / 1000)}s`);
      return;
    }

    if (accessKey === ADMIN_KEY) {
      const expiresAt = Date.now() + SESSION_TIMEOUT;
      _adminAuthorizedUntil = expiresAt;
      _failedAttempts = 0;
      setIsAuthorized(true);
      setAttemptsLeft(MAX_ATTEMPTS);
      startSessionTimer(expiresAt);
    } else {
      _failedAttempts += 1;
      const remaining = MAX_ATTEMPTS - _failedAttempts;
      setAttemptsLeft(remaining);

      if (_failedAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCKOUT_DURATION;
        _lockedUntil = lockUntil;
        _failedAttempts = 0;
        setAttemptsLeft(MAX_ATTEMPTS);
        startLockCountdown(lockUntil);
        setError(`Account locked for ${LOCKOUT_DURATION / 60000} minutes due to too many failed attempts.`);
      } else {
        setError(`Invalid key. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
      }
      setAccessKey('');
    }
  };

  // ── Manual logout ────────────────────────────────────────────────────────────
  const handleLogout = () => {
    clearInterval(timerRef.current);
    _adminAuthorizedUntil = 0;
    setIsAuthorized(false);
    setTimeLeft(0);
  };

  const handleAction = (id, status, investment = 0) => {
    updateStartupStatus(id, status, investment);
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("System Error: Document ID is missing.");
      return;
    }
    
    if (window.confirm("Are you sure you want to permanently delete this entry? This action is irreversible.")) {
      try {
        await removeStartup(id);
        alert("Deleted successfully.");
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Critical Error: " + err.message);
      }
    }
  };

  const handleWipeAll = async () => {
    if (window.confirm("CRITICAL ACTION: Delete ALL startups?")) {
      try {
        await removeAllStartups();
        alert("System cleared.");
      } catch (err) {
        alert("Wipe failed: " + err.message);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (!id) return;
    if (window.confirm("Delete this user?")) {
      try {
        await removeUser(id);
        alert("User removed.");
      } catch (err) {
        alert("User delete failed: " + err.message);
      }
    }
  };

  const handleCreateMatch = async () => {
    const startup = allStartups.find(s => (s._id || s.id) === matchingStartupId);
    if (!startup || !matchingTalent || !projectDetails) {
      alert("Please select a startup and provide project details.");
      return;
    }

    try {
      await createMatch(matchingTalent.name, startup.title, startup.hiringRole || "Professional", projectDetails);
      alert(`Project details sent to ${matchingTalent.name}! Status set to 'Offered'.`);
      setMatchingTalent(null);
      setMatchingStartupId('');
      setProjectDetails('');
    } catch (err) {
      alert("Matching failed: " + err.message);
    }
  };

  const handleUpdateMatch = async (matchId, status) => {
    try {
      await updateMatchStatus(matchId, status);
      alert(`Match status updated to ${status}.`);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const handleFundChange = (id, value) => {
    setFundingInputs(prev => ({ ...prev, [id]: value }));
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── Auth Gate ────────────────────────────────────────────────────────────────
  if (isAdminView && !isAuthorized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ width: '100%', maxWidth: '460px', padding: '3rem', textAlign: 'center' }}
        >
          {/* Icon */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
            width: '88px', height: '88px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
            border: '1px solid rgba(59,130,246,0.3)'
          }}>
            <Shield size={44} style={{ color: 'var(--accent-primary)' }} />
          </div>

          <h2 style={{ marginBottom: '0.5rem' }}>System Admin Gate</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Restricted area. Access resets every page load — sessions expire after 30 minutes.
          </p>

          {/* Lockout Warning */}
          {lockSecondsLeft > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '1rem', marginBottom: '1.5rem',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}
            >
              <AlertTriangle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '0.85rem' }}>Account Locked</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Retry in <strong style={{ color: 'var(--danger)' }}>{formatTime(lockSecondsLeft)}</strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && lockSecondsLeft === 0 && (
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
          )}

          <form onSubmit={handleAuth} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>
                Admin Access Key
              </label>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter secure access key..."
                disabled={lockSecondsLeft > 0}
                autoComplete="new-password"
                style={{
                  width: '100%', padding: '1rem',
                  background: lockSecondsLeft > 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${error ? 'var(--danger)' : 'var(--glass-border)'}`,
                  borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                  opacity: lockSecondsLeft > 0 ? 0.5 : 1, cursor: lockSecondsLeft > 0 ? 'not-allowed' : 'text'
                }}
              />
            </div>

            {/* Attempt counter */}
            {attemptsLeft < MAX_ATTEMPTS && lockSecondsLeft === 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginBottom: '1rem', textAlign: 'center' }}>
                ⚠ {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before lockout
              </p>
            )}

            <button
              type="submit"
              className="btn-primary full-width"
              disabled={lockSecondsLeft > 0}
              style={{ padding: '1rem', opacity: lockSecondsLeft > 0 ? 0.5 : 1, cursor: lockSecondsLeft > 0 ? 'not-allowed' : 'pointer' }}
            >
              <Shield size={18} /> Verify Identity
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Main Dashboard ───────────────────────────────────────────────────────────
  return (
    <div className="investor-page animate-fade-in" style={{ padding: '2rem' }}>
      <div className="investor-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
            {isAdminView ? <Shield size={40} /> : <Landmark size={40} />}
            {isAdminView ? "System Administrator" : "Global Investor Radar"}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {isAdminView
              ? "Oversee all startup activity and make final decisions on ecosystem funding."
              : "Discover the latest AI-validated startup pitches. Public visibility for the Skill2Earn X community."}
          </p>
        </div>

        {isAdminView && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            {/* Session countdown */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: timeLeft < 300 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
              border: `1px solid ${timeLeft < 300 ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
              borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
              color: timeLeft < 300 ? 'var(--danger)' : 'var(--success)'
            }}>
              <Clock size={14} />
              {formatTime(timeLeft)}
            </div>
            <span style={{
              fontSize: '0.75rem', padding: '0.5rem 1rem',
              background: 'rgba(16,185,129,0.1)', color: 'var(--success)',
              borderRadius: '20px', fontWeight: 800
            }}>
              ADMIN ACTIVE ✓
            </span>
            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>

      <div className="investor-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Ventures in Pool</span>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{displayedStartups.length}</div>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Capital Deployed</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
            ₹{displayedStartups.filter(s => s.investment).reduce((acc, s) => acc + (s.investment || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Avg. Feasibility</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {displayedStartups.length ? Math.round(displayedStartups.reduce((acc, s) => acc + s.feasibility, 0) / displayedStartups.length) : 0}%
          </div>
        </div>
      </div>

      <div className="startup-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Venture Pool</h2>
        {isAdminView && allStartups.length > 0 && (
          <button 
            onClick={handleWipeAll}
            className="btn-secondary"
            style={{ 
              padding: '0.4rem 1rem', 
              fontSize: '0.75rem', 
              color: 'var(--danger)', 
              borderColor: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Trash2 size={14} /> Wipe All Ventures
          </button>
        )}
      </div>

      <div className="startup-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {displayedStartups.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            {isAdminView ? "No startups currently seeking investment." : "No funded startup ventures available on the public radar right now."}
          </div>
        ) : (
          displayedStartups.map((startup, index) => (
            <motion.div
              key={startup._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel startup-investor-card"
              style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.2fr', gap: '2rem', alignItems: 'center' }}
            >
              <div className="startup-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{startup.title}</h3>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--bg-color-secondary)', borderRadius: '4px' }}>By {startup.owner}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{startup.pitch}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14} /> Impact: {startup.impact}</span>
                  {startup.isHiring && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', background: 'rgba(16,185,129,0.1)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                      <Rocket size={14} /> Hiring: {startup.hiringRole} ({startup.hiringPositions} positions)
                    </span>
                  )}
                </div>
              </div>

              <div className="startup-metrics">
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Feasibility</span><span>{startup.feasibility}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-color-secondary)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${startup.feasibility}%`, background: 'var(--accent-primary)', borderRadius: '3px' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Risk Score</span>
                    <span style={{ color: startup.riskScore > 50 ? 'var(--danger)' : 'var(--success)' }}>{startup.riskScore}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-color-secondary)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${startup.riskScore}%`, background: startup.riskScore > 50 ? 'var(--danger)' : 'var(--success)', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>

              <div className="startup-actions" style={{ textAlign: 'right' }}>
                {isAdminView ? (
                  /* Admin Actions (Already existing) */
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                    {startup.status === 'Pending Review' ? (
                      <>
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', border: '1px solid var(--glass-border)', color: 'var(--danger)' }}
                          onClick={() => handleDelete(startup._id || startup.id)}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                          onClick={() => handleAction(startup._id, 'Rejected By Investor')}
                        >
                          <XCircle size={18} /> Reject
                        </button>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>₹</span>
                            <input 
                              type="number"
                              placeholder="Amount..."
                              value={fundingInputs[startup._id] || ''}
                              onChange={(e) => handleFundChange(startup._id, e.target.value)}
                              style={{ 
                                padding: '0.5rem 0.5rem 0.5rem 1.5rem', 
                                width: '120px', 
                                borderRadius: '6px', 
                                border: '1px solid var(--glass-border)',
                                background: 'var(--bg-color-secondary)',
                                color: 'var(--text-primary)',
                                outline: 'none'
                              }}
                            />
                          </div>
                          <button
                            className="btn-primary"
                            onClick={() => handleAction(startup._id, 'Funded', parseInt(fundingInputs[startup._id]) || 500000)}
                          >
                            <DollarSign size={18} /> {startup.isHiring ? 'Approve & Match' : 'Fund'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                           {startup.status === 'Paused' ? (
                             <button
                               className="btn-secondary"
                               style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', color: 'var(--success)', borderColor: 'var(--success)' }}
                               onClick={() => handleAction(startup._id, 'Funded')}
                             >
                               Resume
                             </button>
                           ) : (
                             <button
                               className="btn-secondary"
                               style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', color: 'var(--warning)', borderColor: 'var(--warning)' }}
                               onClick={() => handleAction(startup._id, 'Paused')}
                             >
                               Pause
                             </button>
                           )}
                        </div>
                        <span className={`status-badge ${startup.status === 'Funded' ? 'safe' : 'risky'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                          {startup.status === 'Funded' ? <ShieldCheck size={14} /> : <XCircle size={14} />}
                          {startup.status.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* User/Job Seeker Actions */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                    {startup.isHiring ? (
                      <button 
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={async () => {
                          try {
                            await createApplication(startup.title, startup.hiringRole);
                            alert(`Application submitted to ${startup.title}! Awaiting admin permission.`);
                          } catch (err) {
                            alert(err.message);
                          }
                        }}
                      >
                        <Briefcase size={18} /> Apply for {startup.hiringRole}
                      </button>
                    ) : (
                      <span className="status-badge safe" style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                        <ShieldCheck size={14} /> {startup.status === 'Funded' ? 'ELITE FUNDED' : 'VALUATED'}
                      </span>
                    )}
                    {startup.investment > 0 && <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>₹{startup.investment.toLocaleString()}</span>}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {isAdminView && (
        <div style={{ marginTop: '4rem' }}>
          <div className="glass-panel" style={{ border: '1px solid rgba(59,130,246,0.2)', background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                <Users size={28} /> Registered User Accounts
              </h2>
              {allUsers.length > 0 && (
                <button 
                  onClick={removeAllUsers}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Trash2 size={14} /> Wipe All Users
                </button>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              System Administration: Viewing all {allUsers.length} registered accounts and their verification status.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {allUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
                  No registered accounts found in the database.
                </div>
              ) : (
                allUsers.map((user, idx) => (
                  <motion.div
                    key={user._id || idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel"
                    style={{ padding: '1.5rem', borderTop: `4px solid ${user.isElite ? 'var(--success)' : 'var(--accent-primary)'}`, position: 'relative' }}
                  >
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', paddingRight: '1.5rem' }}>
                      <h4 style={{ margin: 0 }}>{user.name}</h4>
                      <div style={{ background: user.isElite ? 'var(--success)' : 'var(--bg-color-secondary)', color: 'var(--text-primary)', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {user.score || 0}%
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {(user.skills || []).slice(0, 3).map((s, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', background: 'var(--bg-color-secondary)', borderRadius: '3px' }}>{s.name}</span>
                      ))}
                    </div>
                    <button 
                      className="btn-primary full-width" 
                      style={{ fontSize: '0.8rem' }} 
                      onClick={() => setMatchingTalent(user)}
                      disabled={!user.name || user.name === 'User'}
                    >
                      Match & Send Project
                    </button>
                    
                    {/* Simplified Status Badge */}
                    {matches.filter(m => m.talentName === user.name).length > 0 && (
                      <div style={{ marginTop: '1rem', padding: '0.5rem 0.75rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-primary)', textAlign: 'center' }}>
                         {matches.filter(m => m.talentName === user.name)[0].status.toUpperCase()} @ {matches.filter(m => m.talentName === user.name)[0].startupName}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      )}


      {/* Matching Modal */}
      {matchingTalent && (
        <div 
          className="modal-overlay" 
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setMatchingTalent(null)}
        >
          <motion.div 
            className="glass-panel" 
            style={{ width: '500px', padding: '3rem', textAlign: 'center' }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-gradient">Propose Project</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Send industrial project details to <strong>{matchingTalent.name}</strong></p>
            
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group">
                <label>Select Hiring Startup</label>
                <select 
                  value={matchingStartupId} 
                  onChange={(e) => setMatchingStartupId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                >
                  <option value="">Choose a startup...</option>
                  {allStartups.filter(s => s.isHiring).map(s => (
                    <option key={s._id} value={s._id}>{s.title} ({s.hiringRole})</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Industrial Project Details</label>
                <textarea 
                  rows="4" 
                  placeholder="Outline the project scope, timeline, and expectations..."
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleCreateMatch}>
                  Send Proposal
                </button>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setMatchingTalent(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default InvestorDashboard;
