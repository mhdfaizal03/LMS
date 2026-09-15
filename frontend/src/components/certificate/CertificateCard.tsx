import React from 'react';
import { Certificate } from '../../types';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, ExternalLink, Download, Printer } from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
          }}
        >
          <Award size={26} />
        </div>
        <div>
          <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
            Verified Credential
          </span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {certificate.certificate_code}
          </div>
        </div>
      </div>

      <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        {certificate.course_name}
      </h4>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Awarded to <strong>{certificate.student_name}</strong> on {new Date(certificate.issued_at).toLocaleDateString()}
      </p>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Instructor: {certificate.instructor_name}
        </span>
        <Link
          to={`/verify-certificate/${certificate.certificate_code}`}
          className="btn btn-primary btn-sm"
        >
          View Credential <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};
