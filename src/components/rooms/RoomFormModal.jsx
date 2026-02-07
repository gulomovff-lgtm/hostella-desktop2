import React, { useState } from 'react';
import Button from '../ui/Button';
import { inputClass, labelClass } from '../../constants/config';

/**
 * Room Form Modal component
 * @param {Object} props - RoomFormModal properties
 * @param {Object} props.room - Room data (for editing)
 * @param {boolean} props.isOpen - Modal open state
 * @param {function} props.onClose - Close handler
 * @param {function} props.onSave - Save handler
 */
const RoomFormModal = ({ room = null, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    number: room?.number || '',
    beds: room?.beds || 1,
    price: room?.price || 0,
    status: room?.status || 'available',
    hostelId: room?.hostelId || 'hostel1',
  });
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-800">
            {room ? 'Редактировать комнату' : 'Добавить комнату'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Номер комнаты</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleChange('number', e.target.value)}
              className={inputClass}
              placeholder="101"
              required
            />
          </div>
          
          <div>
            <label className={labelClass}>Количество мест</label>
            <input
              type="number"
              value={formData.beds}
              onChange={(e) => handleChange('beds', parseInt(e.target.value))}
              className={inputClass}
              min="1"
              max="10"
              required
            />
          </div>
          
          <div>
            <label className={labelClass}>Цена за ночь (сум)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', parseInt(e.target.value))}
              className={inputClass}
              min="0"
              step="1000"
              required
            />
          </div>
          
          <div>
            <label className={labelClass}>Статус</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={inputClass}
              required
            >
              <option value="available">Свободна</option>
              <option value="occupied">Занята</option>
              <option value="cleaning">Уборка</option>
              <option value="maintenance">Ремонт</option>
            </select>
          </div>
          
          <div>
            <label className={labelClass}>Хостел</label>
            <select
              value={formData.hostelId}
              onChange={(e) => handleChange('hostelId', e.target.value)}
              className={inputClass}
              required
            >
              <option value="hostel1">Хостел №1</option>
              <option value="hostel2">Хостел №2</option>
            </select>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomFormModal;
