import React from 'react';
import { GraduationCap, Calculator, Brain } from 'lucide-react';

export interface ClassCardData {
  id: string;
  title: string;
  taskCountText: string;
  theme: 'mint' | 'yellow' | 'purple';
  hasBadgeDot?: boolean;
}

interface LectureClassCardProps {
  card: ClassCardData;
  onViewTasks?: (id: string) => void;
}

export const LectureClassCard: React.FC<LectureClassCardProps> = ({ card, onViewTasks }) => {
  const getIcon = () => {
    switch (card.theme) {
      case 'mint':
        return <GraduationCap size={26} />;
      case 'yellow':
        return <Calculator size={24} />;
      case 'purple':
        return <Brain size={24} />;
    }
  };

  return (
    <div className={`lecture-class-card ${card.theme}`}>
      {/* Hexagon Icon */}
      <div className={`class-icon-hexagon ${card.theme}`}>
        {card.hasBadgeDot && <span className="badge-dot" />}
        {getIcon()}
      </div>

      {/* Class Title */}
      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'inherit', marginBottom: '4px' }}>
        {card.title}
      </h3>

      {/* Subtitle */}
      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
        {card.taskCountText}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewTasks?.(card.id)}
        className="btn-pill-white"
      >
        View Tasks
      </button>
    </div>
  );
};
