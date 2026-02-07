import React from 'react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/calculations';

/**
 * Dashboard Statistics component
 * @param {Object} props - DashboardStats properties
 * @param {Object} props.stats - Statistics data object
 */
const DashboardStats = ({ stats = {} }) => {
  const {
    totalRooms = 0,
    occupiedRooms = 0,
    availableRooms = 0,
    totalGuests = 0,
    todayCheckIns = 0,
    todayCheckOuts = 0,
    totalRevenue = 0,
    pendingDebts = 0,
  } = stats;
  
  const occupancyRate = totalRooms > 0 
    ? Math.round((occupiedRooms / totalRooms) * 100) 
    : 0;
  
  const statCards = [
    {
      title: 'Всего комнат',
      value: totalRooms,
      icon: '🏠',
      color: 'bg-blue-500',
      subtitle: `Занято: ${occupiedRooms} | Свободно: ${availableRooms}`,
    },
    {
      title: 'Загруженность',
      value: `${occupancyRate}%`,
      icon: '📊',
      color: 'bg-purple-500',
      subtitle: `${occupiedRooms} из ${totalRooms} комнат`,
    },
    {
      title: 'Всего гостей',
      value: totalGuests,
      icon: '👥',
      color: 'bg-green-500',
      subtitle: `Заселений сегодня: ${todayCheckIns}`,
    },
    {
      title: 'Выселений сегодня',
      value: todayCheckOuts,
      icon: '🚪',
      color: 'bg-orange-500',
      subtitle: 'До конца дня',
    },
    {
      title: 'Общий доход',
      value: formatCurrency(totalRevenue),
      icon: '💰',
      color: 'bg-emerald-500',
      subtitle: 'За текущий месяц',
    },
    {
      title: 'Ожидающие долги',
      value: formatCurrency(pendingDebts),
      icon: '⚠️',
      color: 'bg-red-500',
      subtitle: 'Требует внимания',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 mb-1">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-slate-900 mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-slate-600">
                {stat.subtitle}
              </p>
            </div>
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
          </div>
          {/* Decorative gradient */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color}`}></div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
