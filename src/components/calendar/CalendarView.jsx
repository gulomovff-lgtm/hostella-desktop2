import React from 'react';
import Card from '../ui/Card';
import { formatDateDisplay } from '../../utils/dateHelpers';

/**
 * Calendar View component
 * @param {Object} props - CalendarView properties
 * @param {Array} props.bookings - Array of booking/reservation objects
 * @param {function} props.onDateClick - Date click handler
 */
const CalendarView = ({ bookings = [], onDateClick }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };
  
  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  const getBookingsForDay = (day) => {
    const dateStr = formatDateDisplay(new Date(year, month, day));
    return bookings.filter(b => {
      const checkIn = formatDateDisplay(b.checkInDate);
      const checkOut = formatDateDisplay(b.checkOutDate);
      return checkIn === dateStr || checkOut === dateStr;
    });
  };
  
  return (
    <Card>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          ←
        </button>
        <h3 className="text-xl font-bold text-slate-800">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          →
        </button>
      </div>
      
      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-bold text-slate-600 text-sm">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayBookings = day ? getBookingsForDay(day) : [];
          const isToday = day && 
            new Date().getDate() === day && 
            new Date().getMonth() === month && 
            new Date().getFullYear() === year;
          
          return (
            <div
              key={index}
              onClick={() => day && onDateClick?.(new Date(year, month, day))}
              className={`
                aspect-square p-2 rounded-lg border transition-all cursor-pointer
                ${!day ? 'invisible' : ''}
                ${isToday ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}
                ${dayBookings.length > 0 ? 'bg-green-50' : ''}
              `}
            >
              {day && (
                <div className="flex flex-col h-full">
                  <span className="font-medium text-sm">{day}</span>
                  {dayBookings.length > 0 && (
                    <span className="text-xs text-green-600 mt-auto">
                      {dayBookings.length} 🏠
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarView;
