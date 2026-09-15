import React, { useState } from 'react';
import { DonutProgressRing } from './DonutProgressRing';
import { LearnerDetailDrawer } from './LearnerDetailDrawer';
import {
  Filter, Search, Download, MoreHorizontal, ChevronDown,
  CheckSquare, Square, X, Trash2, Plus, Users, UserCheck
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const LearnersProgressTab: React.FC = () => {
  const { showToast } = useNotification();
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress'>('progress');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLearner, setSelectedLearner] = useState<string | null>(null);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "A Designer's Toolkit for Crafting Exceptional User Interface",
    'Figma Skill - Figma Prototyping',
    'Mobile & Desktop Screen Pattern',
    'Mobile & Desktop Screen Pattern v2',
  ]);

  const learners = [
    { id: 1, name: 'Adit irwan', role: 'Jr UI/UX Designer', tag: 'Design', avatar: 'AI', status: 'Not started', statusColor: '#94a3b8', pts: null, progress: 0, assignedBy: 'Rehan Baiq' },
    { id: 2, name: 'Arif Brata', role: 'Jr UI/UX Designer', tag: 'Design', avatar: 'AB', status: 'Overdue', statusColor: '#ef4444', pts: null, progress: 0, assignedBy: 'Rehan Baiq' },
    { id: 3, name: 'Bagus Yuli', role: 'Ld Human Resources', tag: 'HR', avatar: 'BY', status: 'In progress', statusColor: '#f59e0b', pts: null, progress: 0, assignedBy: 'Pandji Manjiw' },
    { id: 4, name: 'Bani Naon', role: 'Jr UI/UX Designer', tag: 'Design', avatar: 'BN', status: 'In progress', statusColor: '#f59e0b', pts: 4, progress: 30, assignedBy: 'Pandji Manjiw' },
    { id: 5, name: 'Brian Domani', role: 'Staff Human Resources', tag: 'HR', avatar: 'BD', status: 'Not started', statusColor: '#94a3b8', pts: 0, progress: 0, assignedBy: 'Pandji Manjiw' },
    { id: 6, name: 'Depe Prada', role: 'PM UI/UX Designer', tag: 'Design', avatar: 'DP', status: 'Not started', statusColor: '#94a3b8', pts: 0, progress: 0, assignedBy: 'Rehan Baiq' },
    { id: 7, name: 'Fauzan Aziz', role: 'Md UI/UX Designer', tag: 'Design', avatar: 'FA', status: 'In progress', statusColor: '#f59e0b', pts: 4, progress: 70, assignedBy: 'Pandji Manjiw' },
  ];

  const toggleFilterItem = (item: string) => {
    setSelectedFilters((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div>
      {/* Header & Sub-tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Learners</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #f1f5f9', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`trenning-tab ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`trenning-tab ${activeTab === 'progress' ? 'active' : ''}`}
        >
          Progress
        </button>
      </div>

      {/* KPI & Controls Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
        {/* Left: Filter triggers & KPI stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" style={{ fontWeight: 700, borderRadius: 'var(--radius-md)' }}>
            👥 Peoples (100) <ChevronDown size={14} />
          </button>

          <button
            onClick={() => setShowFilterModal(!showFilterModal)}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 700, borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Filter size={14} /> Add Filter
          </button>

          <span className="badge badge-primary" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
            Learning content : {selectedFilters.length} selected
          </span>

          <DonutProgressRing
            label="Trained"
            percentage={50}
            size={34}
            color="#06b6d4"
          />

          <div style={{ fontSize: '0.8125rem' }}>
            <span style={{ fontWeight: 800, color: '#ef4444' }}>75</span> <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>↗ 5%</span>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Failed</div>
          </div>
        </div>

        {/* Right: Search & Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '9px', left: '10px' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '6px 12px 6px 32px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={() => showToast('Exporting learner records as CSV...', 'success')}
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#4338ca', borderRadius: 'var(--radius-md)', fontWeight: 700 }}
          >
            Export
          </button>

          <button className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Tree Filter Popover (Image 4) */}
        {showFilterModal && (
          <div
            className="card"
            style={{
              position: 'absolute',
              top: '52px',
              left: '120px',
              width: '380px',
              padding: '1.25rem',
              zIndex: 100,
              boxShadow: 'var(--shadow-xl)',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>Filters</div>
              <button onClick={() => setShowFilterModal(false)} className="btn-icon" style={{ width: '24px', height: '24px' }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Where</span>
              <span className="badge badge-secondary">Learning content ⌄</span>
              <span className="badge badge-primary">{selectedFilters.length} selected ⌄</span>
              <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer', marginLeft: 'auto' }} onClick={() => setSelectedFilters([])} />
            </div>

            {/* Tree checkbox list */}
            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
              <div style={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>⌄ Figma Basic</div>
              {[
                "A Designer's Toolkit for Crafting Exceptional User Interface",
                'Figma Skill - Figma Prototyping',
                'Mobile & Desktop Screen Pattern',
                'Mobile & Desktop Screen Pattern v2',
              ].map((item, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(item)}
                    onChange={() => toggleFilterItem(item)}
                  />
                  <span style={{ fontSize: '0.75rem' }}>{item}</span>
                </label>
              ))}

              <div style={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', marginTop: '6px' }}>⌄ Case Study</div>
              <div style={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>⌄ Fikri Studio</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Learners Progress Table */}
      <div className="card" style={{ padding: '0', borderRadius: '18px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}><input type="checkbox" /></th>
              <th>Full name ⇅</th>
              <th>Status ⇅</th>
              <th>Points</th>
              <th>Progress</th>
              <th>Assigned by ⇅</th>
            </tr>
          </thead>
          <tbody>
            {learners.map((l) => (
              <tr
                key={l.id}
                onClick={() => setSelectedLearner(l.name)}
                style={{ cursor: 'pointer' }}
                className="table-row-hover"
              >
                <td onClick={(e) => e.stopPropagation()}><input type="checkbox" /></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                      {l.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#4338ca' }}>
                        {l.name} <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 400 }}>{l.tag}</span>
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{l.role}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: l.statusColor }} />
                    {l.status}
                  </span>
                </td>
                <td>
                  {l.pts !== null ? (
                    <span style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#b45309' }}>🪙 {l.pts}pts</span>
                  ) : (
                    <span style={{ color: '#cbd5e1' }}>—</span>
                  )}
                </td>
                <td>
                  {l.progress > 0 ? (
                    <DonutProgressRing label="" percentage={l.progress} size={28} color="#06b6d4" />
                  ) : (
                    <DonutProgressRing label="" percentage={0} size={28} color="#cbd5e1" />
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>
                      👨‍🏫
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{l.assignedBy}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Drawer for Learner Details (Image 4) */}
      {selectedLearner && (
        <LearnerDetailDrawer
          learnerName={selectedLearner}
          onClose={() => setSelectedLearner(null)}
        />
      )}
    </div>
  );
};
