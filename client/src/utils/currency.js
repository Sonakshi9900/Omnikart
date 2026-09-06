/**
 * Indian Currency Formatting Utility
 * Formats prices using the Indian Rupee symbol (₹) and Indian numbering system (Lakhs/Crores)
 * E.g., 100000 -> ₹1,00,000
 */
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
