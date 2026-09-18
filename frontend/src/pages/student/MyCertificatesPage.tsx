import React, { useState, useEffect } from 'react';
import { certificateApi } from '../../api';
import { Certificate } from '../../types';
import { CertificateCard } from '../../components/certificate/CertificateCard';
import EmptyState from '../../components/ui/EmptyState';
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
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h1 className="font-display text-xl font-800 text-slate-900">My Credentials & Certificates</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Official verifiable completion certificates for all fully finished courses.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 premium-shadow">
          <EmptyState
            icon={Award}
            title="No certificates earned yet"
            description="Complete 100% of the lessons, quizzes, and assignments in any course to automatically receive your credential."
            actionLabel="Explore Enrolled Courses"
            onAction={() => (window.location.href = '/student/courses')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
};
