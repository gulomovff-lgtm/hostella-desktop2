import React from 'react';
import Card from '../ui/Card';

/**
 * Charts Section component for dashboard
 * @param {Object} props - ChartsSection properties
 * @param {Array} props.revenueData - Revenue data for charts
 * @param {Array} props.occupancyData - Occupancy data for charts
 */
const ChartsSection = ({ revenueData = [], occupancyData = [] }) => {
  // This is a placeholder for actual chart implementation
  // In a real application, you would use a library like recharts, chart.js, etc.
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Revenue Chart */}
      <Card title="Доход за последние 30 дней">
        <div className="h-64 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <p className="text-6xl mb-4">📈</p>
            <p>График дохода</p>
            <p className="text-sm mt-2">
              {revenueData.length > 0 
                ? `${revenueData.length} точек данных` 
                : 'Нет данных для отображения'}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Occupancy Chart */}
      <Card title="Загруженность за последние 30 дней">
        <div className="h-64 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <p className="text-6xl mb-4">📊</p>
            <p>График загруженности</p>
            <p className="text-sm mt-2">
              {occupancyData.length > 0 
                ? `${occupancyData.length} точек данных` 
                : 'Нет данных для отображения'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChartsSection;
