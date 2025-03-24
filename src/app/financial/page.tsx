"use client";
import React, { useState, useEffect } from 'react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { get, post } from '@/utils/network';

const BookingInvoice = () => {
  // State variables
  const [doctorBookings, setDoctorBookings] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingActiveTab, setUpcomingActiveTab] = useState('all');
  const [completedActiveTab, setCompletedActiveTab] = useState('all');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  // Fetch data
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
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
        booking.booking_status !== "COMPLETED" && 
        booking.booking_status !== "CANCELLED"
      );
      
      setCompletedBookings(completed);
      setUpcomingBookings(upcoming);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setIsLoading(false);
    }
  };

  // Function to handle opening the cancel modal
  const handleOpenCancelModal = (bookingId) => {
    setCancelBookingId(bookingId);
    setCancelReason('');
    setCancelError(null);
    setShowCancelModal(true);
  };

  // Function to handle closing the cancel modal
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelBookingId(null);
    setCancelReason('');
    setCancelError(null);
  };

  // Function to handle booking cancellation
  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;
    
    if (!cancelReason.trim()) {
      setCancelError('Please provide a reason for cancellation');
      return;
    }
    
    try {
      setIsCancelling(true);
      setCancelError(null);
      
      // Get the booking type (doctor or service)
      const booking = upcomingBookings.find(b => b.id === cancelBookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // API endpoint depends on booking type
      const endpoint = booking.type === 'doctor' 
        ? '/booking/doctor/cancel' 
        : '/booking/service/cancel';
      
      // Send cancellation request
      await post(endpoint, {
        booking_id: cancelBookingId,
      });
      
      // Close modal and refresh bookings
      handleCloseCancelModal();
      fetchBookings();
      
      // Show success notification - you might want to add a proper notification system
      alert('Booking cancelled successfully');
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setCancelError(error.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

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
    marginRight: '8px',
    marginBottom: '8px' // Added for better mobile layout
  });
  
  const tableContainerStyle = {
    height: '300px',
    overflow: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    width: '100%',
    position: 'relative', // Added to create a positioning context
    maxWidth: '100%' // Ensure the container doesn't overflow
  };
  
  // Modified sticky header style to work better on mobile
  const stickyHeaderStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: '#f8f9fa',
    zIndex: 1, // Lower z-index to avoid overlapping with sidebar
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    width: '100%',
    left: 0
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
    flexDirection: 'column', // Changed to column for mobile
    gap: '12px', // Added gap for spacing in column layout
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0',
    width: '100%'
  };
  
  // Media query for desktop
  const getHeadingContainerStyle = () => {
    // Check if we're in a browser environment with window object
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      return {
        ...sectionHeadingContainerStyle,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      };
    }
    return sectionHeadingContainerStyle;
  };
  
  const sectionHeadingStyle = (color) => ({
    fontSize: '20px',
    fontWeight: '600',
    color: color,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap' // Allow wrapping on small screens
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
  
  // New responsive styles for table
  const tableWrapperStyle = {
    width: '100%',
    overflowX: 'auto', // Enable horizontal scrolling for tables
    position: 'relative'
  };

  const tableStyle = {
    minWidth: '900px', // Ensure table has minimum width for all columns
    width: '100%',
    tableLayout: 'fixed', // Fixed layout for better control
    borderCollapse: 'collapse'
  };

  const actionColumnStyle = {
    whiteSpace: 'nowrap'
  };
  
  // Modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: showCancelModal ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };
  
  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };
  
  const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  };
  
  const modalFooterStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
    gap: '12px'
  };
  
  if (isLoading) {
    return <div className="text-center py-3">Loading invoices...</div>;
  }

  return (
    <div className="w-full p-4">
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
      <div className="mb-10 w-full">
        <div style={getHeadingContainerStyle()}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
        <div className="mb-3 w-full" style={{ display: 'flex', flexWrap: 'wrap' }}>
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
          <div className="text-center py-2 w-full">No upcoming bookings found for the selected filter.</div>
        ) : (
          <div style={tableWrapperStyle}>
            <div style={tableContainerStyle}>
              <table style={tableStyle} className="table bordered-table sm-table mb-0">
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
                    <th scope="col" className="text-center" style={actionColumnStyle}>Actions</th>
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
                        <td className="text-center" style={actionColumnStyle}>
                          <button
                            onClick={() => handleOpenCancelModal(booking.id)}
                            style={{
                              border: 'none',
                              background: '#007bff',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginRight: '4px'
                            }}>
                            Cancel/Refund
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Completed Bookings Section */}
      <div className="w-full">
        <div style={getHeadingContainerStyle()}>
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
            gap: '12px',
            flexWrap: 'wrap'
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
        <div className="mb-3 w-full" style={{ display: 'flex', flexWrap: 'wrap' }}>
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
          <div className="text-center py-2 w-full">No completed bookings found for the selected filter.</div>
        ) : (
          <div style={tableWrapperStyle}>
            <div style={tableContainerStyle}>
              <table style={tableStyle} className="table bordered-table sm-table mb-0">
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
                    <th scope="col" className="text-center" style={actionColumnStyle}>Actions</th>
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
                        <td className="text-center" style={actionColumnStyle}>
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
          </div>
        )}
      </div>
      
      {/* Cancel Booking Modal */}
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <div style={modalHeaderStyle}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Cancel Booking</h3>
            <button
              onClick={handleCloseCancelModal}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              &times;
            </button>
          </div>
          
          <div>
            <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
              Booking ID: {cancelBookingId}
            </p>
            
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Cancellation Reason:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '80px'
                }}
              />
              {cancelError && (
                <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>
                  {cancelError}
                </p>
              )}
            </div>
          </div>
          
          <div style={modalFooterStyle}>
            <button
              onClick={handleCloseCancelModal}
              style={{
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCancelBooking}
              disabled={isCancelling}
              style={{
                background: '#dc3545',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                color: 'white',
                cursor: isCancelling ? 'not-allowed' : 'pointer',
                opacity: isCancelling ? 0.7 : 1
              }}
            >
              {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default BookingInvoice;