import React from 'react';

/**
 * Navigation item component
 * @param {Object} props - NavItem properties
 * @param {string} props.label - Navigation label
 * @param {string} props.icon - Icon or emoji
 * @param {boolean} props.active - Active state
 * @param {function} props.onClick - Click handler
 * @param {number} props.badge - Badge count (optional)
 */
const NavItem = ({ 
  label, 
  icon, 
  active = false, 
  onClick,
  badge = 0,
}) => {
  const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer';
  const activeClasses = active 
    ? 'bg-indigo-600 text-white shadow-md' 
    : 'text-slate-700 hover:bg-slate-100';
  
  return (
    <div 
      className={`${baseClasses} ${activeClasses}`}
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
          active ? 'bg-white text-indigo-600' : 'bg-red-500 text-white'
        }`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </div>
  );
};

export default NavItem;
