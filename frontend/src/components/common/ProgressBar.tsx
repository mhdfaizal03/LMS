import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  height?: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  height = 8,
  color,
}) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className="progress-bar-bg"
        style={{ height: `${height}px` }}
      >
        <div
          className="progress-bar-fill"
          style={{
            width: `${clamped}%`,
            background: color || (clamped >= 100 ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), #818cf8)'),
          }}
        />
      </div>
    </div>
  );
};
