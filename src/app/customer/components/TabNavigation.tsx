
"use client";
import React from "react";
import {AppointmentType, TabNavigationProps } from "@/utils/types";

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-3">
      <button
        style={{
          border: "none",
          background: activeTab === "doctor" ? "#007bff" : "#f0f0f0",
          color: activeTab === "doctor" ? "white" : "black",
          padding: "6px 12px",
          borderRadius: "3px",
          cursor: "pointer",
          fontSize: "13px",
          marginRight: "8px",
        }}
        onClick={() => setActiveTab(AppointmentType.DOCTOR)}
      >
        Doctor Appointment History
      </button>
      <button
        style={{
          border: "none",
          background: activeTab === "service" ? "#007bff" : "#f0f0f0",
          color: activeTab === "service" ? "white" : "black",
          padding: "6px 12px",
          borderRadius: "3px",
          cursor: "pointer",
          fontSize: "13px",
        }}
        onClick={() => setActiveTab(AppointmentType.SERVICE)}
      >
        Service Appointment History
      </button>
    </div>
  );
};

export default TabNavigation;
