
"use client";
import React, { useState, useEffect } from "react";
import { get } from "@/utils/network";
import { AppointmentType , User, DoctorAppointment, ServiceAppointment } from "@/utils/types";
import CustomerRow from "./components/CustomerRow";
import AppointmentDetailsRow from "./components/AppointmentDetailsRow";

const CustomerDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<AppointmentType>(AppointmentType.DOCTOR);
  const [doctorAppointments, setDoctorAppointments] = useState<Record<number, DoctorAppointment[]>>({});
  const [serviceAppointments, setServiceAppointments] = useState<Record<number, ServiceAppointment[]>>({});
  const [appointmentLoading, setAppointmentLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await get("/user/userMetrics");
        setUsers(response);
      } catch (err: any) {
        // setError("Error fetching user data: " + err.message);
        // or throw the error 
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleDetails = (userId: number) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
      fetchAppointmentData(userId);
    }
  };

  const fetchAppointmentData = async (userId: number) => {
    setAppointmentLoading(true);
    try {
      if (!doctorAppointments[userId]) {
        const doctorData = await get(`/booking/doctor/${userId}`);
        setDoctorAppointments((prev) => ({ ...prev, [userId]: doctorData }));
      }
      if (!serviceAppointments[userId]) {
        const serviceData = await get(`/booking/service/${userId}`);
        setServiceAppointments((prev) => ({ ...prev, [userId]: serviceData }));
      }
    } catch (err: any) {
      console.error("Error fetching appointment data:", err);
    } finally {
      setAppointmentLoading(false);
    }
  };

  const getInitials = (name: string): string => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return <div>Loading customers...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {error && <div className="text-danger">{error}</div>}
      <table className="table bordered-table sm-table mb-0">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">ID</th>
            <th scope="col">Customer</th>
            <th scope="col">Email</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Points</th>
            <th scope="col">Redeemed</th>
            <th scope="col">Total Visits</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <React.Fragment key={user.id}>
                <CustomerRow
                  user={user}
                  expandedUser={expandedUser}
                  toggleDetails={toggleDetails}
                  getInitials={getInitials}
                />
                {expandedUser === user.id && (
                  <AppointmentDetailsRow
                    user={user}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    doctorAppointments={doctorAppointments[user.id] || []}
                    serviceAppointments={serviceAppointments[user.id] || []}
                    appointmentLoading={appointmentLoading}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-2">
                No customers available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDashboard;
