import type { TimetableData } from '../types/timetable';

export const mockTimetable: TimetableData = {
  columns: ['一', '二', '三', '四', '五', '六', '日'],
  rows: [
    { time: '07:00 ~ 07:50', classes: createEmptyRow() },
    { time: '08:00 ~ 08:50', classes: createEmptyRow() },
    { time: '09:00 ~ 09:50', classes: createEmptyRow() },
    { time: '10:10 ~ 11:00', classes: createEmptyRow() },
    { time: '11:10 ~ 12:00', classes: createEmptyRow() },
    { time: '12:10 ~ 13:00', classes: createEmptyRow() },
    { time: '13:10 ~ 14:00', classes: createEmptyRow() },
    { time: '14:10 ~ 15:00', classes: createEmptyRow() },
    { time: '15:20 ~ 16:10', classes: createEmptyRow() },
    { time: '16:20 ~ 17:10', classes: createEmptyRow() },
    { time: '17:20 ~ 18:10', classes: createEmptyRow() },
    { time: '18:20 ~ 19:10', classes: createEmptyRow() },
    { time: '19:15 ~ 20:05', classes: createEmptyRow() },
    { time: '20:10 ~ 21:00', classes: createEmptyRow() },
    { time: '21:05 ~ 21:55', classes: createEmptyRow() },
  ],
};

function createEmptyRow(): { className: string; color?: string }[] {
  return Array(7).fill({ className: '' });
}
