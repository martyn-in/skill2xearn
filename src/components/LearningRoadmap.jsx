import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react';
import './LearningRoadmap.css';

const LearningRoadmap = () => {
  const { roadmap = [] } = useAppContext();

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="roadmap-page animate-fade-in" style={{ padding: '2rem' }}>
        <div className="page-header">
          <h1 className="page-title">Adaptive Learning Pathway</h1>
          <p className="page-subtitle">Your personalized curriculum recommended by Skill2Earn AI.</p>
        </div>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No roadmap data available yet. Complete resume analysis to generate your personalized path.
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-page animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header">
        <h1 className="page-title">Adaptive Learning Pathway</h1>
        <p className="page-subtitle">Your personalized curriculum recommended by Skill2Earn AI to maximize your match percentages.</p>
      </div>

      <div className="timeline-container glass-panel">
        <div className="timeline">
          {roadmap.map((course, index) => (
            <div className={`timeline-item ${course.status}`} key={course.id}>
              <div className="timeline-marker">
                {course.status === 'completed' ? (
                  <CheckCircle size={20} className="status-icon green" />
                ) : course.status === 'in-progress' ? (
                  <PlayCircle size={20} className="status-icon blue" />
                ) : (
                  <Lock size={20} className="status-icon gray" />
                )}
                {index < roadmap.length - 1 && <div className="timeline-line"></div>}
              </div>

              <div className="timeline-content">
                <div className="course-card">
                  <div className="course-header">
                    <h4>{course.title}</h4>
                    <span className="course-provider">{course.provider}</span>
                  </div>
                  <div className="course-meta">
                    <span className="duration"><BookOpen size={14} /> {course.duration}</span>
                    <span className="impact text-gradient">{course.impact}</span>
                  </div>
                  
                  {course.status === 'in-progress' && (
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <span className="progress-text">{course.progress}% Complete</span>
                    </div>
                  )}

                  {course.status === 'locked' && (
                    <button className="btn-secondary lock-btn" disabled>Locked - Complete previous</button>
                  )}
                  {course.status === 'in-progress' && (
                    <button className="btn-primary resume-btn">Resume</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmap;
