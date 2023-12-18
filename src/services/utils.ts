/**
 * Formats a date to dd-mm-yyyy
 * @param date
 * @returns
 */
export const formatDate = (date: Date = new Date()) => {
  // NOTE: Using "date-fns" would be a better option to achieve this, but felt it was overkill just for this
  const formatter = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return formatter.format(date).replaceAll('/', '-');
};
