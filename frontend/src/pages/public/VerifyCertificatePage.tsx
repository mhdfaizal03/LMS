import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { certificateApi } from '../../api';
import { CertificateVerifyResult } from '../../types';
import { CertificatePrintable } from '../../components/certificate/CertificatePrintable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ShieldCheck, Search, XCircle, Award } from 'lucide-react';

export const VerifyCertificatePage: React.FC = () => {
  const { code } = useParams<{ code?: string }>();
  const [searchCode, setSearchCode] = useState<string>(code || '');
  const [result, setResult] = useState<CertificateVerifyResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await certificateApi.verifyCertificate(codeToVerify.trim());
      setResult(data);
    } catch (err) {
      setResult({
        is_valid: false,
        message: 'Could not connect to certificate verification service.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      handleVerify(code);
    }
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(searchCode);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <ShieldCheck size={30} />
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Official Credential Verification
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto' }}>
          Enter any EduPulse certificate code (e.g. CERT-8F3A-92D1) to verify authentic student credential status and curriculum completion.
        </p>
      </div>

      {/* Input Search Form */}
      <div className="card glass-card" style={{ maxWidth: '600px', margin: '0 auto 3rem', padding: '1.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '14px' }} />
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. CERT-8F3A-92D1"
              style={{ paddingLeft: '42px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {/* Quick Demo Fill */}
        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Try demo certificate:</span>
          <button
            type="button"
            onClick={() => {
              setSearchCode('CERT-8F3A-92D1');
              handleVerify('CERT-8F3A-92D1');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            CERT-8F3A-92D1
          </button>
        </div>
      </div>

      {/* Verification Results */}
      {loading ? (
        <LoadingSpinner message="Verifying authenticity against database..." />
      ) : searched && result ? (
        result.is_valid && result.certificate ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontWeight: 700,
                fontSize: '0.9375rem',
              }}
            >
              <ShieldCheck size={20} /> Verified Authentic Credential
            </div>

            <CertificatePrintable certificate={result.certificate} />
          </div>
        ) : (
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '2.5rem', borderColor: 'var(--danger)' }}>
            <XCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.5rem' }}>
              Invalid or Unrecognized Certificate
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {result.message}
            </p>
          </div>
        )
      ) : null}
    </div>
  );
};
