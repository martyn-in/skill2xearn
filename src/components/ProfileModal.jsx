import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Award, Settings, Save, CheckCircle, LogOut, Eye, Edit2, Trash2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from "@convex-dev/auth/react";
import { useAppContext } from '../context/AppContext';
import './ProfileModal.css';

const ProfileModal = () => {
  const { isProfileOpen, setIsProfileOpen, userProfile, setUserProfile, addCertificate, removeCertificate, editCertificate, clearData } = useAppContext();
  const { signOut } = useAuthActions();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');
  const [editName, setEditName] = useState(userProfile?.name || '');
  const [saved, setSaved] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [tempCertTitle, setTempCertTitle] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);

  if (!userProfile) return null;

  const handleSave = () => {
    setUserProfile({ ...userProfile, name: editName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addCertificate(file.name, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditCert = (cert) => {
    setEditingCertId(cert.id);
    setTempCertTitle(cert.title);
  };

  const saveCertEdit = (certId) => {
    editCertificate(certId, tempCertTitle);
    setEditingCertId(null);
  };

  const handleViewCert = (cert) => {
    setSelectedCert(cert);
  };

  const handleDownloadCert = (cert) => {
    // Simulated download logic
    const link = document.createElement('a');
    link.href = cert.preview || '#';
    link.download = `${cert.title.replace(/\s+/g, '_')}_Certificate.png`;
    document.body.appendChild(link);
    if (cert.preview) {
      link.click();
    } else {
      alert("Preparing high-resolution PDF for download... This feature will be available in the next system update.");
    }
    document.body.removeChild(link);
  };

  const certificates = userProfile.certificates || [];

  return (
    <>
      <AnimatePresence>
      {isProfileOpen && (
        <div className="modal-overlay" onClick={() => setIsProfileOpen(false)}>
          <motion.div 
            className="profile-modal glass-panel"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setIsProfileOpen(false)}>
              <X size={24} />
            </button>

            <div className="modal-tabs">
              <button 
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} /> Settings
              </button>
              <button 
                className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
                onClick={() => setActiveTab('certificates')}
              >
                <Award size={18} /> Certificates
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'settings' && (
                <div className="settings-content" style={{ textAlign: 'left' }}>
                  <h3 style={{ textAlign: 'left' }}>Edit Profile</h3>
                  <div className="input-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={18} />
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <button className="btn-primary" onClick={handleSave} style={{ width: '100%', marginTop: '2rem' }}>
                    {saved ? <><CheckCircle size={18} /> Changes Saved</> : <><Save size={18} /> Save Settings</>}
                  </button>

                  <button className="btn-secondary" onClick={() => { signOut(); clearData(); setIsProfileOpen(false); navigate('/'); }} style={{ width: '100%', marginTop: '1rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                    <LogOut size={18} /> Logout and Reset
                  </button>

                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="certificates-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Your Achievements</h3>
                    <label className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <Save size={14} /> Upload New
                      <input type="file" hidden onChange={handleFileUpload} accept=".pdf,.png,.jpg" />
                    </label>
                  </div>
                  
                  {certificates.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                      No certificates uploaded yet.
                    </div>
                  ) : (
                    <div className="certs-grid">
                    {certificates.map(cert => (
                      <div key={cert.id} className="cert-card" style={{ alignItems: 'flex-start' }}>
                        <div className="cert-icon" style={{ marginTop: '0.5rem' }}>
                          <Award size={32} className="text-gradient" />
                        </div>
                        <div className="cert-info" style={{ flex: 1 }}>
                          {editingCertId === cert.id ? (
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <input 
                                type="text"
                                value={tempCertTitle}
                                onChange={(e) => setTempCertTitle(e.target.value)}
                                style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--accent-primary)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem', width: '100%' }}
                              />
                            </div>
                          ) : (
                            <h4>{cert.title}</h4>
                          )}
                          <p>{cert.date} • Score: {cert.score}%</p>
                          
                          <div className="cert-actions">
                            {editingCertId === cert.id ? (
                              <button className="cert-action-btn" onClick={() => saveCertEdit(cert.id)} style={{ color: 'var(--success)' }}>
                                <CheckCircle size={14} /> Save
                              </button>
                            ) : (
                              <>
                                <button className="cert-action-btn" onClick={() => handleViewCert(cert)}>
                                  <Eye size={14} /> View
                                </button>
                                <button className="cert-action-btn" onClick={() => handleDownloadCert(cert)}>
                                  <Download size={14} /> Download
                                </button>
                                <button className="cert-action-btn" onClick={() => startEditCert(cert)}>
                                  <Edit2 size={14} /> Edit
                                </button>
                              </>
                            )}
                            <button className="cert-action-btn delete" onClick={() => removeCertificate(cert.id)}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                        <div className="cert-badge">Verified</div>
                      </div>
                    ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    <AnimatePresence>
        {selectedCert && (
          <motion.div 
            className="modal-overlay" 
            style={{ zIndex: 3000, background: 'rgba(0,0,0,0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              className="cert-preview-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '600px', maxWidth: '95vw', padding: '0', overflow: 'hidden', border: '5px solid var(--accent-primary)', borderRadius: '12px' }}
            >
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-color)', color: 'var(--text-primary)', position: 'relative' }}>
                <button 
                  onClick={() => setSelectedCert(null)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>

                <Award size={64} style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Certificate of Achievement</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>This is to certify that</p>
                <h2 style={{ fontSize: '1.8rem', margin: '1rem 0', textDecoration: 'underline' }}>{userProfile.name}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>has successfully verified the credential</p>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-secondary)' }}>{selectedCert.title}</h3>
                
                {selectedCert.preview ? (
                  <div style={{ marginTop: '2rem', border: '1px solid var(--glass-border)', padding: '0.5rem', background: 'white', borderRadius: '4px' }}>
                    <img src={selectedCert.preview} alt="Certificate Attachment" style={{ maxWidth: '100%', maxHeight: '300px', display: 'block', margin: '0 auto' }} />
                    <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '0.5rem' }}>Attached Document Preview</p>
                  </div>
                ) : (
                  <div style={{ marginTop: '3rem', padding: '2rem', border: '2px solid var(--glass-border)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>SCORE: {selectedCert.score}%</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>VERIFICATION ID: SX-{selectedCert.id}</p>
                  </div>
                )}

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn-primary" onClick={() => handleDownloadCert(selectedCert)}>
                    <Download size={18} /> Download High-Res
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedCert(null)}>
                    <X size={18} /> Close
                  </button>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Issued On</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>{selectedCert.date}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', margin:0 }}>SKILL2EARN X</p>
                    <p style={{ fontSize: '0.6rem', margin: 0, opacity: 0.6 }}>Authenticated Digital Ledger</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileModal;
