// src/app/dashboard/sales/components/ServicesTable.tsx
"use client";
import React, { useMemo } from "react";
import { ServiceData, ServicesTableProps } from "@/utils/types"; // Ensure ServiceData is defined


const ServicesTable: React.FC<ServicesTableProps> = ({ data, totalRevenue }) => {
  const totalBookings = useMemo(
    () => data.reduce((total, service) => total + service.bookingsCount, 0),
    [data]
  );

  return (
    <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
      <table className="table bordered-table sm-table mb-0 table-hover">
        <thead className="sticky-top">
          <tr>
            <th scope="col">Service Name</th>
            <th scope="col">Category</th>
            <th scope="col" className="text-end">Revenue</th>
            <th scope="col" className="text-end">Total Books</th>
            <th scope="col" className="text-end">% of Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((service, index) => (
            <tr key={index}>
              <td>
                <span className="fw-semibold">{service.name}</span>
              </td>
              <td>
                <span className={`badge ${
                  service.category === "DENTIST"
                    ? "bg-primary-100 text-primary-800"
                    : "bg-warning-100 text-warning-800"
                }`}>
                  {service.category}
                </span>
              </td>
              <td className="text-end">﷼{service.amount.toLocaleString()}</td>
              <td className="text-end">{service.bookingsCount}</td>
              <td className="text-end">
                {totalRevenue ? Math.round((service.amount / totalRevenue) * 100) : 0}%
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="sticky-bottom">
          <tr>
            <td colSpan={2} className="fw-bold">Total</td>
            <td className="text-end fw-bold">﷼{totalRevenue.toLocaleString()}</td>
            <td className="text-end fw-bold">{totalBookings}</td>
            <td className="text-end fw-bold">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ServicesTable;
