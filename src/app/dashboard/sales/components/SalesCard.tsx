// src/app/dashboard/sales/components/SalesCard.tsx
"use client";
import React from "react";
import { SalesCardProps } from "@/utils/types";


const SalesCard: React.FC<SalesCardProps> = ({ title, value, description, bgColor, textColor }) => (
  <div className="col-md-3">
    <div className={`card ${bgColor} border-0 h-100`}>
      <div className="card-body">
        <h6 className={`${textColor} mb-2`}>{title}</h6>
        <h3 className="fw-bold mb-0">{value}</h3>
        <small className="text-muted">{description}</small>
      </div>
    </div>
  </div>
);

export default SalesCard;
