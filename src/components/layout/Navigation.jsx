import React from 'react';
import NavItem from '../ui/NavItem';

/**
 * Main Navigation component for desktop
 * @param {Object} props - Navigation properties
 * @param {string} props.currentTab - Currently active tab
 * @param {function} props.onTabChange - Tab change handler
 * @param {Object} props.user - Current user object
 * @param {function} props.onLogout - Logout handler
 * @param {string} props.viewHostel - Current hostel view (for Fazliddin)
 * @param {function} props.onHostelChange - Hostel change handler (for Fazliddin)
 */
const Navigation = ({ 
  currentTab, 
  onTabChange, 
  user,
  onLogout,
  viewHostel,
  onHostelChange,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: '📊' },
    { id: 'rooms', label: 'Комнаты', icon: '🏠' },
    { id: 'calendar', label: 'Календарь', icon: '📅' },
    { id: 'guests', label: 'Гости', icon: '👥' },
    { id: 'clients', label: 'Клиенты', icon: '📋' },
    { id: 'debts', label: 'Долги', icon: '💰' },
    { id: 'reports', label: 'Отчеты', icon: '📈' },
    { id: 'tasks', label: 'Задачи', icon: '✓' },
    { id: 'shifts', label: 'Смены', icon: '⏰' },
    { id: 'expenses', label: 'Расходы', icon: '💸' },
    { id: 'staff', label: 'Персонал', icon: '👔' },
  ];
  
  // Filter items based on user role if needed
  const filteredItems = user?.role === 'admin' 
    ? navItems 
    : navItems.filter(item => !['staff', 'expenses'].includes(item.id));
  
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-indigo-600">Hostella</h1>
        {user && (
          <p className="text-sm text-slate-600 mt-2">{user.name}</p>
        )}
        
        {/* Hostel Switcher for Fazliddin */}
        {user?.login === 'fazliddin' && onHostelChange && (
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => onHostelChange('hostel1')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                viewHostel === 'hostel1'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Хостел №1 (Просмотр)
            </button>
            <button
              onClick={() => onHostelChange('hostel2')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                viewHostel === 'hostel2'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Хостел №2 (Работа)
            </button>
          </div>
        )}
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredItems.map(item => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            active={currentTab === item.id}
            onClick={() => onTabChange(item.id)}
            badge={item.badge}
          />
        ))}
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <span className="text-xl">🚪</span>
          <span>Выход</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
