import React, { useState } from 'react';
import Button from '../ui/Button';
import { inputClass, labelClass, COUNTRIES } from '../../config/constants';
import { getCurrentDate, getDateWithOffset } from '../../utils/helpers';

/**
 * Check-in Modal component
 * @param {Object} props - CheckInModal properties
 * @param {boolean} props.isOpen - Modal open state
 * @param {function} props.onClose - Close handler
 * @param {function} props.onCheckIn - Check-in handler
 * @param {Array} props.availableRooms - List of available rooms
 */
const CheckInModal = ({ isOpen, onClose, onCheckIn, availableRooms = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: 'Узбекистан',
    passportNumber: '',
    roomId: '',
    checkInDate: getCurrentDate(),
    checkOutDate: getDateWithOffset(1),
    pricePerNight: 0,
    prepayment: 0,
    notes: '',
  });
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onCheckIn(formData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-800">Заселение гостя</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">
            ×
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Имя гостя *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={inputClass}
                required
              />
            </div>
            
            <div>
              <label className={labelClass}>Телефон *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={inputClass}
                required
              />
            </div>
            
            <div>
              <label className={labelClass}>Страна</label>
              <select
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className={inputClass}
              >
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={labelClass}>Номер паспорта</label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => handleChange('passportNumber', e.target.value)}
                className={inputClass}
              />
            </div>
            
            <div>
              <label className={labelClass}>Комната *</label>
              <select
                value={formData.roomId}
                onChange={(e) => handleChange('roomId', e.target.value)}
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
            
            <div>
              <label className={labelClass}>Цена за ночь (сум) *</label>
              <input
                type="number"
                value={formData.pricePerNight}
                onChange={(e) => handleChange('pricePerNight', parseInt(e.target.value))}
                className={inputClass}
                min="0"
                step="1000"
                required
              />
            </div>
            
            <div>
              <label className={labelClass}>Дата заселения *</label>
              <input
                type="date"
                value={formData.checkInDate}
                onChange={(e) => handleChange('checkInDate', e.target.value)}
                className={inputClass}
                required
              />
            </div>
            
            <div>
              <label className={labelClass}>Дата выселения *</label>
              <input
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => handleChange('checkOutDate', e.target.value)}
                className={inputClass}
                required
              />
            </div>
            
            <div>
              <label className={labelClass}>Предоплата (сум)</label>
              <input
                type="number"
                value={formData.prepayment}
                onChange={(e) => handleChange('prepayment', parseInt(e.target.value))}
                className={inputClass}
                min="0"
                step="1000"
              />
            </div>
          </div>
          
          <div>
            <label className={labelClass}>Примечания</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className={inputClass}
              rows="3"
            />
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Заселить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInModal;
