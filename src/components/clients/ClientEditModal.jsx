import React, { useState } from 'react';
import Button from '../ui/Button';
import { inputClass, labelClass, COUNTRIES } from '../../config/constants';

const ClientEditModal = ({ client = null, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    country: client?.country || 'Узбекистан',
    email: client?.email || '',
    notes: client?.notes || '',
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {client ? 'Редактировать клиента' : 'Добавить клиента'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Имя *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Телефон *</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Страна</label>
            <select value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className={inputClass}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Примечания</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className={inputClass} rows="3" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Отмена</Button>
            <Button type="submit" variant="primary" className="flex-1">Сохранить</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientEditModal;
