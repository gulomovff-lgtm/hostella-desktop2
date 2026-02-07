// Helper functions for the Hostella application
// Contains date helpers, calculations, and validation functions

/**
 * Date Helpers
 */

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

// Format date to DD.MM.YYYY
export const formatDateDisplay = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return `${formatDateDisplay(d)} ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
};

// Get current date
export const getCurrentDate = () => {
  return formatDate(new Date());
};

// Get date with offset in days
export const getDateWithOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

// Calculate difference between two dates in days
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if date is in the past
export const isPastDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
};

// Check if date is today
export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

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

/**
 * Validation Helpers
 */

// Validate phone number (basic validation)
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 9;
};

// Validate email
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate required field
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Validate date format (YYYY-MM-DD)
export const isValidDateFormat = (dateString) => {
  if (!dateString) return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Validate check-out date is after check-in date
export const isValidCheckOutDate = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return false;
  return new Date(checkOutDate) > new Date(checkInDate);
};

/**
 * String Helpers
 */

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate string with ellipsis
export const truncate = (str, maxLength) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Array Helpers
 */

// Sort array of objects by a property
export const sortByProperty = (array, property, ascending = true) => {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, properties) => {
  if (!searchTerm) return array;
  const term = searchTerm.toLowerCase();
  return array.filter(item => 
    properties.some(prop => 
      item[prop]?.toString().toLowerCase().includes(term)
    )
  );
};

/**
 * Object Helpers
 */

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Room Status Helpers
 */

// Get room status class
export const getRoomStatusClass = (status) => {
  const statusMap = {
    available: 'bg-green-100 text-green-800 border-green-300',
    occupied: 'bg-red-100 text-red-800 border-red-300',
    cleaning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    maintenance: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return statusMap[status] || statusMap.available;
};

// Get room status label
export const getRoomStatusLabel = (status) => {
  const statusMap = {
    available: 'Свободна',
    occupied: 'Занята',
    cleaning: 'Уборка',
    maintenance: 'Ремонт',
  };
  return statusMap[status] || 'Неизвестно';
};

/**
 * Firebase Helpers
 */

// Convert Firebase timestamp to Date
export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  return new Date(timestamp);
};

// Get safe document data
export const getDocData = (doc) => {
  if (!doc || !doc.exists()) return null;
  return { id: doc.id, ...doc.data() };
};
