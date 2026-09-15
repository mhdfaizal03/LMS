import React from 'react';
import { Certificate } from '../../types';
import { GraduationCap, Award, ShieldCheck, Printer } from 'lucide-react';

interface CertificatePrintableProps {
  certificate: Certificate;
}

export const CertificatePrintable: React.FC<CertificatePrintableProps> = ({ certificate }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
      {/* Action bar */}
      <div style={{ display: 'flex', gap: '10px' }} className="no-print">
        <button onClick={handlePrint} className="btn btn-primary">
          <Printer size={16} /> Print or Save as PDF
        </button>
      </div>

      {/* Official Certificate Layout */}
      <div
        id="printable-certificate"
        style={{
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          padding: '4rem 3rem',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '12px double #d97706',
          position: 'relative',
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {/* Decorative corner accents */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#d97706' }}>✦</div>
        <div style={{ position: 'absolute', top: '20px', right: '20px', color: '#d97706' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#d97706' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#d97706' }}>✦</div>

        {/* Institution Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <GraduationCap size={26} />
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Edu<span style={{ color: '#4f46e5' }}>Pulse</span> Academy
          </span>
        </div>

        <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>
          Certificate of Completion
        </div>

        <div style={{ width: '80px', height: '3px', backgroundColor: '#d97706', margin: '0 auto 2rem' }} />

        <p style={{ fontSize: '1.0625rem', color: '#475569', fontStyle: 'italic', marginBottom: '1.5rem' }}>
          This is proudly presented to
        </p>

        <h1
          style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            color: '#1e1b4b',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-heading)',
            textDecoration: 'underline',
            textDecorationColor: '#e0e7ff',
          }}
        >
          {certificate.student_name}
        </h1>

        <p style={{ fontSize: '1.0625rem', color: '#475569', maxWidth: '650px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          for successfully fulfilling all curriculum requirements, continuous hands-on projects, assessments, and demonstrating mastery in
        </p>

        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#4f46e5',
            marginBottom: '3rem',
          }}
        >
          {certificate.course_name}
        </h2>

        {/* Signatures & Verification Badge */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem' }}>
          {/* Instructor Sign */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'cursive', fontSize: '1.5rem', color: '#1e293b', marginBottom: '6px' }}>
              {certificate.instructor_name}
            </div>
            <div style={{ width: '160px', height: '1px', backgroundColor: '#94a3b8', margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>
              Lead Instructor
            </div>
          </div>

          {/* Gold Seal */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #fbbf24 0%, #d97706 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(217, 119, 6, 0.4)',
                border: '4px solid #fef3c7',
                marginBottom: '6px',
              }}
            >
              <ShieldCheck size={36} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Official Seal
            </span>
          </div>

          {/* Verification Code */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
              {new Date(certificate.issued_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style={{ width: '160px', height: '1px', backgroundColor: '#94a3b8', margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              ID: {certificate.certificate_code}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print, header, footer, nav, aside {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            padding: 0 !important;
          }
          #printable-certificate {
            box-shadow: none !important;
            border: 8px double #d97706 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
