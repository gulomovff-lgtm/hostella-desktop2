import React from 'react';
import { getRoomStatusClass, getRoomStatusLabel } from '../../utils/helpers';

/**
 * Room Card component with chess-like grid display
 * @param {Object} props - RoomCardChess properties
 * @param {Object} props.room - Room data object
 * @param {function} props.onClick - Click handler
 */
const RoomCardChess = ({ room, onClick }) => {
  const {
    number,
    status = 'available',
    beds = 1,
    price = 0,
    guests = [],
    hostelId,
  } = room;
  
  const statusClass = getRoomStatusClass(status);
  const statusLabel = getRoomStatusLabel(status);
  
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer
        transition-all duration-200 hover:shadow-lg
        ${statusClass}
      `}
    >
      {/* Room Number */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold">№{number}</span>
        <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/50">
          {statusLabel}
        </span>
      </div>
      
      {/* Room Info */}
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span>🛏️</span>
          <span>{beds} {beds === 1 ? 'место' : 'мест'}</span>
        </div>
        
        {status === 'occupied' && guests.length > 0 && (
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span className="truncate">{guests[0].name}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 font-bold">
          <span>💰</span>
          <span>{price.toLocaleString()} сум</span>
        </div>
      </div>
      
      {/* Hostel Badge */}
      {hostelId && (
        <div className="absolute top-2 right-2 text-xs opacity-50">
          {hostelId === 'hostel1' ? 'Х1' : 'Х2'}
        </div>
      )}
    </div>
  );
};

export default RoomCardChess;
