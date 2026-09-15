import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { AuditLogItem } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { History, Shield, Clock, Search } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminApi.getAuditLogs({ limit: 100 })
      .then((data) => {
        setLogs(data);
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
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Platform Audit Trail</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Immutable administrative record of sensitive actions, status modifications, and security events.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading audit logs..." />
      ) : logs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <History size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h4>No audit records found</h4>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Target Entity</th>
                <th>Target ID</th>
                <th>Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-secondary" style={{ textTransform: 'uppercase' }}>
                      {log.target_type}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                    #{log.target_id || '—'}
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
