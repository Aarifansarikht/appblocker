export const formatDays = (days) => {
  if (!days.length) return 'Everyday';

  if (days.length === 7) return 'Everyday';

  if (
    days.length === 5 &&
    ['Mon','Tue','Wed','Thu','Fri'].every(d => days.includes(d))
  ) return 'Weekdays';

  if (
    days.length === 2 &&
    days.includes('Sat') && days.includes('Sun')
  ) return 'Weekend';

  return days.join(', ');
};