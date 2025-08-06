export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

export const getMonthName = (month: number) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};

export const isWeekend = (date: number, month: number, year: number) => {
  const day = new Date(year, month - 1, date).getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

export const isToday = (date: number, month: number, year: number) => {
  const today = new Date();
  return (
    today.getDate() === date &&
    today.getMonth() === month - 1 &&
    today.getFullYear() === year
  );
};