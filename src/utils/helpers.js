/**
 * General helper functions for the Hostella application
 */

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

// Get safe document data
export const getDocData = (doc) => {
  if (!doc || !doc.exists()) return null;
  return { id: doc.id, ...doc.data() };
};
