// src/app/dashboard/sales/components/ServiceTypeIndicator.tsx
"use client";
import React from "react";
import { ServiceTypeIndicatorProps } from "@/utils/types";

const ServiceTypeIndicator: React.FC<ServiceTypeIndicatorProps> = ({ color, label, value }) => (
  <li className="d-flex align-items-center gap-2">
    <span className={`w-12-px h-12-px rounded-circle ${color}`} />
    <span className="text-secondary-light fw-semibold">
      {label}: <span className="text-primary-light fw-bold ms-1">{value}</span>
    </span>
  </li>
);

export default ServiceTypeIndicator;
