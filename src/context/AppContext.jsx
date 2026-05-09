import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const AppContext = createContext();

const translations = {
  en: {
    dashboard: "Dashboard",
    onboarding: "AI Analyzer",
    startup: "Entrepreneur",
    investor: "Investor",
    learning: "Learning",
    analytics: "Market Pulse",
    lang: "English",
    nav_back: "Back to Home",
    startup_level1: "Pitch Level 1",
    startup_level2: "Feasibility",
    startup_level3: "Investment",
    or_manual: "Or enter details manually",
    full_name: "Full Name",
    skills_label: "Skills (e.g. Sales, Typing, Excel)",
    exp_label: "Brief Experience / Background",
    start_ai: "Start AI Analysis",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    onboarding: "AI विश्लेषक",
    startup: "उद्यमी",
    investor: "निवेशक",
    learning: "सीखना",
    analytics: "बाजार नब्ज",
    lang: "हिंदी",
    nav_back: "घर वापस",
    startup_level1: "पिच स्तर 1",
    startup_level2: "व्यवहार्यता",
    startup_level3: "निवेश",
    or_manual: "या विवरण मैन्युअल रूप से दर्ज करें",
    full_name: "पूर्ण नाम",
    skills_label: "कौशल (जैसे बिक्री, टाइपिंग, एक्सेल)",
    exp_label: "संक्षिप्त अनुभव / पृष्ठभूमि",
    start_ai: "AI विश्लेषण शुरू करें",
  },
  te: {
    dashboard: "డ్యాష్‌బోర్డ్",
    onboarding: "AI విశ్లేషకుడు",
    startup: "ఔత్సాహిక పారిశ్రామికవేత్త",
    investor: "పెట్టుబడిదారుడు",
    learning: "లర్నింగ్",
    analytics: "మార్కెట్ పల్స్",
    lang: "తెలుగు",
    nav_back: "మళ్లీ ఇంటికి",
    startup_level1: "పిచ్ లెవల్ 1",
    startup_level2: "సాధ్యత",
    startup_level3: "పెట్టుబడి",
    or_manual: "లేదా వివరాలను మాన్యువల్‌గా నమోదు చేయండి",
    full_name: "పూర్తి పేరు",
    skills_label: "నైపుణ్యాలు (ఉదా. సేల్స్, టైపింగ్, ఎక్సెల్)",
    exp_label: "సంక్షిప్త అనుభవం / నేపథ్యం",
    start_ai: "AI విశ్లేషణను ప్రారంభించండి",
  }
};

// Compute a skill score from the text a user inputs
const computeSkillsFromText = (text) => {
  const lower = (text || "").toLowerCase();
  const candidates = [
    { name: "AI & Machine Learning", keywords: ["ai", "ml", "machine learning", "deep learning", "nlp"] },
    { name: "Data Analysis", keywords: ["data", "excel", "sql", "analytics", "statistics"] },
    { name: "Communication", keywords: ["sales", "communication", "presentation", "writing", "marketing"] },
    { name: "Programming", keywords: ["python", "javascript", "coding", "software", "developer"] },
    { name: "Operations", keywords: ["operations", "logistics", "management", "admin", "typing"] },
    { name: "Finance", keywords: ["finance", "accounting", "gst", "tax", "investment"] },
    { name: "Design", keywords: ["design", "figma", "photoshop", "ui", "ux"] },
  ];
  
  let matched = candidates.filter(c => c.keywords.some(k => lower.includes(k)));
  
  // Base skill set if nothing matches
  if (matched.length === 0) {
    matched = [
      { name: "Digital Literacy", keywords: [] },
      { name: "Problem Solving", keywords: [] },
      { name: "Communication", keywords: [] }
    ];
  }

  // Ensure at least 3 skills for Radar charts
  while (matched.length < 3) {
    const filler = candidates.find(c => !matched.find(m => m.name === c.name));
    if (filler) matched.push(filler);
    else break;
  }
  
  return matched.map(s => ({ 
    name: s.name, 
    score: Math.floor(Math.random() * (92 - 65 + 1)) + 65 // Dynamic but realistic base score
  }));
};

const computeScore = (skills) => {
  if (!skills || skills.length === 0) return 65;
  const avg = skills.reduce((acc, s) => acc + s.score, 0) / skills.length;
  return Math.round(avg);
};

const computeRank = (score) => {
  if (score >= 90) return "Elite";
  if (score >= 75) return "Advanced";
  if (score >= 60) return "Intermediate";
  return "Beginner";
};

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('s2ex_lang') || 'en');
  const [theme, setTheme] = useState(localStorage.getItem('s2ex_theme') || 'dark');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Authenticated user from Convex
  const viewer = useQuery(api.users.viewer);
  
  const [userProfile, setUserProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('s2ex_user')) || null; } catch { return null; }
  });

  // Sync viewer with userProfile
  useEffect(() => {
    if (viewer) {
      setUserProfile(prev => ({ ...prev, ...viewer }));
    }
  }, [viewer]);

  const [localStartupProfile, setLocalStartupProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('s2ex_startup')) || null; } catch { return null; }
  });
  const [roadmap, setRoadmap] = useState(() => {
    try { return JSON.parse(localStorage.getItem('s2ex_roadmap')) || []; } catch { return []; }
  });

  // --- Live Convex queries (real-time across all devices) ---
  const allStartups = useQuery(api.startups.listAll) ?? [];
  const shortlistPool = useQuery(api.users.listElite) ?? [];
  const allUsers = useQuery(api.users.listAll) ?? [];
  const matches = useQuery(api.matches.listAll) ?? [];
  
  // Dynamically derive opportunities from live startups that are hiring
  const opportunities = allStartups
    .filter(s => s.isHiring)
    .map(s => ({
      id: s._id,
      title: s.hiringRole,
      company: s.title,
      type: "Full-time / Elite",
      location: "Remote / AI Hub",
      salary: "$80k - $150k",
      matchScore: 85 + Math.floor(Math.random() * 14),
      matchReason: `High alignment with your ${userProfile?.skills?.[0]?.name || 'core'} expertise.`,
      applied: matches.some(m => m.startupName === s.title && m.talentName === userProfile?.name)
    }));


  // Always use the freshest data from the live remote database if available
  const dbStartup = allStartups.find(
    s => s._id === localStartupProfile?.id || 
         s._id === localStartupProfile?._id || 
         (userProfile?.name && s.owner === userProfile.name)
  );
  
  const startupProfile = dbStartup || localStartupProfile;

  const setStartupProfile = (newProfile) => {
    setLocalStartupProfile(newProfile);
    if (!newProfile) localStorage.removeItem('s2ex_startup');
  };

  const submitStartupMutation = useMutation(api.startups.submit);
  const updateStartupMutation = useMutation(api.startups.updateStatus);
  const removeStartupMutation = useMutation(api.startups.remove);
  const syncUserMutation = useMutation(api.users.syncProfile);
  const addMatchMutation = useMutation(api.matches.addMatch);
  const scheduleInterviewMutation = useMutation(api.matches.scheduleInterview);
  const selectForHiringMutation = useMutation(api.matches.selectForHiring);
  const updateMatchStatusMutation = useMutation(api.matches.updateStatus);
  const removeAllMatchesMutation = useMutation(api.matches.removeAll);
  const removeAllStartupsMutation = useMutation(api.startups.removeAll);
  const removeUserMutation = useMutation(api.users.remove);
  const removeAllUsersMutation = useMutation(api.users.removeAll);

  // Persist user session preferences only
  useEffect(() => {
    localStorage.setItem('s2ex_lang', lang);
  }, [lang, lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('s2ex_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (userProfile) localStorage.setItem('s2ex_user', JSON.stringify(userProfile));
    if (localStartupProfile) localStorage.setItem('s2ex_startup', JSON.stringify(localStartupProfile));
    if (roadmap) localStorage.setItem('s2ex_roadmap', JSON.stringify(roadmap));
  }, [userProfile, localStartupProfile, roadmap]);

  const t = translations[lang];

  const generateRoadmap = (skills) => {
    const baseline = [];
    
    // Dynamically generate based on user skills
    if (skills && skills.length > 0) {
      skills.forEach((skill, i) => {
        baseline.push({ 
          id: i + 1, 
          title: `Mastering ${skill.name} with Autonomous AI`, 
          provider: "Skill2Earn Intelligence", 
          duration: "10-15 Hours", 
          impact: "+15% Score", 
          status: i === 0 ? "in-progress" : "locked", 
          progress: i === 0 ? 10 : 0 
        });
      });
    }
    
    // Add a skill-specific course
    if (skills && skills.length > 0) {
      const topSkill = skills[0].name;
      baseline.push({ 
        id: 4, 
        title: `Advanced ${topSkill} with AI`, 
        provider: "Industry Partners", 
        duration: "10 Hours", 
        impact: "+20% Score", 
        status: "locked", 
        progress: 0 
      });
    }
    
    return baseline;
  };

  const submitStartup = async (pitchData) => {
    const payload = {
      title: pitchData.title || "Untitled Startup",
      description: pitchData.description || pitchData.pitch || "",
      problem: pitchData.problem || "",
      pitch: pitchData.pitch || "",
      vision: pitchData.vision || "",
      impact: pitchData.impact || "",
      owner: userProfile?.name || "Founder",
      isHiring: !!pitchData.isHiring,
      hiringRole: pitchData.hiringRole || "",
      hiringPositions: pitchData.hiringPositions?.toString() || "0",
    };
    const id = await submitStartupMutation(payload);
    
    // Real-time analysis simulation based on pitch quality
    const combinedText = (payload.title + payload.description + payload.vision).length;
    const dynamicFeasibility = Math.min(95, 50 + (combinedText / 20));
    const dynamicRisk = Math.max(10, 80 - (combinedText / 15));

    const newProfile = { 
      ...payload, 
      id, 
      status: 'Pending Review', 
      riskScore: Math.round(dynamicRisk), 
      feasibility: Math.round(dynamicFeasibility), 
      recommendations: combinedText > 200 ? 
        ["Prepare for Investor Radar", "Secure initial beta users"] : 
        ["Expand problem description", "Define target demographic more clearly"] 
    };
    setStartupProfile(newProfile);
    return newProfile;
  };

  const updateStartupStatus = async (id, status, investment = 0) => {
    await updateStartupMutation({ id, status, investment });
  };

  const removeStartup = async (id) => {
    await removeStartupMutation({ id });
    if (localStartupProfile?.id === id || localStartupProfile?._id === id) {
      setStartupProfile(null);
    }
  };

  const removeAllStartups = async () => {
    await removeAllStartupsMutation();
    setStartupProfile(null);
  };

  const removeUser = async (id) => {
    await removeUserMutation({ id });
  };

  const removeAllUsers = async () => {
    await removeAllUsersMutation();
    setUserProfile(null);
  };

  const addCertificate = async (certName, preview = null) => {
    if (!userProfile) return;
    const boost = 10;
    const newScore = Math.min(100, (userProfile.score || 0) + boost);
    const newCert = {
      id: Date.now(),
      title: certName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      score: newScore,
      preview: preview
    };
    const updatedProfile = {
      ...userProfile,
      score: newScore,
      certificates: [...(userProfile.certificates || []), newCert]
    };
    setUserProfile(updatedProfile);
    try {
      await syncUserMutation({ 
        name: updatedProfile.name, 
        score: newScore, 
        rank: updatedProfile.rank || 'Beginner',
        skills: updatedProfile.skills || [],
        lastUpdate: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Sync failed:", e);
    }
  };

  const removeCertificate = async (certId) => {
    if (!userProfile) return;
    const updatedProfile = {
      ...userProfile,
      certificates: userProfile.certificates.filter(c => c.id !== certId)
    };
    setUserProfile(updatedProfile);
    try {
      await syncUserMutation({
        name: updatedProfile.name,
        score: updatedProfile.score || 0,
        rank: updatedProfile.rank || 'Beginner',
        skills: updatedProfile.skills || [],
        lastUpdate: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Sync failed:", e);
    }
  };

  const editCertificate = async (certId, newTitle) => {
    if (!userProfile) return;
    const updatedProfile = {
      ...userProfile,
      certificates: userProfile.certificates.map(c => 
        c.id === certId ? { ...c, title: newTitle } : c
      )
    };
    setUserProfile(updatedProfile);
    try {
      await syncUserMutation({
        name: updatedProfile.name,
        score: updatedProfile.score || 0,
        rank: updatedProfile.rank || 'Beginner',
        skills: updatedProfile.skills || [],
        lastUpdate: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Sync failed:", e);
    }
  };

  const createMatch = async (talentName, startupName, role, projectDetails) => {
    try {
      await addMatchMutation({ talentName, startupName, role, projectDetails, source: 'Admin' });
    } catch (err) {
      console.error("Match error:", err);
      throw err;
    }
  };

  const createApplication = async (startupName, role) => {
    if (!userProfile?.name) throw new Error("Profile name required to apply.");
    try {
      await addMatchMutation({ 
        talentName: userProfile.name, 
        startupName, 
        role, 
        source: 'User' 
      });
    } catch (err) {
      console.error("Application error:", err);
      throw err;
    }
  };

  const updateMatchStatus = async (id, status) => {
    return await updateMatchStatusMutation({ id, status });
  };

  const removeAllMatches = async () => {
    await removeAllMatchesMutation();
  };

  const analyzeResume = async (name, rawText) => {
    const skills = computeSkillsFromText(rawText);
    const score = computeScore(skills);
    const rank = computeRank(score);
    
    // Enhanced Market Trend Analysis
    const marketTrends = [
      "High demand for Generative AI integration in traditional workflows.",
      "Increasing need for 'AI-Augmented' specialized roles (Engineering, Sales, Design).",
      "Shift towards outcome-based gig economy for skilled digital talent.",
      "Growing importance of AI Ethics and Responsible Tech implementation."
    ];
    const marketAnalysis = `Based on current 2026 market trends, your profile shows a ${score}% alignment. The industry is currently shifting toward ${skills[0]?.name || 'AI-native'} solutions. To reach Elite status, focus on bridging the gap in AI-governance and specialized prompt workflows.`;

    const profile = {
      ...(userProfile || {}),
      name: name || "User",
      score,
      rank,
      skills,
      marketAnalysis,
      certificates: [],
      lastUpdate: new Date().toISOString(),
    };
    
    const newRoadmap = generateRoadmap(skills);
    setRoadmap(newRoadmap);
    setUserProfile(profile);
    
    try {
      await syncUserMutation({ 
        name: profile.name, 
        score, 
        rank, 
        skills, 
        marketAnalysis,
        lastUpdate: profile.lastUpdate, 
        certificates: [] 
      });
    } catch (e) {
      console.warn("Convex sync failed:", e);
    }
    return profile;
  };

  const scheduleInterview = async (matchId, date) => {
    return await scheduleInterviewMutation({ id: matchId, interviewDate: date });
  };

  const selectForHiring = async (matchId, hiringStatus) => {
    return await selectForHiringMutation({ id: matchId, hiringStatus });
  };

  const clearData = () => {
    localStorage.removeItem('s2ex_user');
    localStorage.removeItem('s2ex_startup');
    localStorage.removeItem('s2ex_lang');
    localStorage.removeItem('s2ex_roadmap');
    setUserProfile(null);
    setStartupProfile(null);
    setRoadmap([]);
    removeAllMatches();
  };

  return (
    <AppContext.Provider value={{
      lang, setLang, t,
      theme, setTheme,
      isChatOpen, setIsChatOpen,
      isProfileOpen, setIsProfileOpen,
      isSidebarOpen, setIsSidebarOpen,
      userProfile, setUserProfile,
      analyzeResume,
      roadmap, setRoadmap,
      startupProfile, setStartupProfile,
      submitStartup,
      allStartups,
      allUsers,
      updateStartupStatus,

      removeStartup,
      shortlistPool,
      matches,
      addCertificate,
      removeCertificate,
      editCertificate,
      createMatch,
      createApplication,
      updateMatchStatus,
      scheduleInterview,
      selectForHiring,
      removeAllMatches,
      removeAllStartups,
      removeUser,
      removeAllUsers,
      opportunities,
      clearData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
