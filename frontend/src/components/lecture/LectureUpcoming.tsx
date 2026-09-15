import React from 'react';
import { ChevronRight, FileEdit, BookOpen, PenTool } from 'lucide-react';

interface UpcomingEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: string;
  iconType: 'purple' | 'yellow';
  isActiveDot?: boolean;
}

export const LectureUpcoming: React.FC = () => {
  const events: UpcomingEvent[] = [
    {
      id: 1,
      title: 'Psychology Exam',
      description: 'Carry out writing exams in school',
      date: '19 Jan',
      duration: '45 Minutes',
      iconType: 'purple',
      isActiveDot: true,
    },
    {
      id: 2,
      title: 'Mathematics Teory',
      description: 'Carry out writing summary in school',
      date: '20 - 21 Jan',
      duration: '3 Hours',
      iconType: 'yellow',
      isActiveDot: false,
    },
    {
      id: 3,
      title: 'Literature Exam',
      description: 'Carry out writing exams in school',
      date: '22 Jan',
      duration: '50 Minutes',
      iconType: 'purple',
      isActiveDot: false,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'inherit' }}>
          Upcoming<span className="lecture-dot">.</span>
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {events.map((event, index) => (
          <div key={event.id} className="timeline-item">
            {/* Vertical connector line */}
            {index < events.length - 1 && <div className="timeline-line" />}

            {/* Indicator Dot */}
            <div className={`timeline-dot ${event.isActiveDot ? 'active' : 'inactive'}`} />

            {/* Event Info */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'inherit', lineHeight: 1.3 }}>
                  {event.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>
                  {event.description}
                </div>
              </div>

              {/* Right time & icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'right', flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lecture-coral)' }}>
                    {event.date}
                  </div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b', marginTop: '1px' }}>
                    {event.duration}
                  </div>
                </div>

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: event.iconType === 'purple' ? '#f0f1fd' : '#fff8e7',
                    color: event.iconType === 'purple' ? '#6366f1' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {event.iconType === 'purple' ? <FileEdit size={16} /> : <BookOpen size={16} />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom link */}
      <div style={{ marginTop: '1.5rem' }}>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--lecture-coral)',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0,
          }}
        >
          View all upcoming <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
