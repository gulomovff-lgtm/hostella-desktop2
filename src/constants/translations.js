// Translations for the Hostella application
// This file contains all text translations used throughout the app

export const translations = {
  ru: {
    // Navigation
    dashboard: 'Дашборд',
    rooms: 'Комнаты',
    calendar: 'Календарь',
    guests: 'Гости',
    clients: 'Клиенты',
    debts: 'Долги',
    reports: 'Отчеты',
    tasks: 'Задачи',
    shifts: 'Смены',
    expenses: 'Расходы',
    staff: 'Персонал',
    
    // Common
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    add: 'Добавить',
    close: 'Закрыть',
    search: 'Поиск',
    filter: 'Фильтр',
    loading: 'Загрузка...',
    success: 'Успешно',
    error: 'Ошибка',
    
    // Login
    login: 'Вход',
    logout: 'Выход',
    username: 'Логин',
    password: 'Пароль',
    loginButton: 'Войти',
    
    // Guest management
    checkIn: 'Заселение',
    checkOut: 'Выселение',
    guestName: 'Имя гостя',
    guestPhone: 'Телефон',
    guestCountry: 'Страна',
    roomNumber: 'Номер комнаты',
    
    // Room management
    roomAvailable: 'Свободна',
    roomOccupied: 'Занята',
    roomCleaning: 'Уборка',
    
    // Dates
    checkInDate: 'Дата заселения',
    checkOutDate: 'Дата выселения',
    today: 'Сегодня',
    
    // Financial
    price: 'Цена',
    paid: 'Оплачено',
    debt: 'Долг',
    total: 'Итого',
    currency: 'Валюта',
    
    // Shifts
    openShift: 'Открыть смену',
    closeShift: 'Закрыть смену',
    shiftBalance: 'Баланс смены',
    
    // Validation
    requiredField: 'Обязательное поле',
    invalidPhone: 'Неверный формат телефона',
    invalidDate: 'Неверная дата',
  },
  
  en: {
    // Navigation
    dashboard: 'Dashboard',
    rooms: 'Rooms',
    calendar: 'Calendar',
    guests: 'Guests',
    clients: 'Clients',
    debts: 'Debts',
    reports: 'Reports',
    tasks: 'Tasks',
    shifts: 'Shifts',
    expenses: 'Expenses',
    staff: 'Staff',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    
    // Login
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    loginButton: 'Sign In',
    
    // Guest management
    checkIn: 'Check In',
    checkOut: 'Check Out',
    guestName: 'Guest Name',
    guestPhone: 'Phone',
    guestCountry: 'Country',
    roomNumber: 'Room Number',
    
    // Room management
    roomAvailable: 'Available',
    roomOccupied: 'Occupied',
    roomCleaning: 'Cleaning',
    
    // Dates
    checkInDate: 'Check-in Date',
    checkOutDate: 'Check-out Date',
    today: 'Today',
    
    // Financial
    price: 'Price',
    paid: 'Paid',
    debt: 'Debt',
    total: 'Total',
    currency: 'Currency',
    
    // Shifts
    openShift: 'Open Shift',
    closeShift: 'Close Shift',
    shiftBalance: 'Shift Balance',
    
    // Validation
    requiredField: 'Required field',
    invalidPhone: 'Invalid phone format',
    invalidDate: 'Invalid date',
  }
};

// Default language
export const defaultLanguage = 'ru';

// Helper function to get translation
export const t = (key, lang = defaultLanguage) => {
  return translations[lang]?.[key] || key;
};
