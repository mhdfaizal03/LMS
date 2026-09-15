import React, { useState, useEffect } from 'react';
import { certificateApi } from '../../api';
import { Certificate } from '../../types';
import { CertificateCard } from '../../components/certificate/CertificateCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Award } from 'lucide-react';

export const MyCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    certificateApi.getMyCertificates()
      .then((data) => {
        setCertificates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Credentials & Certificates</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Official verifiable completion certificates for all fully finished courses.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your certificates..." />
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates earned yet"
          description="Complete 100% of the lessons, quizzes, and assignments in any course to automatically receive your credential."
          actionText="Explore Enrolled Courses"
          onAction={() => (window.location.href = '/student/courses')}
        />
      ) : (
        <div className="grid-3">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
};
