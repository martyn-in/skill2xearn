import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, BookOpen, Brain, Globe, Zap, ArrowUpRight, X, RefreshCw, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

const MarketPulse = () => {
  const { t } = useAppContext();
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  
  const fetchTrends = useAction(api.market.fetchRealtimeTrends);

  const [aiTrendData, setAiTrendData] = useState([
    { year: '2024 (Q1)', genAI: 140, conventional: 75 },
    { year: '2025 (Est)', genAI: 210, conventional: 80 },
    { year: '2026 (Est)', genAI: 320, conventional: 85 },
  ]);

  const [sectorImpact, setSectorImpact] = useState([
    { sector: 'Finance', impact: 85, color: '#3b82f6' },
    { sector: 'Education', impact: 92, color: '#a855f7' },
    { sector: 'Healthcare', impact: 78, color: '#10b981' },
    { sector: 'Retail', impact: 65, color: '#f59e0b' },
  ]);

  const [liveNews, setLiveNews] = useState([]);

  const updateMarketData = async () => {
    setIsUpdating(true);
    try {
      const data = await fetchTrends();
      if (data.success) {
        const currentYear = new Date().getFullYear();
        
        // Update charts with live dynamic data based on HackerNews API
        setAiTrendData([
          { year: '2024 (Historical)', genAI: 140, conventional: 75 },
          { year: 'Current (Live)', genAI: data.metrics.currentAIIndex, conventional: 78 },
          { year: 'Next Year (Proj)', genAI: data.metrics.currentAIIndex * 1.4, conventional: 82 },
        ]);

        setSectorImpact([
          { sector: 'Finance & Crypto', impact: Math.min(100, data.metrics.financeImpact), color: '#3b82f6' },
          { sector: 'Tech & SaaS', impact: Math.min(100, data.metrics.techImpact), color: '#a855f7' },
          { sector: 'Healthcare', impact: 78, color: '#10b981' }, // Static baseline
          { sector: 'Retail', impact: 65, color: '#f59e0b' }, // Static baseline
        ]);

        if (data.recentAiNews) {
          setLiveNews(data.recentAiNews);
        }
        
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error("Failed to fetch live trends", e);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately on mount
    updateMarketData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(updateMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const analysisContent = {
    finance: {
      title: "AI in Micro-Finance",
      content: "Deploying AI in rural micro-finance fundamentally lowers risk margins for traditional lending structures. By analyzing mobile wallet histories, agricultural weather sensors, and e-commerce transactions simultaneously, algorithms determine a 'Trust Score' outperforming 80-year-old credit schema architectures. SDG Goal alignment states financial inclusion drives raw economic velocity in emerging markets."
    },
    msme: {
      title: "LLMs for Scaling MSMEs",
      content: "Micro, Small and Medium Enterprises (MSMEs) cannot afford $50,000 enterprise tech integrations. Localized Large Language Models provide instant automated sales representation and multi-lingual customer grievance logic via WhatsApp layers. This tech immediately upgrades a 2-person enterprise into a platform capable of handling regional B2B and consumer scale, aligning perfectly with expanding digital job footprints."
    },
    ethics: {
      title: "Ethical AI Deployment",
      content: "The 2026 global framework enforces compliance explicitly across data privacy laws concerning generative structures. Systems trained on regional demographic inputs face heavy audit strictures if unencrypted. This presents a massive job avenue: AI Compliance Officers and Audit Analysts are seeing a 300% hiring spike globally."
    }
  };

  return (
    <div className="market-pulse-page animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
            <Globe size={40} /> {t.analytics || "Market Pulse"}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Live API Feed & Regional Economic Analysis</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <button 
            onClick={updateMarketData} 
            disabled={isUpdating}
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <RefreshCw size={16} className={isUpdating ? "spin" : ""} />
            {isUpdating ? "Syncing API..." : "Live Sync"}
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Last updated: {lastUpdated}</span>
        </div>
      </div>

      <div className="pulse-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Main Trends Chart */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
          {isUpdating && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
               <Activity size={32} className="text-gradient pulse-slow" />
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Generative AI Growth Trajectory <span className="status-indicator online"></span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Live market capitalization index</p>
            </div>
            <div className="trending-badge" style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
               <TrendingUp size={14} style={{ marginRight: '4px' }} /> Dynamic Target
            </div>
          </div>

          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiTrendData}>
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'var(--text-primary)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="genAI" 
                  stroke="var(--accent-primary)" 
                  fillOpacity={1} 
                  fill="url(#colorGen)" 
                  name="Generative AI" 
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="conventional" 
                  stroke="var(--text-secondary)" 
                  fill="transparent" 
                  name="Classic Software" 
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Impact */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             Impact by Sector <Activity size={16} className="text-gradient" />
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorImpact} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="sector" type="category" stroke="var(--text-secondary)" width={110} fontSize={11} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]} name="Automation Potential %">
                  {sectorImpact.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {liveNews.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Activity className="text-gradient pulse-slow" /> Real-Time Live Feed
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {liveNews.map((news, i) => (
              <a key={i} href={news.url} target="_blank" rel="noopener noreferrer" className="glass-panel" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--accent-primary)', transition: 'transform 0.2s' }}>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.05rem' }}>{news.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem', display: 'block' }}>Hacker News API Feed • Fetched Live</span>
                </div>
                <ArrowUpRight size={18} style={{ color: 'var(--text-secondary)' }} />
              </a>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ margin: '3rem 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <BookOpen className="text-gradient" /> AI Knowledge Center
      </h2>

      <div className="knowledge-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <Zap size={32} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <h3>AI in Micro-Finance</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Machine learning algorithms are now used to calculate multi-dimensional credit scores for rural entrepreneurs who lack traditional banking history.
          </p>
          <button className="btn-secondary" onClick={() => setSelectedAnalysis(selectedAnalysis === 'finance' ? null : 'finance')} style={{ marginTop: '1.5rem', width: '100%', gap: '0.5rem', justifyContent: 'center' }}>
            {selectedAnalysis === 'finance' ? 'Close Analysis' : 'Read Analysis'} <ArrowUpRight size={16} />
          </button>
          <AnimatePresence>
            {selectedAnalysis === 'finance' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    {analysisContent.finance.content}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <Brain size={32} style={{ color: 'var(--accent-secondary)', marginBottom: '1rem' }} />
          <h3>LLMs for Scaling MSMEs</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Small businesses are using Large Language Models to automate customer support in regional languages, reducing overhead by up to 60%.
          </p>
          <button className="btn-secondary" onClick={() => setSelectedAnalysis(selectedAnalysis === 'msme' ? null : 'msme')} style={{ marginTop: '1.5rem', width: '100%', gap: '0.5rem', justifyContent: 'center' }}>
            {selectedAnalysis === 'msme' ? 'Close Analysis' : 'Read Analysis'} <ArrowUpRight size={16} />
          </button>
          <AnimatePresence>
            {selectedAnalysis === 'msme' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    {analysisContent.msme.content}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <Globe size={32} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
          <h3>Ethical AI Deployment</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Understanding regional data privacy laws is critical as AI systems begin to handle more sensitive demographic data in emerging markets.
          </p>
          <button className="btn-secondary" onClick={() => setSelectedAnalysis(selectedAnalysis === 'ethics' ? null : 'ethics')} style={{ marginTop: '1.5rem', width: '100%', gap: '0.5rem', justifyContent: 'center' }}>
            {selectedAnalysis === 'ethics' ? 'Close Analysis' : 'Read Analysis'} <ArrowUpRight size={16} />
          </button>
          <AnimatePresence>
            {selectedAnalysis === 'ethics' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    {analysisContent.ethics.content}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="sdg-footer" style={{ marginTop: '4rem', padding: '2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
         <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
           Aligned with **UN Sustainable Development Goal 8**: Decent Work and Economic Growth through responsible AI adoption.
         </p>
      </div>
    </div>
  );
};

export default MarketPulse;
