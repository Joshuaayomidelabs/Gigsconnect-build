export const formatCurrency = (amount: number, currency: string = 'USD') => {
  const currencyCode = (currency || 'USD').toUpperCase();
  
  // Ensure NGN always displays with the ₦ symbol
  if (currencyCode === 'NGN') {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(amount);
    return `₦${formattedAmount}`;
  }

  // Use Intl.NumberFormat for thousand separators and standard formatting
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  } catch (e) {
    // Fallback if currency code is not supported by Intl
    const symbol = currencyCode === 'USD' ? '$' : currencyCode + ' ';
    const formattedAmount = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(amount);
    return `${symbol}${formattedAmount}`;
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};
