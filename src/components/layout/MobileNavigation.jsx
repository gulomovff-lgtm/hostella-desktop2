import React from 'react';

/**
 * Mobile Navigation component
 * @param {Object} props - Navigation properties
 * @param {string} props.currentTab - Currently active tab
 * @param {function} props.onTabChange - Tab change handler
 * @param {Object} props.user - Current user object
 */
const MobileNavigation = ({ 
  currentTab, 
  onTabChange, 
  user,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: '📊' },
    { id: 'rooms', label: 'Комнаты', icon: '🏠' },
    { id: 'calendar', label: 'Календарь', icon: '📅' },
    { id: 'guests', label: 'Гости', icon: '👥' },
    { id: 'clients', label: 'Клиенты', icon: '📋' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentTab === item.id 
                ? 'text-indigo-600 bg-indigo-50' 
                : 'text-slate-600'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
