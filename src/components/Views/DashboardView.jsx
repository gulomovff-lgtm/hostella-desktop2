import React from 'react';
import DashboardStats from '../dashboard/DashboardStats';
import ChartsSection from '../dashboard/ChartsSection';

/**
 * Dashboard View Component
 * Combines statistics and charts sections for the main dashboard
 */
const DashboardView = ({ stats, revenueData, occupancyData }) => {
  return (
    <>
      <DashboardStats stats={stats} />
      <ChartsSection revenueData={revenueData} occupancyData={occupancyData} />
    </>
  );
};

export { DashboardView };
export default DashboardView;
