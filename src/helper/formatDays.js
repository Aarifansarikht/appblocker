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

export const getChartData = (tab) => {
  if (tab === 'Day') {
    return [
      { label: '9AM', correct: 3, wrong: 1 },
      { label: '12PM', correct: 5, wrong: 2 },
      { label: '3PM', correct: 2, wrong: 3 },
      { label: '6PM', correct: 6, wrong: 1 },
    ];
  }

  if (tab === 'Week') {
    return [
      { label: 'Mon', correct: 10, wrong: 2 },
      { label: 'Tue', correct: 6, wrong: 4 },
      { label: 'Wed', correct: 8, wrong: 3 },
      { label: 'Thu', correct: 5, wrong: 5 },
      { label: 'Fri', correct: 12, wrong: 1 },
    ];
  }

  return [
    { label: 'W1', correct: 40, wrong: 10 },
    { label: 'W2', correct: 35, wrong: 15 },
    { label: 'W3', correct: 50, wrong: 8 },
    { label: 'W4', correct: 60, wrong: 5 },
  ];
};