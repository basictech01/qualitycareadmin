"use client";
import React, { useState, useEffect } from 'react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { get } from '@/utils/network';

const BookingInvoice = () => {
  // State variables remain the same
  const [doctorBookings, setDoctorBookings] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingActiveTab, setUpcomingActiveTab] = useState('all');
  const [completedActiveTab, setCompletedActiveTab] = useState('all');
  
  // The useEffect and utility functions remain the same
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorData = await get('/booking/doctor/metric');
        const serviceData = await get('/booking/service/metric');
        
        const doctorWithType = doctorData.map(booking => ({ ...booking, type: 'doctor' }));
        const serviceWithType = serviceData.map(booking => ({ ...booking, type: 'service' }));
        
        setDoctorBookings(doctorWithType);
        setServiceBookings(serviceWithType);
        
        const allBookings = [...doctorWithType, ...serviceWithType];
        
        const currentDate = new Date();
        
        const completed = allBookings.filter(booking => 
          isBefore(parseISO(booking.booking_date), currentDate) || 
          booking.booking_status === "COMPLETED"
        );
        
        const upcoming = allBookings.filter(booking => 
          isAfter(parseISO(booking.booking_date), currentDate) && 
          booking.booking_status !== "COMPLETED"
        );
        
        setCompletedBookings(completed);
        setUpcomingBookings(upcoming);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (date) => {
    return format(parseISO(date), 'MMM dd, yyyy');
  };

  const getBookingTypeDetails = (booking) => {
    if (booking.type === 'doctor') {
      return {
        type: 'Doctor Appointment',
        name: booking.doctor_name_en,
        actual_price: booking.actual_price || "0.00",
        discounted_price: booking.discounted_price || "0.00",
        discount_amount: booking.actual_price && booking.discounted_price ? 
          (parseFloat(booking.actual_price) - parseFloat(booking.discounted_price)).toFixed(2) : "0.00"
      };
    } else {
      return {
        type: 'Service',
        name: booking.service_name_en,
        actual_price: booking.service_actual_price || "0.00",
        discounted_price: booking.service_discounted_price || "0.00",
        discount_amount: booking.service_actual_price && booking.service_discounted_price ? 
          (parseFloat(booking.service_actual_price) - parseFloat(booking.service_discounted_price)).toFixed(2) : "0.00"
      };
    }
  };

  const getFilteredUpcomingBookings = () => {
    switch (upcomingActiveTab) {
      case 'doctor':
        return upcomingBookings.filter(booking => booking.type === 'doctor');
      case 'service':
        return upcomingBookings.filter(booking => booking.type === 'service');
      default:
        return upcomingBookings;
    }
  };

  const getFilteredCompletedBookings = () => {
    switch (completedActiveTab) {
      case 'doctor':
        return completedBookings.filter(booking => booking.type === 'doctor');
      case 'service':
        return completedBookings.filter(booking => booking.type === 'service');
      default:
        return completedBookings;
    }
  };
  
  // CSV Export Function
  const exportToCSV = (bookings, filename) => {
    // Create headers for CSV
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Booking Type',
      'Service/Doctor Name',
      'Date',
      'Total Amount',
      'Discount Amount',
      'VAT Percentage',
      'VAT Amount',
      'Final Total'
    ];
    
    // Map bookings to CSV rows
    const rows = bookings.map(booking => {
      const details = getBookingTypeDetails(booking);
      return [
        booking.id,
        booking.user_full_name,
        booking.user_email,
        details.type,
        details.name,
        formatDate(booking.booking_date),
        details.actual_price,
        details.discount_amount,
        booking.vat_percentage || 15,
        booking.vat_amount || "0.00",
        booking.final_total || "0.00"
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Styled components
  const getTabButtonStyle = (isActive) => ({
    border: 'none',
    background: isActive ? '#007bff' : '#f0f0f0',
    color: isActive ? 'white' : 'black',
    padding: '6px 12px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '13px',
    marginRight: '8px'
  });
  
  const tableContainerStyle = {
    height: '300px',
    overflow: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: '4px'
  };
  
  const stickyHeaderStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: '#f8f9fa',
    zIndex: 10,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  };
  
  // Improved heading styles
  const mainHeadingStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '12px',
    marginBottom: '24px',
    position: 'relative'
  };
  
  const sectionHeadingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0'
  };
  
  const sectionHeadingStyle = (color) => ({
    fontSize: '20px',
    fontWeight: '600',
    color: color,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });
  
  const countBadgeStyle = (color) => ({
    backgroundColor: color,
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    padding: '2px 8px',
    borderRadius: '12px',
    marginLeft: '8px'
  });
  
  const csvButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: 'none',
    background: '#6b46c1',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };
  
  if (isLoading) {
    return <div className="text-center py-3">Loading invoices...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Main Heading with decorative element */}
      <div style={mainHeadingStyle}>
        Booking Invoices
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: '0',
          width: '60px',
          height: '4px',
          backgroundColor: '#3182ce',
          borderRadius: '2px'
        }}></div>
      </div>
      
      {/* Upcoming Bookings Section */}
      <div className="mb-10">
        <div style={sectionHeadingContainerStyle}>
          <div style={sectionHeadingStyle('#3182ce')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Upcoming Bookings
            <span style={countBadgeStyle('#3182ce')}>
              {getFilteredUpcomingBookings().length}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#718096', fontSize: '14px' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {getFilteredUpcomingBookings().length > 0 && (
              <button 
                style={csvButtonStyle}
                onClick={() => exportToCSV(getFilteredUpcomingBookings(), 'upcoming-bookings')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download CSV
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs for Upcoming Bookings */}
        <div className="mb-3">
          <button
            style={getTabButtonStyle(upcomingActiveTab === 'all')}
            onClick={() => setUpcomingActiveTab('all')}
          >
            All Bookings
          </button>
          <button
            style={getTabButtonStyle(upcomingActiveTab === 'doctor')}
            onClick={() => setUpcomingActiveTab('doctor')}
          >
            Doctor Appointments
          </button>
          <button
            style={getTabButtonStyle(upcomingActiveTab === 'service')}
            onClick={() => setUpcomingActiveTab('service')}
          >
            Services
          </button>
        </div>
        
        {getFilteredUpcomingBookings().length === 0 ? (
          <div className="text-center py-2">No upcoming bookings found for the selected filter.</div>
        ) : (
          <div style={tableContainerStyle}>
            <table className="table bordered-table sm-table mb-0 w-full">
              <thead>
                <tr style={stickyHeaderStyle}>
                  <th scope="col">Order ID</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Booking Type</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-right">Total Amount</th>
                  <th scope="col" className="text-right">Discount Amount</th>
                  <th scope="col" className="text-right">VAT (%) & Amount</th>
                  <th scope="col" className="text-right">Final Total</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredUpcomingBookings().map((booking) => {
                  const details = getBookingTypeDetails(booking);
                  return (
                    <tr key={`${booking.type}-${booking.id}`}>
                      <td>{booking.id}</td>
                      <td>
                        <div>
                          <span>{booking.user_full_name}</span>
                          <div>
                            <span style={{ fontSize: '12px', color: '#666' }}>{booking.user_email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span>{details.type}</span>
                          <div>
                            <span style={{ fontSize: '12px', color: '#666' }}>{details.name}</span>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(booking.booking_date)}</td>
                      <td className="text-right">${details.actual_price}</td>
                      <td className="text-right">${details.discount_amount}</td>
                      <td className="text-right">
                        {booking.vat_percentage || 15}% (${booking.vat_amount || "0.00"})
                      </td>
                      <td className="text-right font-medium">${booking.final_total || "0.00"}</td>
                      <td className="text-center">
                        <button style={{
                          border: 'none',
                          background: '#007bff',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginRight: '4px'
                        }}>
                          Edit
                        </button>
                        <button style={{
                          border: 'none',
                          background: '#28a745',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>
                          Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Completed Bookings Section */}
      <div>
        <div style={sectionHeadingContainerStyle}>
          <div style={sectionHeadingStyle('#38a169')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Completed Bookings
            <span style={countBadgeStyle('#38a169')}>
              {getFilteredCompletedBookings().length}
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '14px', color: '#718096' }}>
              <span>Total: ${getFilteredCompletedBookings().reduce((total, booking) => 
                total + parseFloat(booking.final_total || 0), 0).toFixed(2)}</span>
            </div>
            {getFilteredCompletedBookings().length > 0 && (
              <button 
                style={csvButtonStyle}
                onClick={() => exportToCSV(getFilteredCompletedBookings(), 'completed-bookings')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download CSV
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs for Completed Bookings */}
        <div className="mb-3">
          <button
            style={getTabButtonStyle(completedActiveTab === 'all')}
            onClick={() => setCompletedActiveTab('all')}
          >
            All Bookings
          </button>
          <button
            style={getTabButtonStyle(completedActiveTab === 'doctor')}
            onClick={() => setCompletedActiveTab('doctor')}
          >
            Doctor Appointments
          </button>
          <button
            style={getTabButtonStyle(completedActiveTab === 'service')}
            onClick={() => setCompletedActiveTab('service')}
          >
            Services
          </button>
        </div>
        
        {getFilteredCompletedBookings().length === 0 ? (
          <div className="text-center py-2">No completed bookings found for the selected filter.</div>
        ) : (
          <div style={tableContainerStyle}>
            <table className="table bordered-table sm-table mb-0 w-full">
              <thead>
                <tr style={stickyHeaderStyle}>
                  <th scope="col">Order ID</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Booking Type</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-right">Total Amount</th>
                  <th scope="col" className="text-right">Discount Amount</th>
                  <th scope="col" className="text-right">VAT (%) & Amount</th>
                  <th scope="col" className="text-right">Final Total</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredCompletedBookings().map((booking) => {
                  const details = getBookingTypeDetails(booking);
                  return (
                    <tr key={`${booking.type}-${booking.id}`}>
                      <td>{booking.id}</td>
                      <td>
                        <div>
                          <span>{booking.user_full_name}</span>
                          <div>
                            <span style={{ fontSize: '12px', color: '#666' }}>{booking.user_email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span>{details.type}</span>
                          <div>
                            <span style={{ fontSize: '12px', color: '#666' }}>{details.name}</span>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(booking.booking_date)}</td>
                      <td className="text-right">${details.actual_price}</td>
                      <td className="text-right">${details.discount_amount}</td>
                      <td className="text-right">
                        {booking.vat_percentage || 15}% (${booking.vat_amount || "0.00"})
                      </td>
                      <td className="text-right font-medium">${booking.final_total || "0.00"}</td>
                      <td className="text-center">
                        <button style={{
                          border: 'none',
                          background: '#28a745',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingInvoice;