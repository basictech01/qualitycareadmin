
"use client";
import React from 'react';
import { OverallStatsProps } from '@/utils/types';




const OverallStatsCards: React.FC<OverallStatsProps> = ({
  totalAppointments,
  totalIncome,
  completedIncome,
  cancelationRate,
}) => {
  return (
    <div className="row g-3 mb-4">
      <div className="col-md-3">
        <div className="card bg-primary-50">
          <div className="card-body">
            <h6 className="text-primary-600">Total Appointments</h6>
            <h3>{totalAppointments}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-success-50">
          <div className="card-body">
            <h6 className="text-success-600">Total Income</h6>
            <h3>${totalIncome.toLocaleString()}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-warning-50">
          <div className="card-body">
            <h6 className="text-warning-600">Cancellation Rate</h6>
            <h3>{cancelationRate}%</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-info-50">
          <div className="card-body">
            <h6 className="text-info-600">Completed Income</h6>
            <h3>${completedIncome.toLocaleString()}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallStatsCards;
