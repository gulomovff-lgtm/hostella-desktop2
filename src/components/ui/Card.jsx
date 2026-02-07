import React from 'react';

/**
 * Reusable Card component
 * @param {Object} props - Card properties
 * @param {string} props.title - Card title
 * @param {string} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler (makes card clickable)
 * @param {boolean} props.hoverable - Add hover effect
 */
const Card = ({ 
  title, 
  children, 
  className = '', 
  onClick,
  hoverable = false,
  ...rest 
}) => {
  const baseClasses = 'bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden';
  const hoverClasses = hoverable || onClick ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick} {...rest}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
