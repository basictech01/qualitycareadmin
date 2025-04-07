
"use client";
import { useState, useEffect, useMemo } from 'react';
import { get } from '@/utils/network';
import { ApexOptions } from 'apexcharts';
import TimeFilter from './components/TimeFilter';
import OverallStatsCards from './components/OverallStatsCards';
import MonthlySalesChart from './components/MonthlySalesChart';
import DoctorPerformanceTable from './components/DoctorPerformanceTable';
import {DoctorBookingData, DoctorStats, MonthlySalesData, Status } from '@/utils/types';

const DoctorAppointmentStatistics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Monthly');
  const [bookingData, setBookingData] = useState<DoctorBookingData[]>([]);
  const [doctorStats, setDoctorStats] = useState<DoctorStats[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySalesData[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalAppointments: 0,
    totalIncome: 0,
    completedIncome: 0,
    futureIncome: 0,
    cancelationRate: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await get('/booking/doctor/metric');
        processBookingData(response);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeFilter]);

  const processBookingData = (data: DoctorBookingData[]) => {
    setBookingData(data);

    // Process doctor-wise statistics
    const doctorStatsMap: { [key: number]: DoctorStats } = {};
    const monthlyStatsMap: { [key: string]: MonthlySalesData } = {};

    let totalAppointments = 0;
    let totalIncome = 0;
    let completedIncome = 0;
    let futureIncome = 0;
    let canceledAppointments = 0;

    data.forEach(booking => {
      const doctorId = booking.doctor_id;
      const sessionFees = booking.doctor_session_fees;
      const bookingDate = new Date(booking.booking_date);
      const monthKey = bookingDate.toLocaleString('default', { month: 'short' });

      // Initialize doctor stats
      if (!doctorStatsMap[doctorId]) {
        doctorStatsMap[doctorId] = {
          doctorId,
          doctorName: booking.doctor_name_en,
          totalAppointments: 0,
          completedAppointments: 0,
          canceledAppointments: 0,
          rescheduledAppointments: 0,
          totalIncome: 0,
          completedIncome: 0,
          futureIncome: 0,
          photoUrl: booking.doctor_photo_url
        };
      }

      // Monthly stats initialization
      if (!monthlyStatsMap[monthKey]) {
        monthlyStatsMap[monthKey] = {
          month: monthKey,
          totalSales: 0,
          completedSales: 0
        };
      }

      // Update doctor and monthly stats
      const doctorStat = doctorStatsMap[doctorId];
      doctorStat.totalAppointments++;
      doctorStat.totalIncome += sessionFees;
      monthlyStatsMap[monthKey].totalSales += sessionFees;

      // Handle different booking statuses
      switch (booking.booking_status) {
        case Status.Completed:
          doctorStat.completedAppointments++;
          doctorStat.completedIncome += sessionFees;
          monthlyStatsMap[monthKey].completedSales += sessionFees;
          break;
        case Status.Cancelled:
          doctorStat.canceledAppointments++;
          canceledAppointments++;
          break;
        case Status.Scheduled:
          doctorStat.futureIncome += sessionFees;
          futureIncome += sessionFees;
          break;
      }

      // Overall totals
      totalAppointments++;
      totalIncome += sessionFees;
      completedIncome += booking.booking_status === Status.Completed ? sessionFees : 0;
    });

    // Convert maps to sorted arrays
    const processedDoctorStats = Object.values(doctorStatsMap)
      .sort((a, b) => b.totalIncome - a.totalIncome);

    const processedMonthlySales = Object.values(monthlyStatsMap)
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });

    // Calculate overall stats
    const cancelationRate = totalAppointments > 0 
      ? Math.round((canceledAppointments / totalAppointments) * 100) 
      : 0;

    setDoctorStats(processedDoctorStats);
    setMonthlySales(processedMonthlySales);
    setTotalStats({
      totalAppointments,
      totalIncome,
      completedIncome,
      futureIncome,
      cancelationRate
    });
  };

  // Chart options for monthly sales
  const monthlySalesOptions:ApexOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
      },
    },
    xaxis: {
      categories: monthlySales.map(item => item.month),
      labels: { style: { colors: '#718096', fontSize: '12px' } },
    },
    yaxis: {
      title: { text: 'Sales (USD)', style: { color: '#718096' } },
      labels: {
        formatter: (value: number) => `$${value.toLocaleString()}`,
        style: { colors: '#718096', fontSize: '12px' },
      },
    },
    colors: ['#4C51BF', '#ED8936'],
    tooltip: { y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
  }), [monthlySales]);

  const monthlySalesSeries = useMemo(() => [
    { name: 'Total Sales', data: monthlySales.map(item => item.totalSales) },
    { name: 'Completed Sales', data: monthlySales.map(item => item.completedSales) },
  ], [monthlySales]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
<div className="row g-3">
  <div className="container-fluid">
    <div className="card h-100 bg-white">
      <div className="card-body">
        <TimeFilter title='Doctor Appointment Statistics' value={timeFilter} onChange={setTimeFilter} />
        <OverallStatsCards
          totalAppointments={totalStats.totalAppointments}
          totalIncome={totalStats.totalIncome}
          completedIncome={totalStats.completedIncome}
          cancelationRate={totalStats.cancelationRate}
        />
        <div className="mb-4 rpw">
          <MonthlySalesChart options={monthlySalesOptions} series={monthlySalesSeries} />
        </div>
        <DoctorPerformanceTable doctorStats={doctorStats} />
      </div>
    </div>
  </div>
</div>

  );
};

export default DoctorAppointmentStatistics;
