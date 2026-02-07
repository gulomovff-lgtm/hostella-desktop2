import React, { useState } from 'react';
import Button from '../ui/Button';
import { inputClass, labelClass } from '../../constants/config';
import { formatCurrency } from '../../utils/helpers';

const ShiftClosingModal = ({ shift, isOpen, onClose, onConfirm }) => {
  const [finalBalance, setFinalBalance] = useState(shift?.currentBalance || 0);
  const [notes, setNotes] = useState('');
  
  if (!isOpen || !shift) return null;
  
  const difference = finalBalance - (shift.startBalance || 0);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Закрытие смены</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between"><span className="text-slate-500">Начальный баланс:</span><span className="font-bold">{formatCurrency(shift.startBalance)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Конечный баланс:</span><span className="font-bold">{formatCurrency(finalBalance)}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="text-slate-500">Разница:</span><span className={`font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(difference)}</span></div>
          </div>
          <div>
            <label className={labelClass}>Конечный баланс (сум)</label>
            <input type="number" value={finalBalance} onChange={(e) => setFinalBalance(parseInt(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Примечания</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} rows="3" />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">Отмена</Button>
            <Button variant="danger" onClick={() => onConfirm({ finalBalance, notes })} className="flex-1">Закрыть смену</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftClosingModal;
