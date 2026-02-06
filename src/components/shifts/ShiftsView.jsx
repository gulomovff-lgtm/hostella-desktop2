import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

const ShiftsView = ({ currentShift, shifts = [], onOpenShift, onCloseShift }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Смены</h2>
        {!currentShift && <Button onClick={onOpenShift}>Открыть смену</Button>}
        {currentShift && <Button variant="danger" onClick={onCloseShift}>Закрыть смену</Button>}
      </div>
      
      {currentShift && (
        <Card title="Текущая смена">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-slate-500 text-sm">Начало</p><p className="font-bold">{formatDateTime(currentShift.startTime)}</p></div>
            <div><p className="text-slate-500 text-sm">Сотрудник</p><p className="font-bold">{currentShift.employeeName}</p></div>
            <div><p className="text-slate-500 text-sm">Начальный баланс</p><p className="font-bold text-green-600">{formatCurrency(currentShift.startBalance)}</p></div>
            <div><p className="text-slate-500 text-sm">Текущий баланс</p><p className="font-bold text-blue-600">{formatCurrency(currentShift.currentBalance)}</p></div>
          </div>
        </Card>
      )}
      
      <Card title="История смен">
        <div className="space-y-3">
          {shifts.map(shift => (
            <div key={shift.id} className="bg-slate-50 p-4 rounded-xl">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><p className="text-slate-500">Сотрудник</p><p className="font-semibold">{shift.employeeName}</p></div>
                <div><p className="text-slate-500">Время</p><p className="font-semibold">{formatDateTime(shift.startTime)}</p></div>
                <div><p className="text-slate-500">Баланс</p><p className="font-semibold text-green-600">{formatCurrency(shift.finalBalance)}</p></div>
              </div>
            </div>
          ))}
          {shifts.length === 0 && <p className="text-slate-400 text-center py-4">История пуста</p>}
        </div>
      </Card>
    </div>
  );
};

export default ShiftsView;
