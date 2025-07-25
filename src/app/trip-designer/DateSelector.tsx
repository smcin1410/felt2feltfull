import React, { useState } from 'react';

type Mode = 'explore' | 'set';

interface DateSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
  onDateChange: (start: string, end: string) => void;
}

// Simulated demand data for August 2025
const demandCalendar = [
  { date: '2025-08-10', demand: 'high' },
  { date: '2025-08-11', demand: 'medium' },
  { date: '2025-08-12', demand: 'low' },
  { date: '2025-08-13', demand: 'medium' },
  { date: '2025-08-14', demand: 'high' },
  { date: '2025-08-15', demand: 'medium' },
];

const DateSelector: React.FC<DateSelectorProps> = ({
  mode,
  onModeChange,
  selectedStartDate,
  selectedEndDate,
  onDateChange,
}) => {
  const [setStart, setSetStart] = useState(selectedStartDate || '');
  const [setEnd, setSetEnd] = useState(selectedEndDate || '');

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => onModeChange('explore')}
          style={{ fontWeight: mode === 'explore' ? 'bold' : 'normal', marginRight: 8 }}
        >
          Explore Dates & Deals
        </button>
        <button
          onClick={() => onModeChange('set')}
          style={{ fontWeight: mode === 'set' ? 'bold' : 'normal' }}
        >
          Plan with Set Dates
        </button>
      </div>
      {mode === 'explore' ? (
        <div>
          <h4>Demand Level Calendar (Simulated)</h4>
          <ul>
            {demandCalendar.map((d) => (
              <li key={d.date}>
                {d.date}: <span style={{ color: d.demand === 'high' ? 'red' : d.demand === 'medium' ? 'orange' : 'green' }}>{d.demand}</span>
                <button style={{ marginLeft: 8 }} onClick={() => onDateChange(d.date, d.date)}>
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h4>Set Your Dates</h4>
          <label>
            Start Date:
            <input
              type="date"
              value={setStart}
              onChange={e => {
                setSetStart(e.target.value);
                onDateChange(e.target.value, setEnd);
              }}
              style={{ marginLeft: 8 }}
            />
          </label>
          <br />
          <label>
            End Date:
            <input
              type="date"
              value={setEnd}
              onChange={e => {
                setSetEnd(e.target.value);
                onDateChange(setStart, e.target.value);
              }}
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default DateSelector; 