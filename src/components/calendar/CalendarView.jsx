import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { formatDateDisplay, getTotalPaid } from '../../utils/helpers';

/**
 * Calendar View component - Horizontal timeline view with room rows and guest blocks
 * @param {Object} props - CalendarView properties
 * @param {Array} props.bookings - Array of booking/reservation objects (guests)
 * @param {Array} props.rooms - Array of room objects
 * @param {function} props.onGuestClick - Guest click handler
 */
const CalendarView = ({ bookings = [], rooms = [], onGuestClick }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewDays, setViewDays] = React.useState(14); // Show 14 days by default
  
  // Generate calendar days array
  const days = useMemo(() => {
    const result = [];
    const startDate = new Date(currentDate);
    startDate.setHours(12, 0, 0, 0);
    
    for (let i = 0; i < viewDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      result.push({
        date: new Date(date),
        str: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      });
    }
    return result;
  }, [currentDate, viewDays]);
  
  const prevPeriod = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - viewDays);
    setCurrentDate(newDate);
  };
  
  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + viewDays);
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Calculate guest block position and width
  const getGuestBlockStyle = (guest) => {
    const checkIn = new Date(guest.checkInDate || guest.checkInDateTime || guest.checkIn);
    checkIn.setHours(12, 0, 0, 0);
    
    const checkOut = new Date(guest.checkOutDate);
    checkOut.setHours(12, 0, 0, 0);
    
    // For checked_out guests, DON'T extend to current date
    const calendarStart = new Date(days[0].str);
    calendarStart.setHours(12, 0, 0, 0);
    const calendarEnd = new Date(days[days.length - 1].str);
    calendarEnd.setHours(12, 0, 0, 0);
    
    // Check if guest is visible in current calendar range
    if (checkOut < calendarStart || checkIn > calendarEnd) return null;
    
    // Calculate position and width
    const msPerDay = 1000 * 60 * 60 * 24;
    const totalCalendarMs = msPerDay * viewDays;
    
    let startTimeDiff = checkIn.getTime() - calendarStart.getTime();
    let durationMs = checkOut.getTime() - checkIn.getTime();
    
    // Adjust if starts before calendar
    if (startTimeDiff < 0) {
      durationMs += startTimeDiff;
      startTimeDiff = 0;
    }
    
    const leftPercent = (startTimeDiff / totalCalendarMs) * 100;
    const widthPercent = (durationMs / totalCalendarMs) * 100;
    
    return { 
      leftPercent, 
      widthPercent: Math.min(widthPercent, 100 - leftPercent)
    };
  };
  
  // Guest Block Component with payment gradient
  const GuestBlock = ({ guest }) => {
    const style = getGuestBlockStyle(guest);
    if (!style) return null;
    
    const totalPaid = getTotalPaid(guest);
    const totalPrice = parseFloat(guest.totalPrice) || 0;
    const pricePerNight = parseFloat(guest.pricePerNight) || 0;
    
    // Skip payment visualization if price data is invalid or too small
    if (pricePerNight < 1 || totalPrice === 0) {
      return (
        <div
          className="absolute h-8 cursor-pointer rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-slate-400"
          style={{
            left: `${style.leftPercent}%`,
            width: `${style.widthPercent}%`,
            top: '4px',
          }}
          onClick={() => onGuestClick?.(guest)}
        >
          <div className="absolute inset-0 flex items-center px-2 z-10">
            <span className="font-bold text-xs text-white bg-black px-2 py-1 rounded truncate">
              {guest.fullName || guest.name}
            </span>
          </div>
        </div>
      );
    }
    
    // Calculate paid and debt days (ensure totalDays is always >= 1)
    const paidDays = Math.floor(totalPaid / pricePerNight);
    const totalDays = Math.max(parseInt(guest.days) || 1, 1);
    const debtDays = Math.max(0, totalDays - paidDays);
    
    const paidPercent = (paidDays / totalDays) * 100;
    const debtPercent = (debtDays / totalDays) * 100;
    
    return (
      <div
        className="absolute h-8 cursor-pointer rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        style={{
          left: `${style.leftPercent}%`,
          width: `${style.widthPercent}%`,
          top: '4px',
        }}
        onClick={() => onGuestClick?.(guest)}
      >
        {/* Payment gradient visualization */}
        <div className="absolute inset-0 flex">
          {/* Paid portion - green */}
          {paidDays > 0 && (
            <div 
              style={{ width: `${paidPercent}%` }}
              className="bg-emerald-500 border-r-2 border-emerald-700"
            />
          )}
          
          {/* Debt portion - red */}
          {debtDays > 0 && (
            <div 
              style={{ width: `${debtPercent}%` }}
              className="bg-rose-500"
            />
          )}
        </div>
        
        {/* Guest name overlay with high contrast for accessibility */}
        <div className="absolute inset-0 flex items-center px-2 z-10">
          <span className="font-bold text-xs text-white bg-black px-2 py-1 rounded truncate">
            {guest.fullName || guest.name}
          </span>
        </div>
      </div>
    );
  };
  
  // Get guests for a specific room
  const getGuestsForRoom = (roomId) => {
    return bookings.filter(b => b.roomId === roomId || b.room?.id === roomId);
  };
  
  return (
    <Card>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={prevPeriod}
            className="px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors font-bold"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors text-sm font-semibold"
          >
            Сегодня
          </button>
          <button
            onClick={nextPeriod}
            className="px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors font-bold"
          >
            →
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800">
          {formatDateDisplay(days[0].date)} - {formatDateDisplay(days[days.length - 1].date)}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Дней:</span>
          {[7, 14, 30].map(count => (
            <button
              key={count}
              onClick={() => setViewDays(count)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewDays === count
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
      
      {/* Day Headers */}
      <div className="flex border-b border-slate-200 pb-2 mb-4">
        <div className="w-32 flex-shrink-0 font-bold text-slate-600 text-sm">
          Комната
        </div>
        <div className="flex-1 flex">
          {days.map((day, idx) => {
            const isToday = new Date().toDateString() === day.date.toDateString();
            return (
              <div
                key={idx}
                className={`flex-1 text-center text-xs ${
                  isToday ? 'bg-indigo-100 text-indigo-700 font-bold rounded-t' : 'text-slate-600'
                }`}
              >
                <div>{day.day}</div>
                <div className="text-xs opacity-75">
                  {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][day.date.getDay()]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Room Rows with Guest Blocks */}
      <div className="space-y-2">
        {rooms.length > 0 ? (
          rooms.map(room => {
            const roomGuests = getGuestsForRoom(room.id);
            return (
              <div key={room.id} className="flex border-b border-slate-100 pb-2">
                <div className="w-32 flex-shrink-0 font-semibold text-slate-700 text-sm py-2">
                  №{room.number}
                </div>
                <div className="flex-1 relative min-h-[40px]">
                  {/* Day grid background */}
                  <div className="absolute inset-0 flex">
                    {days.map((day, idx) => {
                      const isToday = new Date().toDateString() === day.date.toDateString();
                      return (
                        <div
                          key={idx}
                          className={`flex-1 border-r border-slate-100 ${
                            isToday ? 'bg-indigo-50/50' : ''
                          }`}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Guest blocks */}
                  {roomGuests.map(guest => (
                    <GuestBlock key={guest.id} guest={guest} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p className="text-6xl mb-4">📅</p>
            <p>Комнаты не найдены</p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded"></div>
          <span className="text-slate-600">Оплачено</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-rose-500 rounded"></div>
          <span className="text-slate-600">Долг</span>
        </div>
      </div>
    </Card>
  );
};

export default CalendarView;
