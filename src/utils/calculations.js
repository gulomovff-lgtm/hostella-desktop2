import { daysBetween } from './dateHelpers';

/**
 * Calculation Helpers
 */

// Calculate total price for a stay
export const calculateStayPrice = (checkInDate, checkOutDate, pricePerNight) => {
  const nights = daysBetween(checkInDate, checkOutDate);
  return nights * pricePerNight;
};

// Calculate remaining debt
export const calculateDebt = (totalAmount, paidAmount) => {
  return Math.max(0, totalAmount - paidAmount);
};

// Format number as currency
export const formatCurrency = (amount, currency = 'UZS') => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with spaces (e.g., 1000000 -> 1 000 000)
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
