import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Award, User, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Leaderboard.css';

const Leaderboard = () => {
  const { allUsers, userProfile } = useAppContext();
  
  const topTalent = (allUsers || [])
    .map(u => ({
      name: u.name,
      score: u.score || 0,
      rank: u.rank || "Beginner",
      isUser: u.name === userProfile?.name,
      badge: u.score >= 90 ? "Elite" : null
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div className="leaderboard-container glass-panel">
      <div className="leaderboard-header">
        <div className="trophy-wrapper">
          <Trophy size={32} className="text-gradient" />
        </div>
        <div>
          <h2>Global Leaderboard</h2>
          <p>Top 1% of Skill Intelligence scores globally</p>
        </div>
      </div>

      <div className="leaderboard-list">
        {topTalent.map((player, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`leaderboard-item ${player.isUser ? 'user-highlight' : ''}`}
          >
            <div className="rank-number">#{i + 1}</div>
            <div className="player-avatar">
              <User size={20} />
            </div>
            <div className="player-info">
              <div className="player-name">
                {player.name}
                {player.badge && <span className="player-badge">{player.badge}</span>}
              </div>
              <div className="player-rank">{player.rank} Status</div>
            </div>
            <div className="player-stats">
              <div className="player-score">{player.score}%</div>
              <TrendingUp size={14} className="trend-up" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="leaderboard-footer">
        <Target size={16} />
        <span>Boost your score by 15% to break into the Top 50!</span>
      </div>
    </div>
  );
};

export default Leaderboard;
