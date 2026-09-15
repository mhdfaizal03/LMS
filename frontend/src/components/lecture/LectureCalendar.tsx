import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const LectureCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2021, 0, 19)); // January 2021

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // January 2021 specific visual calendar grid as shown in screenshot
  const days = [
    // Previous month days
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    // January days
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true, isSelected: true },
    { day: 20, isCurrentMonth: true, inRange: true, isRangeStart: true },
    { day: 21, isCurrentMonth: true, inRange: true, isRangeEnd: true },
    { day: 22, isCurrentMonth: true, isSelected: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
  ];

  return (
    <div>
      {/* Month & Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'inherit' }}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handlePrevMonth}
            className="btn-icon"
            style={{ width: '28px', height: '28px', padding: 0 }}
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="btn-icon"
            style={{ width: '28px', height: '28px', padding: 0 }}
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.75rem' }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <span key={day} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '6px', textAlign: 'center' }}>
        {days.map((item, index) => {
          let className = 'calendar-day';
          if (!item.isCurrentMonth) className += ' muted';
          if (item.isSelected) className += ' selected';
          if (item.inRange) className += ' in-range';
          if (item.isRangeStart) className += ' range-start';
          if (item.isRangeEnd) className += ' range-end';

          return (
            <div key={index} style={{ display: 'flex', justifyContent: 'center' }}>
              <div className={className}>
                {item.day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
