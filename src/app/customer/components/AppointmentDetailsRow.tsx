
"use client";
import React from "react";
import { AppointmentDetailsRowProps } from "@/utils/types";
import TabNavigation from "./TabNavigation";
import DoctorAppointmentsTable from "./DoctorAppointmentsTable";
import ServiceAppointmentsTable from "./ServiceAppointmentsTable";

const AppointmentDetailsRow: React.FC<AppointmentDetailsRowProps> = ({
  user,
  activeTab,
  setActiveTab,
  doctorAppointments,
  serviceAppointments,
  appointmentLoading,
}) => {
  return (
    <tr>
      <td colSpan={9}>
        <div className="p-3">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          {appointmentLoading ? (
            <div className="text-center py-3">Loading appointment data...</div>
          ) : (
            <>
              {activeTab === "doctor" && (
                <DoctorAppointmentsTable appointments={doctorAppointments} />
              )}
              {activeTab === "service" && (
                <ServiceAppointmentsTable appointments={serviceAppointments} />
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AppointmentDetailsRow;
