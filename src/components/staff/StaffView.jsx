import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const StaffView = ({ staff = [], onAddStaff, onEditStaff, onChangePassword }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Персонал</h2>
        <Button onClick={onAddStaff}>+ Добавить сотрудника</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => (
          <Card key={member.id}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{member.name}</h3>
                  <p className="text-sm text-slate-600">{member.role === 'admin' ? 'Администратор' : 'Кассир'}</p>
                </div>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <p>📱 {member.phone || 'Не указан'}</p>
                <p>🏠 {member.hostelId === 'all' ? 'Все хостелы' : `Хостел ${member.hostelId === 'hostel1' ? '№1' : '№2'}`}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="secondary" onClick={() => onEditStaff(member)} className="flex-1">Редактировать</Button>
                <Button size="sm" variant="outline" onClick={() => onChangePassword(member)}>🔑</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {staff.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-6xl mb-4">👔</p>
          <p>Список персонала пуст</p>
        </div>
      )}
    </div>
  );
};

export default StaffView;
