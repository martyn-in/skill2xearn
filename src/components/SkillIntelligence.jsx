import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppContext } from '../context/AppContext';
import './SkillIntelligence.css';

const SkillIntelligence = () => {
  const { userProfile, t } = useAppContext();

  if (!userProfile || !userProfile.skills || userProfile.skills.length === 0) {
    return <div className="skill-intelligence-container glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>No skills analyzed yet. Initialize your AI profile to see insights.</div>;
  }

  // Strict AI Trend Mapping
  const getStrictAIGaps = (topSkill) => {
    const skillName = topSkill.name.toLowerCase();
    
    if (skillName.includes('management') || skillName.includes('leadership')) {
      return [
        { title: "AI-Agents for Ops", level: "Strict", description: "Market Shift: Moving from manual Jira tracking to Autonomous Agent orchestration." },
        { title: "Predictive Resource Plan", level: "High", description: "Real-time AI modeling of regional labor supply vs project deadlines." }
      ];
    } else if (skillName.includes('literacy') || skillName.includes('digital')) {
      return [
        { title: "Advanced Prompting", level: "Essential", description: "Chain-of-thought prompting is now the baseline for professional digital roles." },
        { title: "AI Data Privacy", level: "Strict", description: "Compliance with regional AI act for data handling is a non-negotiable skill." }
      ];
    } else if (skillName.includes('sales') || skillName.includes('communication')) {
      return [
        { title: "Hyper-Personalization", level: "Vanguard", description: "AI-driven micro-segmentation of leads is replacing classic CRM patterns." },
        { title: "Sentiment Analysis", level: "High", description: "Real-time AI coaching during customer interactions is the target index." }
      ];
    } else if (skillName.includes('tech') || skillName.includes('code') || skillName.includes('software')) {
      return [
        { title: "RAG Systems", level: "Strict", description: "Market Need: Moving from basic LLM calls to Retrieval Augmented Generation architectures." },
        { title: "AI SecOps", level: "Critical", description: "Protecting model weights and preventing prompt injection is the top 2026 security trend." }
      ];
    }
    
    return [
      { title: "AI Workflow Integration", level: "Global", description: "The ability to weave LLMs into standard task cycles is the key gap." },
      { title: "Neural Networks 101", level: "Optional", description: "Foundational understanding of how models process your data." }
    ];
  };

  const topSkill = userProfile.skills.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  const aiGaps = getStrictAIGaps(topSkill);

  // Fixed Benchmark (Market demand baseline)
  const trendData = userProfile.skills.map(skill => ({
    name: skill.name,
    userScore: skill.score,
    trendScore: Math.min(100, skill.score + 20) // Consistent market demand offset
  }));

  return (
    <div className="skill-pulse-wrapper" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 1fr', gap: '2rem', minHeight: '400px' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ margin: 0 }}>Strict AI Benchmarking (2024-2026)</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Comparing {userProfile.name}'s profile against Global AI Standards</p>
        </div>
        
        <div style={{ flex: 1, padding: '1rem', minHeight: '350px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={trendData}>
              <PolarGrid stroke="var(--glass-border)" gridType="circle" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 500 }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ display: 'none' }}
                stroke="var(--glass-border)"
              />
              <Radar
                name="Your Profile"
                dataKey="userScore"
                stroke="var(--accent-primary)"
                fill="var(--accent-primary)"
                fillOpacity={0.6}
              />
              <Radar
                name="AI Market Trend"
                dataKey="trendScore"
                stroke="var(--success)"
                fill="var(--success)"
                fillOpacity={0.15}
                strokeDasharray="4 4"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--glass-bg)', 
                  borderColor: 'var(--glass-border)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--text-primary)'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-legend" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', marginTop: '1rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
              <span>Current Capability</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', border: '1px dashed var(--success)', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '2px' }}></div>
              <span>Strict AI Benchmark</span>
           </div>
        </div>
      </div>

      <div className="analysis-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0 }}>Knowledge Analysis</h4>
          <span style={{ fontSize: '0.65rem', background: 'var(--danger)', color: 'var(--text-primary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Strict Mode</span>
        </div>
        
        {aiGaps.map((gap, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1rem', borderLeft: i === 0 ? '4px solid var(--accent-primary)' : '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{gap.title}</span>
              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--bg-color-secondary)', borderRadius: '4px', color: 'var(--accent-primary)' }}>{gap.level}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{gap.description}</p>
          </div>
        ))}
        
        <div style={{ marginTop: 'auto', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
           <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>Strict Guidance:</p>
           <p style={{ fontSize: '0.8rem', margin: 0 }}>To bridge the gap between your **{topSkill.name}** and the 2026 market, focus on **{aiGaps[0].title}**. General knowledge is no longer sufficient.</p>
        </div>
      </div>
    </div>
  );
};

export default SkillIntelligence;
