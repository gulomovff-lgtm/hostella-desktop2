import React, { useState } from 'react';
import Button from '../ui/Button';
import { inputClass, labelClass } from '../../constants/config';

const ChangePasswordModal = ({ staff, isOpen, onClose, onSave }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 3) {
      setError('Пароль должен содержать минимум 3 символа');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    onSave(staff.id, password);
    onClose();
    setPassword('');
    setConfirmPassword('');
  };
  
  if (!isOpen || !staff) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Изменить пароль</h2>
          <p className="text-sm text-slate-600 mt-1">Сотрудник: {staff.name}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Новый пароль *</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Подтвердите пароль *</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required />
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Отмена</Button>
            <Button type="submit" variant="primary" className="flex-1">Сохранить</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
