'use client';

import { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6">DOCTOR DASHBOARD</h1>
        
        
      </div>
    </main>
  );
}

// "use client";
// import { useState, useEffect, useMemo } from 'react';
// import dynamic from "next/dynamic";
// import { get } from '@/utils/network';
// import Image from 'next/image';

// // Dynamically import ApexCharts with no SSR to prevent server-side rendering issues
// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// // Reusable UI Components
// const StatsCard = ({ title, value, description, bgColor, textColor, icon }) => (
//   <div className="col-md-3">
//     <div className={`card ${bgColor} border-0 h-100`}>
//       <div className="card-body">
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <h6 className={`${textColor} mb-0`}>{title}</h6>
//           {icon && <span className={`${textColor}`}>{icon}</span>}
//         </div>
//         <h3 className="fw-bold mb-0">{value}</h3>
//         <small className="text-muted">{description}</small>
//       </div>
//     </div>
//   </div>
// );

// const DoctorCard = ({ doctor, totalBookings, totalRevenue }) => {
//   const bookingPercentage = totalBookings ? Math.round((doctor.bookingsCount / totalBookings) * 100) : 0;
//   const revenuePercentage = totalRevenue ? Math.round((doctor.totalRevenue / totalRevenue) * 100) : 0;
  
//   return (
//     <div className="col-md-6 col-lg-4">
//       <div className="card h-100">
//         <div className="card-body">
//           <div className="d-flex align-items-center mb-3">
//             <div className="flex-shrink-0">
//               {doctor.photoUrl ? (
//                 <Image 
//                   src={doctor.photoUrl} 
//                   width={50} 
//                   height={50} 
//                   alt={doctor.name}
//                   className="rounded-circle"
//                 />
//               ) : (
//                 <div className="bg-primary-100 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
//                   <span className="text-primary-600 fw-bold">{doctor.name?.charAt(0)}</span>
//                 </div>
//               )}
//             </div>
//             <div className="ms-3">
//               <h6 className="fw-bold mb-0">{doctor.name}</h6>
//               <small className="text-muted">{doctor.completedBookings} completed / {doctor.scheduledBookings} scheduled</small>
//             </div>
//           </div>
          
//           <div className="mb-3">
//             <div className="d-flex justify-content-between mb-1">
//               <span className="text-secondary-light">Revenue</span>
//               <span className="fw-semibold">${doctor.totalRevenue.toLocaleString()}</span>
//             </div>
//             <div className="progress" style={{ height: "6px" }}>
//               <div 
//                 className="progress-bar bg-primary" 
//                 role="progressbar" 
//                 style={{ width: `${revenuePercentage}%` }} 
//                 aria-valuenow={revenuePercentage} 
//                 aria-valuemin="0" 
//                 aria-valuemax="100"
//               ></div>
//             </div>
//             <div className="d-flex justify-content-between mt-1">
//               <small className="text-muted">{revenuePercentage}% of total</small>
//               <small className="text-muted">{doctor.bookingsCount} appointments</small>
//             </div>
//           </div>
          
//           <div className="d-flex justify-content-between text-sm">
//             <span className="badge bg-success-100 text-success-800 py-1">
//               ${Math.round(doctor.totalRevenue / doctor.bookingsCount).toLocaleString()} avg
//             </span>
//             {doctor.cancelledBookings > 0 && (
//               <span className="badge bg-danger-100 text-danger-800 py-1">
//                 {Math.round((doctor.cancelledBookings / doctor.bookingsCount) * 100)}% cancelled
//               </span>
//             )}
//             {doctor.rescheduledBookings > 0 && (
//               <span className="badge bg-warning-100 text-warning-800 py-1">
//                 {Math.round((doctor.rescheduledBookings / doctor.bookingsCount) * 100)}% rescheduled
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AppointmentsTable = ({ data, totalRevenue }) => {
//   return (
//     <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//       <table className="table table-hover">
//         <thead className="bg-light sticky-top">
//           <tr>
//             <th scope="col">Doctor</th>
//             <th scope="col">Total Appointments</th>
//             <th scope="col" className="text-end">Completed</th>
//             <th scope="col" className="text-end">Scheduled</th>
//             <th scope="col" className="text-end">Revenue</th>
//             <th scope="col" className="text-end">% of Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((doctor, index) => (
//             <tr key={index}>
//               <td>
//                 <div className="d-flex align-items-center">
//                   {doctor.photoUrl ? (
//                     <Image 
//                       src={doctor.photoUrl} 
//                       width={36} 
//                       height={36} 
//                       alt={doctor.name}
//                       className="rounded-circle me-2"
//                     />
//                   ) : (
//                     <div className="bg-primary-100 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 36, height: 36 }}>
//                       <span className="text-primary-600 fw-bold">{doctor.name?.charAt(0)}</span>
//                     </div>
//                   )}
//                   <span className="fw-semibold">{doctor.name}</span>
//                 </div>
//               </td>
//               <td>{doctor.bookingsCount}</td>
//               <td className="text-end">{doctor.completedBookings}</td>
//               <td className="text-end">{doctor.scheduledBookings}</td>
//               <td className="text-end">${doctor.totalRevenue.toLocaleString()}</td>
//               <td className="text-end">
//                 {totalRevenue ? Math.round((doctor.totalRevenue / totalRevenue) * 100) : 0}%
//               </td>
//             </tr>
//           ))}
//         </tbody>
//         <tfoot className="bg-light sticky-bottom">
//           <tr>
//             <td className="fw-bold">Total</td>
//             <td className="fw-bold">{data.reduce((sum, doctor) => sum + doctor.bookingsCount, 0)}</td>
//             <td className="text-end fw-bold">{data.reduce((sum, doctor) => sum + doctor.completedBookings, 0)}</td>
//             <td className="text-end fw-bold">{data.reduce((sum, doctor) => sum + doctor.scheduledBookings, 0)}</td>
//             <td className="text-end fw-bold">${totalRevenue.toLocaleString()}</td>
//             <td className="text-end fw-bold">100%</td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// };

// const MonthlyAppointmentsChart = ({ options, series }) => (
//   <div id="monthlyAppointmentsChart">
//     <ReactApexChart
//       options={options}
//       series={series}
//       type="bar"
//       height={320}
//     />
//   </div>
// );

// const AppointmentStatusChart = ({ options, series }) => (
//   <div id="appointmentStatusChart">
//     <ReactApexChart
//       options={options}
//       series={series}
//       type="donut"
//       height={300}
//     />
//   </div>
// );

// const LoadingSpinner = () => (
//   <div className="row">
//     <div className="col-12">
//       <div className="card">
//         <div className="card-body d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const DoctorSalesStatistics = () => {
//   // State for tracking time period filter
//   const [timeFilter, setTimeFilter] = useState('Monthly');
//   const [isLoading, setIsLoading] = useState(true);
  
//   // State for API data
//   const [doctorData, setDoctorData] = useState({
//     totalRevenue: 0,
//     completedAppointments: 0,
//     upcomingAppointments: 0,
//     totalCancellations: 0,
//     totalRescheduled: 0,
//     doctorBreakdown: [],
//     monthlyAppointments: []
//   });

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await get('/booking/doctor/metric');
//         const processedData = processAPIData(response);
//         setDoctorData(processedData);
//       } catch (error) {
//         console.error('Error fetching doctor sales data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchData();
//   }, [timeFilter]);
  
//   // Process API data - this would need to be adjusted based on your actual API response
//   const processAPIData = (bookingsData) => {
//     // Constants (placeholder for cancelled/rescheduled - to be updated when you add those fields)
//     const CANCELLED_STATUS = "CANCELLED";
//     const RESCHEDULED_STATUS = "RESCHEDULED";
//     const mockAppointmentPrice = 100; // Placeholder until you add price field
    
//     // Initialize collections
//     let completedAppointments = 0;
//     let upcomingAppointments = 0;
//     let totalCancellations = 0;
//     let totalRescheduled = 0;
    
//     // Doctor breakdown
//     const doctorMap = {};
    
//     // Monthly data for chart
//     const monthlyMap = {};
    
//     // Process each booking
//     bookingsData.forEach(booking => {
//       const price = mockAppointmentPrice; // Replace with actual price when available
//       const isCompleted = booking.booking_status === "COMPLETED";
//       const isScheduled = booking.booking_status === "SCHEDULED";
//       const isCancelled = booking.booking_status === CANCELLED_STATUS;
//       const isRescheduled = booking.booking_status === RESCHEDULED_STATUS;
      
//       // Count by status
//       if (isCompleted) {
//         completedAppointments += 1;
//       } else if (isScheduled) {
//         upcomingAppointments += 1;
//       } else if (isCancelled) {
//         totalCancellations += 1;
//       } else if (isRescheduled) {
//         totalRescheduled += 1;
//       }
      
//       // Aggregate by doctor
//       const doctorId = booking.doctor_id;
//       if (!doctorMap[doctorId]) {
//         doctorMap[doctorId] = {
//           id: doctorId,
//           name: booking.doctor_name_en,
//           photoUrl: booking.doctor_photo_url,
//           bookingsCount: 0,
//           completedBookings: 0,
//           scheduledBookings: 0,
//           cancelledBookings: 0,
//           rescheduledBookings: 0,
//           totalRevenue: 0
//         };
//       }
      
//       doctorMap[doctorId].bookingsCount += 1;
//       if (isCompleted) {
//         doctorMap[doctorId].completedBookings += 1;
//         doctorMap[doctorId].totalRevenue += price;
//       } else if (isScheduled) {
//         doctorMap[doctorId].scheduledBookings += 1;
//         doctorMap[doctorId].totalRevenue += price; // Counting scheduled as revenue as well
//       } else if (isCancelled) {
//         doctorMap[doctorId].cancelledBookings += 1;
//       } else if (isRescheduled) {
//         doctorMap[doctorId].rescheduledBookings += 1;
//       }
      
//       // Extract month for chart data
//       const bookingDate = new Date(booking.booking_date);
//       const monthKey = bookingDate.toLocaleString('default', { month: 'short' });
      
//       if (!monthlyMap[monthKey]) {
//         monthlyMap[monthKey] = {
//           month: monthKey,
//           completed: 0,
//           scheduled: 0,
//           revenue: 0
//         };
//       }
      
//       if (isCompleted) {
//         monthlyMap[monthKey].completed += 1;
//         monthlyMap[monthKey].revenue += price;
//       } else if (isScheduled) {
//         monthlyMap[monthKey].scheduled += 1;
//         monthlyMap[monthKey].revenue += price;
//       }
//     });
    
//     // Convert doctor map to array and sort by revenue
//     const doctorBreakdown = Object.values(doctorMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
    
//     // Sort months chronologically
//     const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const monthlyAppointments = Object.values(monthlyMap).sort((a, b) => 
//       monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
//     );
    
//     // Calculate total revenue
//     const totalRevenue = doctorBreakdown.reduce((total, doctor) => total + doctor.totalRevenue, 0);
    
//     return {
//       totalRevenue,
//       completedAppointments,
//       upcomingAppointments,
//       totalCancellations,
//       totalRescheduled,
//       doctorBreakdown,
//       monthlyAppointments
//     };
//   };

//   // Memoized chart options and series
//   const monthlyChartOptions = useMemo(() => ({
//     chart: {
//       type: 'bar',
//       stacked: true,
//       toolbar: {
//         show: false
//       },
//       fontFamily: 'Inter, sans-serif',
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '55%',
//         borderRadius: 5,
//       },
//     },
//     dataLabels: {
//       enabled: false
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ['transparent']
//     },
//     xaxis: {
//       categories: doctorData.monthlyAppointments.map(item => item.month),
//       labels: {
//         style: {
//           colors: '#718096',
//           fontSize: '12px',
//         },
//       },
//     },
//     yaxis: [
//       {
//         title: {
//           text: 'Appointments',
//           style: {
//             color: '#718096',
//           }
//         },
//         labels: {
//           style: {
//             colors: '#718096',
//             fontSize: '12px',
//           },
//         },
//       },
//       {
//         opposite: true,
//         title: {
//           text: 'Revenue ($)',
//           style: {
//             color: '#718096',
//           }
//         },
//         labels: {
//           style: {
//             colors: '#718096',
//             fontSize: '12px',
//           },
//           formatter: function (value) {
//             return '$' + value.toLocaleString();
//           }
//         },
//       }
//     ],
//     colors: ['#4C51BF', '#68D391', '#F6AD55'],
//     legend: {
//       position: 'top',
//       horizontalAlign: 'right',
//       fontSize: '13px',
//       markers: {
//         radius: 12,
//       },
//     },
//     fill: {
//       opacity: 1
//     },
//     tooltip: {
//       y: {
//         formatter: function (val, { seriesIndex }) {
//           if (seriesIndex === 2) {
//             return "$" + val.toLocaleString();
//           }
//           return val;
//         }
//       }
//     }
//   }), [doctorData.monthlyAppointments]);

//   const monthlyChartSeries = useMemo(() => [
//     {
//       name: 'Completed',
//       data: doctorData.monthlyAppointments.map(item => item.completed)
//     },
//     {
//       name: 'Scheduled',
//       data: doctorData.monthlyAppointments.map(item => item.scheduled)
//     },
//     {
//       name: 'Revenue',
//       data: doctorData.monthlyAppointments.map(item => item.revenue),
//       type: 'line',
//       yAxisIndex: 1,
//     }
//   ], [doctorData.monthlyAppointments]);

//   // Status breakdown pie chart
//   const statusChartOptions = useMemo(() => ({
//     chart: {
//       type: 'donut',
//       fontFamily: 'Inter, sans-serif',
//     },
//     labels: ['Completed', 'Scheduled', 'Cancelled', 'Rescheduled'],
//     colors: ['#48BB78', '#4299E1', '#F56565', '#ECC94B'],
//     legend: {
//       position: 'bottom',
//       fontSize: '13px',
//     },
//     plotOptions: {
//       pie: {
//         donut: {
//           size: '65%',
//           labels: {
//             show: true,
//             total: {
//               show: true,
//               label: 'Total',
//               formatter: function (w) {
//                 return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
//               }
//             }
//           }
//         }
//       }
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: function (val) {
//         return Math.round(val) + '%';
//       },
//     },
//     responsive: [{
//       breakpoint: 480,
//       options: {
//         chart: {
//           width: 280
//         },
//         legend: {
//           position: 'bottom'
//         }
//       }
//     }]
//   }), []);

//   const statusChartSeries = useMemo(() => [
//     doctorData.completedAppointments,
//     doctorData.upcomingAppointments,
//     doctorData.totalCancellations,
//     doctorData.totalRescheduled
//   ], [doctorData]);

//   // Loading state
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   // Compute appointment statuses percentage
//   const totalAppointments = doctorData.completedAppointments + 
//                           doctorData.upcomingAppointments + 
//                           doctorData.totalCancellations + 
//                           doctorData.totalRescheduled;
  
//   const cancellationRate = totalAppointments 
//     ? Math.round((doctorData.totalCancellations / totalAppointments) * 100) 
//     : 0;
  
//   const rescheduledRate = totalAppointments 
//     ? Math.round((doctorData.totalRescheduled / totalAppointments) * 100) 
//     : 0;

//   return (
//     <div className="row g-3">
//       {/* Doctor Sales Statistics */}
//       <div className="col-md-12">
//         <div className="card h-100">
//           <div className="card-body">
//             <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-4">
//               <h6 className="fw-bold text-lg mb-0">Doctor Appointments & Revenue</h6>
//               <select 
//                 className="form-select form-select-sm w-auto bg-base border text-secondary-light"
//                 value={timeFilter}
//                 onChange={(e) => setTimeFilter(e.target.value)}
//               >
//                 <option value="Daily">Today</option>
//                 <option value="Weekly">Weekly</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Yearly">Yearly</option>
//               </select>
//             </div>

//             {/* Summary Boxes */}
//             <div className="row g-3 mb-4">
//               <StatsCard 
//                 title="Total Revenue" 
//                 value={`$${doctorData.totalRevenue.toLocaleString()}`} 
//                 description="From all appointments" 
//                 bgColor="bg-primary-50" 
//                 textColor="text-primary-600" 
//                 icon="💰"
//               />
//               <StatsCard 
//                 title="Total Appointments" 
//                 value={totalAppointments} 
//                 description="Across all doctors" 
//                 bgColor="bg-info-50" 
//                 textColor="text-info-600"
//                 icon="📅"
//               />
//               <StatsCard 
//                 title="Cancellation Rate" 
//                 value={`${cancellationRate}%`} 
//                 description="Of total appointments" 
//                 bgColor="bg-danger-50" 
//                 textColor="text-danger-600"
//                 icon="❌"
//               />
//               <StatsCard 
//                 title="Rescheduled Rate" 
//                 value={`${rescheduledRate}%`} 
//                 description="Of total appointments" 
//                 bgColor="bg-warning-50" 
//                 textColor="text-warning-600"
//                 icon="🔄"
//               />
//             </div>

//             {/* Monthly Chart and Status Breakdown */}
//             <div className="row g-3 mb-4">
//               {/* Monthly Appointments Chart */}
//               <div className="col-md-8">
//                 <div className="card h-100">
//                   <div className="card-body">
//                     <h6 className="fw-semibold mb-3">Monthly Appointments & Revenue</h6>
//                     <MonthlyAppointmentsChart 
//                       options={monthlyChartOptions} 
//                       series={monthlyChartSeries} 
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Appointment Status Breakdown */}
//               <div className="col-md-4">
//                 <div className="card h-100">
//                   <div className="card-body">
//                     <h6 className="fw-semibold mb-3">Appointment Status Breakdown</h6>
//                     <AppointmentStatusChart 
//                       options={statusChartOptions} 
//                       series={statusChartSeries} 
//                     />
//                     <div className="mt-3">
//                       <div className="d-flex justify-content-between">
//                         <span className="text-success-600 fw-semibold">Completed</span>
//                         <span>{doctorData.completedAppointments}</span>
//                       </div>
//                       <div className="d-flex justify-content-between">
//                         <span className="text-blue-600 fw-semibold">Scheduled</span>
//                         <span>{doctorData.upcomingAppointments}</span>
//                       </div>
//                       <div className="d-flex justify-content-between">
//                         <span className="text-danger-600 fw-semibold">Cancelled</span>
//                         <span>{doctorData.totalCancellations}</span>
//                       </div>
//                       <div className="d-flex justify-content-between">
//                         <span className="text-warning-600 fw-semibold">Rescheduled</span>
//                         <span>{doctorData.totalRescheduled}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Top Performing Doctors */}
//             <div className="mb-4">
//               <h6 className="fw-bold mb-3">Top Performing Doctors</h6>
//               <div className="row g-3">
//                 {doctorData.doctorBreakdown.slice(0, 3).map((doctor, index) => (
//                   <DoctorCard 
//                     key={index} 
//                     doctor={doctor} 
//                     totalBookings={totalAppointments}
//                     totalRevenue={doctorData.totalRevenue}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Detailed Doctor Table */}
//             <div>
//               <h6 className="fw-bold mb-3">All Doctors Performance</h6>
//               <div className="card">
//                 <div className="card-body">
//                   <AppointmentsTable 
//                     data={doctorData.doctorBreakdown} 
//                     totalRevenue={doctorData.totalRevenue} 
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorSalesStatistics;