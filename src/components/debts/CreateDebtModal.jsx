import React, { useState } from 'react';
import Button from '../ui/Button';
import { inputClass, labelClass } from '../../config/constants';
import { getCurrentDate } from '../../utils/helpers';

const CreateDebtModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    amount: 0,
    description: '',
    date: getCurrentDate(),
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
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Добавить долг</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Клиент *</label>
            <input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Сумма (сум) *</label>
            <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})} className={inputClass} min="0" required />
          </div>
          <div>
            <label className={labelClass}>Описание</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={inputClass} rows="3" />
          </div>
          <div>
            <label className={labelClass}>Дата</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className={inputClass} required />
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

export default CreateDebtModal;
