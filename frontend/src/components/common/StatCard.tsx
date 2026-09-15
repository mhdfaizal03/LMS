import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  color = 'primary',
}) => {
  const colorMap = {
    primary: { bg: 'var(--primary-light)', text: 'var(--primary)' },
    success: { bg: 'var(--success-light)', text: 'var(--success)' },
    warning: { bg: 'var(--warning-light)', text: 'var(--warning)' },
    danger: { bg: 'var(--danger-light)', text: 'var(--danger)' },
    info: { bg: 'var(--info-light)', text: 'var(--info)' },
  };

  const current = colorMap[color];

  return (
    <div className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: current.bg,
          color: current.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
