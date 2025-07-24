import mongoose from 'mongoose';

export const mockTimetable = {
  columns: ['一', '二', '三', '四', '五', '六', '日'],
  rows: generateRows()
};

function generateRows() {
  const times = [
    '07:00 ~ 07:50', '08:00 ~ 08:50', '09:00 ~ 09:50',
    '10:10 ~ 11:00', '11:10 ~ 12:00', '12:10 ~ 13:00',
    '13:10 ~ 14:00', '14:10 ~ 15:00', '15:20 ~ 16:10',
    '16:20 ~ 17:10', '17:20 ~ 18:10', '18:20 ~ 19:10',
    '19:15 ~ 20:05', '20:10 ~ 21:00', '21:05 ~ 21:55',
  ];

  return times.map(time => ({
    time,
    classes: Array.from({ length: 7 }, () => ({})) 
  }));
}
