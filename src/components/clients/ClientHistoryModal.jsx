import React from 'react';
import Button from '../ui/Button';
import { formatDateDisplay } from '../../utils/dateHelpers';
import { formatCurrency } from '../../utils/calculations';

const ClientHistoryModal = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;
  
  const history = client.history || [];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-800">История визитов: {client.name}</h2>
        </div>
        <div className="p-6">
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((visit, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-slate-500">Комната:</span> <span className="font-semibold">№{visit.roomNumber}</span></div>
                    <div><span className="text-slate-500">Стоимость:</span> <span className="font-semibold">{formatCurrency(visit.totalPrice)}</span></div>
                    <div><span className="text-slate-500">Заселение:</span> <span className="font-semibold">{formatDateDisplay(visit.checkIn)}</span></div>
                    <div><span className="text-slate-500">Выселение:</span> <span className="font-semibold">{formatDateDisplay(visit.checkOut)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-6xl mb-4">📋</p>
              <p>История визитов пуста</p>
            </div>
          )}
          <div className="mt-6">
            <Button onClick={onClose} className="w-full">Закрыть</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHistoryModal;
