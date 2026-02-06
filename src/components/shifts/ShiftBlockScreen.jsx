import React from 'react';
import Button from '../ui/Button';

const ShiftBlockScreen = ({ onOpenShift }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <p className="text-6xl mb-6">🔒</p>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Смена не открыта</h2>
        <p className="text-slate-600 mb-8">Откройте смену, чтобы начать работу</p>
        <Button onClick={onOpenShift} size="lg" className="w-full">Открыть смену</Button>
      </div>
    </div>
  );
};

export default ShiftBlockScreen;
