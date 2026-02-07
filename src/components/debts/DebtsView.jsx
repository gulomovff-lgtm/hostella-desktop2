import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/calculations';
import { formatDateDisplay } from '../../utils/dateHelpers';

const DebtsView = ({ debts = [], onCreateDebt, onPayDebt }) => {
  const totalDebt = debts.reduce((sum, d) => sum + (d.amount || 0), 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Долги</h2>
        <Button onClick={onCreateDebt}>+ Добавить долг</Button>
      </div>
      
      <Card>
        <div className="text-center">
          <p className="text-sm text-slate-500 mb-2">Общая сумма долгов</p>
          <p className="text-4xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
        </div>
      </Card>
      
      <div className="space-y-4">
        {debts.map(debt => (
          <Card key={debt.id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{debt.clientName}</h3>
                <p className="text-sm text-slate-600 mt-1">{debt.description}</p>
                <p className="text-xs text-slate-500 mt-2">{formatDateDisplay(debt.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{formatCurrency(debt.amount)}</p>
                <Button size="sm" variant="success" onClick={() => onPayDebt(debt)} className="mt-2">
                  Оплатить
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {debts.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-6xl mb-4">💰</p>
          <p>Долгов нет</p>
        </div>
      )}
    </div>
  );
};

export default DebtsView;
