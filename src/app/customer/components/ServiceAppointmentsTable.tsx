// src/app/dashboard/customer/components/ServiceAppointmentsTable.tsx
"use client";
import React from "react";
import { AppointmentsTableProps } from "@/utils/types";
import StatusBadge from "./StatusBadge";

const ServiceAppointmentsTable: React.FC<AppointmentsTableProps> = ({ appointments }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table bordered-table sm-table mb-0">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Service</th>
            <th>Branch</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments?.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{`${appointment.start_time} - ${appointment.end_time}`}</td>
                <td>{appointment.name_en}</td>
                <td>{appointment.branch_name_en}</td>
                <td>
                  <StatusBadge status={appointment.status} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-2">
                No service appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceAppointmentsTable;
