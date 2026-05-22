export const formatZAR = (amount: number, showSign = false): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    ...(showSign && { signDisplay: 'always' }),
  }).format(amount);
};

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

export const formatDateShort = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short',
  });

export const formatDateGrouped = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-ZA', {
    weekday: 'short', month: 'short', day: 'numeric',
  });