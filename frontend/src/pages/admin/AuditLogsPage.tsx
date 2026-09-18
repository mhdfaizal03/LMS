import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { AuditLogItem } from '../../types';
import { TableSkeleton } from '../../components/ui/Skeletons';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
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
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h1 className="font-display text-xl font-800 text-slate-900">Platform Audit Trail</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Immutable administrative record of sensitive actions, status modifications, and security events.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
        {loading ? (
          <TableSkeleton rows={10} />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={History}
            title="No audit records found"
            description="There are currently no audit logs recorded in the system."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Action</th>
                  <th className="text-left px-4 py-3 font-semibold">Target Entity</th>
                  <th className="text-left px-4 py-3 font-semibold">Target ID</th>
                  <th className="text-left px-4 py-3 font-semibold">Details</th>
                  <th className="text-right px-5 py-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-blue-600 font-mono text-xs">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="muted">{log.target_type}</Badge>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-600">
                      #{log.target_id || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 truncate max-w-xs">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 text-right">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
