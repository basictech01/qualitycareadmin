// src/app/dashboard/sales/components/LoadingSpinner.tsx
"use client";
import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="row">
    <div className="col-12">
      <div className="card">
        <div
          className="card-body d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
