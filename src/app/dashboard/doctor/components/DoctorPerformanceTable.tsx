
"use client";

import React from 'react';
import { DoctorStats } from '@/utils/types';
import { DoctorPerformanceTableProps } from '@/utils/types';


const DoctorPerformanceTable: React.FC<DoctorPerformanceTableProps> = ({ doctorStats }) => {
  return (
    <div className="table-responsive scroll-sm">
      <table className="table bordered-table sm-table mb-0">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Doctor</th>
            <th scope="col">Total Appointments</th>
            <th scope="col">Completed</th>
            <th scope="col">Canceled</th>
            <th scope="col">Total Income</th>
            <th scope="col">Conversion Rate</th>
          </tr>
        </thead>
        <tbody>
          {doctorStats.length > 0 ? (
            doctorStats.map(doctor => (
              <tr key={doctor.doctorId}>
                <td>
                  <div className="d-flex align-items-center">
                    <img 
                      src={doctor.photoUrl} 
                      alt={doctor.doctorName} 
                      className="rounded-circle me-2" 
                      width="40" 
                      height="40"
                    />
                  </div>
                </td>
                <td>{doctor.doctorName}</td>
                <td>{doctor.totalAppointments}</td>
                <td>{doctor.completedAppointments}</td>
                <td>{doctor.canceledAppointments}</td>
                <td>${doctor.totalIncome.toLocaleString()}</td>
                <td>
                  {doctor.totalAppointments > 0 
                    ? `${Math.round((doctor.completedAppointments / doctor.totalAppointments) * 100)}%`
                    : '0%'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-2">
                No doctor statistics available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorPerformanceTable;
