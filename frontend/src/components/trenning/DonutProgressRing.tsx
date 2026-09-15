import React from 'react';

interface DonutProgressRingProps {
  percentage: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
}

export const DonutProgressRing: React.FC<DonutProgressRingProps> = ({
  percentage,
  label,
  size = 28,
  strokeWidth = 3.5,
  color = '#10b981',
  bgColor = '#e2e8f0',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width={size} height={size} className="donut-circle">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 500, lineHeight: 1.1 }}>
          {label}
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'inherit', lineHeight: 1.2 }}>
          {percentage}% <span style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 400 }}>ⓘ</span>
        </div>
      </div>
    </div>
  );
};
