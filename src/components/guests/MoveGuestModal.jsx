import React, { useState } from 'react';
import Button from '../ui/Button';
import { inputClass, labelClass } from '../../constants/config';

/**
 * Move Guest Modal component
 * @param {Object} props - MoveGuestModal properties
 * @param {Object} props.guest - Guest to move
 * @param {boolean} props.isOpen - Modal open state
 * @param {function} props.onClose - Close handler
 * @param {function} props.onMove - Move handler
 * @param {Array} props.availableRooms - List of available rooms
 */
const MoveGuestModal = ({ guest, isOpen, onClose, onMove, availableRooms = [] }) => {
  const [newRoomId, setNewRoomId] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRoomId) {
      onMove(guest.id, newRoomId);
      onClose();
    }
  };
  
  if (!isOpen || !guest) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Переселение гостя</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">
            ×
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl mb-4">
            <p className="text-sm text-slate-600 mb-1">Гость</p>
            <p className="font-bold text-slate-800">{guest.name}</p>
            <p className="text-sm text-slate-600 mt-2">Текущая комната</p>
            <p className="font-bold text-slate-800">№{guest.room?.number}</p>
          </div>
          
          <div>
            <label className={labelClass}>Новая комната *</label>
            <select
              value={newRoomId}
              onChange={(e) => setNewRoomId(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Выберите комнату</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.id}>
                  Комната №{room.number} - {room.beds} мест
                </option>
              ))}
            </select>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Переселить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveGuestModal;
