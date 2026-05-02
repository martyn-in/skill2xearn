import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { economicForecast } from '../mockData';
import { TrendingUp, Activity } from 'lucide-react';
import './EconomicForecast.css';

const EconomicForecast = () => {
  return (
    <div className="economic-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Economic Forecast & ROI</h1>
        <p className="page-subtitle">Predictive models showing your future job demand and salary growth.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel flex-row">
          <div className="stat-icon-wrapper green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Projected 6mo Growth</span>
            <span className="stat-value text-gradient">+125%</span>
          </div>
        </div>
        <div className="stat-card glass-panel flex-row">
          <div className="stat-icon-wrapper blue">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Market Demand Score</span>
            <span className="stat-value">94/100</span>
          </div>
        </div>
      </div>

      <div className="forecast-chart-container glass-panel">
        <div className="panel-header">
          <h3>Market Demand vs. Income Trajectory</h3>
          <div className="legend">
            <span className="legend-item"><span className="dot blue"></span> Demand</span>
            <span className="legend-item"><span className="dot green"></span> Income</span>
          </div>
        </div>
        
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={economicForecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
              <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-color)', 
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Area type="monotone" dataKey="projectedDemand" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorDemand)" strokeWidth={3} />
              <Area type="monotone" dataKey="actualIncome" stroke="var(--success)" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EconomicForecast;
