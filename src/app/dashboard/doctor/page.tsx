
"use client";
import { useState, useEffect, useMemo } from 'react';
import { get } from '@/utils/network';
import { ApexOptions } from 'apexcharts';
import TimeFilter from './components/TimeFilter';
import OverallStatsCards from './components/OverallStatsCards';
import MonthlySalesChart from './components/MonthlySalesChart';
import DoctorPerformanceTable from './components/DoctorPerformanceTable';
import { DoctorBookingData, DoctorStats, MonthlySalesData } from '@/utils/types';

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
    // Process data as before, then update state...
    // (You can use the same logic as in your current code.)
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
