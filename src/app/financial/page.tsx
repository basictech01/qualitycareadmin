"use client";

import React, { useState, useEffect } from 'react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { get, post, put } from '@/utils/network';

// Define interfaces for booking types
interface BaseBooking {
  id: string;
  user_id: number|null;
  service_id?: number,
  doctor_id?:number
  type: string;
  user_full_name: string;
  user_phone_number: string;
  user_email: string;
  branch_id: number;
  branch_name_en: string;
  branch_name_ar: string;
  time_slot_id: 1,
  time_slot_start_time: string,
  time_slot_end_time: string,
  booking_date: string;
  booking_status: string;
  actual_price?: string;
  discounted_price?: string;
  service_actual_price?: string;
  service_discounted_price?: string;
  vat_percentage: string;
  vat_amount?: string;
  final_total?: string;
  doctor_name_en?: string;
  service_name_en?: string;
}
interface RescheduleState {
  startTime?: string;
  endTime?: string;
  doctorId: number ;
  branchId: number;
  selectedDate: Date|string;
  bookingId: string | null;
  userID:number|null;
  time_slot_id:number|null;
  time_slots:[];
}

const RescheduleStateInitial: RescheduleState = {
  startTime: '',
  endTime: '',
  doctorId: 0,
  branchId: 0,
  selectedDate: Date(),
  bookingId: null,
  userID:null,
  time_slot_id:null,
  time_slots:[],
};

interface DoctorBooking extends BaseBooking {
  doctor_name_en: string;
}

interface ServiceBooking extends BaseBooking {
  service_name_en: string;
}

// Define types for function return values and state
type Booking = DoctorBooking | ServiceBooking;

interface BookingTypeDetails {
  type: string;
  name: string;
  actual_price: string;
  discounted_price: string;
  discount_amount: string;
}

const BookingInvoice: React.FC = () => {
  // State variables with explicit typing
  const [doctorBookings, setDoctorBookings] = useState<DoctorBooking[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [canceledBooking, setcanceledBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [upcomingActiveTab, setUpcomingActiveTab] = useState<'all' | 'doctor' | 'service' | 'canceled'>('all');
  const [completedActiveTab, setCompletedActiveTab] = useState<'all' | 'doctor' | 'service' >('all');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
  const [availableTimeSlots, setAvailableTimeSlot] = useState<any[]>([]);
  const [rescheduleData, setRescheduleData] = useState<RescheduleState>(RescheduleStateInitial);
  const [date_time, setDate_time] = useState<string>("date");
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [timeSlotID, setTimeSlotID] = useState<number>(0);



  
  // Process bookings with VAT calculation
  const processBookingsDoctor = (bookings: DoctorBooking[] ):DoctorBooking[] => {
   
    return bookings.map(booking => {
      if (booking.vat_percentage === "") return booking;

      const vatRate = parseFloat(booking.vat_percentage);
 
      const discountedPrice = parseFloat(booking.discounted_price || booking.service_discounted_price || '0');
      
      // Calculate VAT amount
      const vatAmount = (discountedPrice * (vatRate / 100)).toFixed(2);
      
      // Calculate final total (after VAT)
      const finalTotal = (discountedPrice * (1 + vatRate / 100)).toFixed(2);

      return {
        ...booking,
        vat_amount: vatAmount,
        final_total: finalTotal
      };
    });
  };
  const processBookingsService = (bookings: ServiceBooking[]) => {
   
    return bookings.map(booking => {
      if (booking.vat_percentage === "") return booking;

      const vatRate = parseFloat(booking.vat_percentage);
 
      const discountedPrice = parseFloat(booking.discounted_price || booking.service_discounted_price || '0');
      
      // Calculate VAT amount
      const vatAmount = (discountedPrice * (vatRate / 100)).toFixed(2);
      
      // Calculate final total (after VAT)
      const finalTotal = (discountedPrice * (1 + vatRate / 100)).toFixed(2);

      return {
        ...booking,
        vat_amount: vatAmount,
        final_total: finalTotal
      };
    });
  };

  // Fetch bookings and process data
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      // Fetch doctor and service bookings
      const doctorData: DoctorBooking[] = await get('/booking/doctor/metric');
      const serviceData: ServiceBooking[] = await get('/booking/service/metric');
      // Process bookings with VAT
      console.log(doctorData,"doctor data")
      const processedDoctorData = processBookingsDoctor(doctorData);
      const processedServiceData = processBookingsService(serviceData);

      // Add type to bookings
      const doctorWithType = processedDoctorData.map(booking => ({ ...booking, type: 'doctor' }));
      const serviceWithType = processedServiceData.map(booking => ({ ...booking, type: 'service' }));
  
      // Update state
      setDoctorBookings(doctorWithType);
      setServiceBookings(serviceWithType);
      
      const allBookings: Booking[] = [...doctorWithType, ...serviceWithType];
      
      const currentDate = new Date();
      
      // Filter completed and upcoming bookings
      const completed = allBookings.filter(booking => 
        isBefore(parseISO(booking.booking_date), currentDate) || 
        booking.booking_status === "COMPLETED" 
      );
      
      const upcoming = allBookings.filter(booking => 
        isAfter(parseISO(booking.booking_date), currentDate) && 
        booking.booking_status !== "COMPLETED" && 
        booking.booking_status !== "CANCELED"
      );
      const canceled = allBookings.filter(booking =>  
        booking.booking_status === "CANCELED"
      );
      
 
      setcanceledBookings(canceled);
      setCompletedBookings(completed);
      setUpcomingBookings(upcoming);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setIsLoading(false);
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  interface TimeSlotParams {
    branch_id: null | string;
    date: string | Date;
    doctor_id: null | string;
  }
   
  const handleTimeSlotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeSlotID(parseInt(event.target.value));
  };


const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  setRescheduleError(null)
  const selectedDate = e.target.value; // Format: "2025-03-26"

  const params = new URLSearchParams({
    branch_id: String(rescheduleData.branchId),
    date: String(selectedDate),
    doctor_id: String(rescheduleData.doctorId)
});

  console.log(params , "handgel change in");
  const fetchAvailableTimeSlot = await get(`/doctor/time-slot/available?${params.toString()}`);
  console.log(fetchAvailableTimeSlot)
  const availableTimeSlots1 = fetchAvailableTimeSlot.filter((timeSlot : any) => timeSlot.available === true);
  const availableTimeSlotsCount = availableTimeSlots1.length;
  
  if(availableTimeSlotsCount == 0)
  {
    setRescheduleError("Doctor not available please change date")
  }
  else{
    setAvailableTimeSlot(availableTimeSlots1)
    // setDate_time("time")
  }
  console.log(availableTimeSlots , "available time slot");

 console.log(rescheduleData,"done")

 const res ={
  ...rescheduleData,
  selectedDate: selectedDate
 }
 setRescheduleData(res)
}
  
  const handleOpenRescheduleModal = async (booking: BaseBooking) => {
    console.log(booking,"booking")
    if (upcomingActiveTab === 'canceled') return;
    const res: RescheduleState={
      bookingId: booking.id,
      time_slot_id : null,
      doctorId: booking.doctor_id ?? 0,
      branchId: booking.branch_id,
      selectedDate: new Date(),
      time_slots:[],
      userID: booking.user_id,
    }
    console.log(res)
    setRescheduleData(res);
  
   
    setRescheduleError(null);
    setShowRescheduleModal(true);
  };

  // Function to handle closing the reschedule modal
  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setRescheduleData(RescheduleStateInitial);
    setRescheduleError(null);
  };

  // Function to handle reschedule submission
  const handleRescheduleBooking = async () => {
    if (!rescheduleData.bookingId) return;
    
    // Basic validation
    if (timeSlotID==0) {
      setRescheduleError('Please Select a Slot');
      return;
    }

    try {
      setIsRescheduling(true);
      setRescheduleError(null);
      
      // Get the booking type (doctor or service)
      const booking = upcomingBookings.find(b => b.id === rescheduleData.bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // API endpoint depends on booking type
      const endpoint = booking.type === 'doctor' 
        ? '/booking/doctor/reschedule' 
        : '/booking/service/reschedule';
      
      // Send reschedule request
      await post(endpoint, {
        booking_id: rescheduleData.bookingId,
        time_slot_id: timeSlotID,
        userID: rescheduleData.userID,
        date:rescheduleData.selectedDate,
      });
      // Close modal and refresh bookings
      handleCloseRescheduleModal();
      fetchBookings();
      
      // Show success notification
      alert('Booking rescheduled successfully');
      
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      setRescheduleError((error as Error).message || 'Failed to reschedule booking');
    } finally {
      setIsRescheduling(false);
      setDate_time("date")
    }
  };

  // Function to handle opening the cancel modal
  const handleOpenCancelModal = (bookingId: string) => {
    setCancelBookingId(bookingId);
    setCancelError(null);
    setShowCancelModal(true);
  };

  // Function to handle closing the cancel modal
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelBookingId(null);
    setCancelError(null);
  };

  // Function to handle booking cancellation
  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;
    
    
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
      alert('Booking canceled successfully');
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setCancelError((error as Error).message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (date: string) => {
    return format(parseISO(date), 'MMM dd, yyyy');
  };

  const getBookingTypeDetails = (booking: Booking): BookingTypeDetails => {
    if (booking.type === 'doctor') {
      return {
        type: 'Doctor Appointment',
        name: booking.doctor_name_en || '',
        actual_price: booking.actual_price || "0.00",
        discounted_price: booking.discounted_price || "0.00",
        discount_amount: booking.actual_price && booking.discounted_price ? 
          (parseFloat(booking.actual_price) - parseFloat(booking.discounted_price)).toFixed(2) : "0.00"
      };
    } else {
      return {
        type: 'Service',
        name: booking.service_name_en || '',
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
      case 'canceled':
        return canceledBooking;
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
  const exportToCSV = (bookings: Booking[], filename: string) => {
    // Create headers for CSV
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Booking Type',
      'Branch Name',
      'Service/Doctor Name',
      'Date',
      'Total Amount',
      'Discount Amount',
      'VAT Percentage',
      'VAT Amount',
      'Final Total'
    ];
    
    // Map bookings to CSV rows
    console.log(bookings)
    const rows = bookings.map(booking => {
      const details = getBookingTypeDetails(booking);
      return [
        booking.id,
        booking.user_full_name,
        booking.user_email,
        details.type,
        booking.branch_name_en,
        details.name,
        formatDate(booking.booking_date),
        details.actual_price,
        details.discount_amount,
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
  const getTabButtonStyle = (isActive: boolean): React.CSSProperties => ({
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
  
  const tableContainerStyle: React.CSSProperties = {
    height: '300px',
    overflow: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    width: '100%',
    position: 'relative', // Added to create a positioning context
    maxWidth: '100%' // Ensure the container doesn't overflow
  };
  
  // Modified sticky header style to work better on mobile
  const stickyHeaderStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    backgroundColor: '#f8f9fa',
    zIndex: 1, // Lower z-index to avoid overlapping with sidebar
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    width: '100%',
    left: 0
  };
  
  // Improved heading styles
  const mainHeadingStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '12px',
    marginBottom: '24px',
    position: 'relative'
  };
  
  const sectionHeadingContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column', // Changed to column for mobile
    gap: '12px', // Added gap for spacing in column layout
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0',
    width: '100%'
  };
  
  // Media query for desktop
  const getHeadingContainerStyle = (): React.CSSProperties => {
    // Check if we're in a browser environment with window object
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      return {
        ...sectionHeadingContainerStyle,
        flexDirection: 'row' as 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      };
    }
    return sectionHeadingContainerStyle;
  };
  
  const sectionHeadingStyle = (color: string): React.CSSProperties => ({
    fontSize: '20px',
    fontWeight: '600',
    color: color,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap' // Allow wrapping on small screens
  });
  
  const countBadgeStyle = (color: string): React.CSSProperties => ({
    backgroundColor: color,
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    padding: '2px 8px',
    borderRadius: '12px',
    marginLeft: '8px'
  });
  
  const csvButtonStyle: React.CSSProperties = {
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
  const tableWrapperStyle: React.CSSProperties = {
    width: '100%',
    overflowX: 'auto', // Enable horizontal scrolling for tables
    position: 'relative'
  };

  const tableStyle: React.CSSProperties = {
    minWidth: '900px', // Ensure table has minimum width for all columns
    width: '100%',
    tableLayout: 'fixed', // Fixed layout for better control
    borderCollapse: 'collapse'
  };

  const actionColumnStyle: React.CSSProperties = {
    whiteSpace: 'nowrap'
  };
  
  // Modal styles
  const modalOverlayStyle: React.CSSProperties = {
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
  
  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };
  
  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  };
  
  const modalFooterStyle: React.CSSProperties = {
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
          <button
            style={getTabButtonStyle(upcomingActiveTab === 'canceled')}
            onClick={() => setUpcomingActiveTab('canceled')}
          >
            Canceled
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
                    <th scope="col">Branch Name</th>
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
                            <div>
                              <span style={{ fontSize: '12px', color: '#666' }}>{booking.user_phone_number}</span>
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
                        <td>{booking.branch_name_en}</td>
                        <td className="text-right">﷼{details.actual_price}</td>
                        <td className="text-right">﷼{details.discount_amount}</td>
                        <td className="text-right">
                          {booking.vat_percentage || 15}% (﷼{booking.vat_amount || "0.00"})
                        </td>
                        <td className="text-right font-medium">﷼{booking.final_total || "0.00"}</td>
                         <td className="text-center" style={actionColumnStyle}>
                         <div style={{
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          gap: '4px' // Add some space between buttons
                        }}>
                           <button
                           disabled={upcomingActiveTab=='canceled'}
                            onClick={() => handleOpenCancelModal(booking.id)}
                            style={{
                              border: 'none',
                              background: upcomingActiveTab =='canceled'? '#808080' :'#007bff' ,
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginRight: '4px'
                            }}>
                            Cancel/Refund
                          </button>
                          <button
                            disabled={upcomingActiveTab === 'canceled'}
                            onClick={() => handleOpenRescheduleModal(booking)}
                            style={{
                              border: 'none',
                              background: upcomingActiveTab === 'canceled' ? '#808080' : '#c70000',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginRight: '4px'
                            }}
                          >
                            Reschedule
                          </button>

                          </div>
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
                total + parseFloat(booking.final_total || "0"), 0).toFixed(2)}</span>
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
                    <th scope="col">Branch Name</th>
                    <th scope="col" className="text-right">Total Amount</th>
                    <th scope="col" className="text-right">Discount Amount</th>
                    <th scope="col" className="text-right">VAT (%) & Amount</th>
                    <th scope="col" className="text-right">Final Total</th>
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
                            <div>
                              <span style={{ fontSize: '12px', color: '#666' }}>{booking.user_phone_number}</span>
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
                        <td>{booking.branch_name_en}</td>
                        <td className="text-right">﷼{details.actual_price}</td>
                        <td className="text-right">﷼{details.discount_amount}</td>
                        <td className="text-right">
                          {booking.vat_percentage || 15}% (﷼{booking.vat_amount || "0.00"})
                        </td>
                        <td className="text-right font-medium">﷼{booking.final_total || "0.00"}</td>
                       
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>



        {/* Reschedule Booking Modal */}
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: showRescheduleModal ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '4px',
      padding: '24px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0, fontSize: '10px' }}>Reschedule Booking</h3>
        <button
          onClick={handleCloseRescheduleModal}
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
      
      {rescheduleError && (
        <div style={{
          backgroundColor: '#ffdddd',
          color: '#f44336',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {rescheduleError}
        </div>
      )}
      
    {date_time=="date"? 
    <div className='my-3'>
  <label htmlFor="appointment-date">Select Date:</label>
  <input
    id="appointment-date"
    type="date"
    onChange={handleDateChange}
    className="
    w-full 
    pl-10 
    pr-3 
    py-2
    px-3
    mx-3 
    border 
    border-gray-300 
    rounded-md 
    shadow-sm 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:border-blue-500
  "
    min={new Date().toISOString().split('T')[0]} // No past dates
  />
</div>:
      <select 
      id="time-slot-select"
      className="
        w-full 
        pl-10 
        pr-3 
        py-2 
        px-3
        border 
        rounded-md 
        border-gray-300 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-500 
        focus:border-transparent
        appearance-none 
        bg-white 
        text-gray-900
        shadow-sm
      "
      onChange={handleTimeSlotChange}
      aria-describedby="time-slot-description"
    >
      <option value="" disabled>Select a time slot</option>
      {availableTimeSlots.map((slot) => (
        <option 
          key={slot.id} 
          value={slot.id.toString()}
          disabled={!slot.available}
          className={`
            ${!slot.available ? 'text-gray-300 line-through' : ''}
          `}
        >
          {slot.start_time} - {slot.end_time} 
          {!slot.available && ' (Unavailable)'}
        </option>
      ))}
    </select>
      }
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '24px',
        gap: '12px'
      }}>
         {date_time=="date"?<button
          onClick={handleCloseRescheduleModal}
          style={{
            background: '#f0f0f0',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>:
        <button
        onClick={()=>{setDate_time("date")}}
        style={{
          background: '#f0f0f0',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: 'pointer'
        }}
      >
        back
      </button>
        }
        {date_time=="time"?<button
          onClick={handleRescheduleBooking}
          disabled={isRescheduling}
          style={{
            background: '#28a745',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            color: 'white',
            cursor: isRescheduling ? 'not-allowed' : 'pointer',
            opacity: isRescheduling ? 0.7 : 1
          }}
        >
          {isRescheduling ? 'Rescheduling...' : 'Reschedule'}
        </button>:
        <button
       onClick={()=> {
        if(rescheduleData.selectedDate ==null)
        {
          setRescheduleError("select a date")
        }
        else{
          setRescheduleError(null)
          setDate_time("time")}}
        }
        
       style={{
         background: '#28a745',
         border: 'none',
         borderRadius: '4px',
         padding: '10px 16px',
        
         color: 'white',
       }}
     >
       Set Time Slot
     </button>
        }
      </div>
    </div>
  </div>

      {/* Cancel Booking Modal */}
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <div style={modalHeaderStyle}>
            <h3 style={{ margin: 0, fontSize: '12px' }}>Cancel Booking</h3>
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