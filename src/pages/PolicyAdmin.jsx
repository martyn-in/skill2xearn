import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldCheck, ArrowLeft, Users, Landmark } from 'lucide-react';
import './PolicyAdmin.css';

const adminStats = [
  { label: "Active Regional MSMEs", value: "12,450", trend: "+12%" },
  { label: "Micro-Loans Disbursed", value: "₹45.8 Cr", trend: "+8.5%" },
  { label: "Youth Upskilled (2024-26)", value: "85,200", trend: "+24%" },
  { label: "Gig Success Rate", value: "94.2%", trend: "+3.1%" },
];

const policyData = [
  { month: 'Jan 24', digitalLiteracy: 45, msmeGrowth: 30 },
  { month: 'Jun 24', digitalLiteracy: 52, msmeGrowth: 38 },
  { month: 'Jan 25', digitalLiteracy: 65, msmeGrowth: 55 },
  { month: 'Jun 25', digitalLiteracy: 78, msmeGrowth: 72 },
  { month: 'Jan 26', digitalLiteracy: 92, msmeGrowth: 85 },
];

const skillDeficitData = [
  { skill: 'Prompt Eng', demand: 95, supply: 40 },
  { skill: 'AI Safety', demand: 88, supply: 25 },
  { skill: 'Data Ops', demand: 75, supply: 50 },
  { skill: 'Decision AI', demand: 92, supply: 30 },
];

const PolicyAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="policy-page animate-fade-in" style={{ padding: '2rem' }}>
      <div className="policy-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Back to User Dashboard
        </div>
        
        <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={36} /> Policy Decision Support System
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Macro-level economic analytics for government officials and NGOs to allocate resouces under SDG-8 initiatives.</p>
      </div>

      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {adminStats.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.label}</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
            <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '500' }}>{stat.trend} vs last month</span>
          </div>
        ))}
      </div>

      <div className="policy-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} className="text-gradient"/> 
            <h3 style={{ margin: 0 }}>Regional Digitization Trajectory</h3>
          </div>
          <div style={{ flex: 1, padding: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={policyData}>
                <defs>
                  <linearGradient id="colorDL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMSME" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="digitalLiteracy" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorDL)" name="Digital Literacy %" />
                <Area type="monotone" dataKey="msmeGrowth" stroke="var(--success)" fillOpacity={1} fill="url(#colorMSME)" name="MSME Job Posting %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} className="text-gradient" /> 
            <h3 style={{ margin: 0 }}>Market Skill Deficits (Supply vs Demand)</h3>
          </div>
          <div style={{ flex: 1, padding: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDeficitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="skill" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                <Bar dataKey="demand" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Market Demand" />
                <Bar dataKey="supply" fill="var(--accent-secondary)" radius={[4, 4, 0, 0]} name="Labor Supply" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyAdmin;
