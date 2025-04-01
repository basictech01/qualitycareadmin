"use client";

import { useState, useEffect, useMemo } from "react";
import { get } from "@/utils/network";
import TimeFilter from '../doctor/components/TimeFilter';
import SalesCard from "./components/SalesCard";
import ServiceTypeIndicator from "./components/ServiceTypeIndicator";
import ServicesTable from "./components/ServicesTable";
import MonthlySalesChart from "./components/MonthlySalesChart";
import LoadingSpinner from "./components/LoadingSpinner";
import { SalesBookingData, DoctorStats, MonthlySalesData, SalesData, ServiceData } from "@/utils/types";

const ClinicSalesStatistics = () => {
  // State for tracking time period filter
  const [timeFilter, setTimeFilter] = useState("Monthly");
  const [isLoading, setIsLoading] = useState(true);
  
  // State for API data
  const [salesData, setSalesData] = useState<SalesData>({
    totalRevenue: 0,
    completedRevenue: 0,
    upcomingRevenue: 0,
    dentalTotal: 0,
    dermatTotal: 0,
    serviceBreakdown: [],
    monthlySales: []
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await get("/booking/service/metric");
        const processedData = processAPIData(response);
        setSalesData(processedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeFilter]);

  // Process API data function
  const processAPIData = (bookingsData: SalesBookingData[]): SalesData => {
    let completedRevenue = 0;
    let upcomingRevenue = 0;
    let dentalTotal = 0;
    let dermatTotal = 0;

    // Build a service breakdown map
    const serviceMap: { [key: string]: ServiceData } = {};
    // Build monthly sales data map
    const monthlyMap: { [key: string]: { month: string; dental: number; dermatology: number } } = {};

    bookingsData.forEach((booking) => {
      const price =
        parseFloat(booking.service_discounted_price) ||
        parseFloat(booking.service_actual_price);
      const isCompleted = booking.booking_status === "COMPLETED";
      const isDental = booking.service_category_type === "DENTIST";

      if (isCompleted) {
        completedRevenue += price;
      } else if (booking.booking_status === "SCHEDULED") {
        upcomingRevenue += price;
      }

      if (isDental) {
        dentalTotal += price;
      } else {
        dermatTotal += price;
      }

      const serviceKey = booking.service_name_en;
      if (!serviceMap[serviceKey]) {
        serviceMap[serviceKey] = {
          name: serviceKey,
          category: booking.service_category_type,
          amount: 0,
          bookingsCount: 0
        };
      }
      serviceMap[serviceKey].amount += price;
      serviceMap[serviceKey].bookingsCount += 1;

      const bookingDate = new Date(booking.booking_date);
      const monthKey = bookingDate.toLocaleString("default", { month: "short" });
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, dental: 0, dermatology: 0 };
      }
      if (isDental) {
        monthlyMap[monthKey].dental += price;
      } else {
        monthlyMap[monthKey].dermatology += price;
      }
    });

    const serviceBreakdown = Object.values(serviceMap).sort((a, b) => b.amount - a.amount);

    const monthOrder = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthlySales = Object.values(monthlyMap).sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

    return {
      totalRevenue: completedRevenue + upcomingRevenue,
      completedRevenue,
      upcomingRevenue,
      dentalTotal,
      dermatTotal,
      serviceBreakdown,
      monthlySales
    };
  };

  // Memoize chart options and series to avoid unnecessary re-renders
  const monthlySalesOptions = useMemo((): any => ({
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif"
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: salesData.monthlySales.map((item) => item.month),
      labels: {
        style: {
          colors: "#718096",
          fontSize: "12px"
        }
      }
    },
    yaxis: {
      title: { text: "Sales (USD)", style: { color: "#718096" } },
      labels: {
        style: { colors: "#718096", fontSize: "12px" },
        formatter: (value: number) => "﷼" + value.toLocaleString()
      }
    },
    colors: ["#4C51BF", "#ED8936"],
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "13px",
      markers: { radius: 12 }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val: number) => "﷼" + val.toLocaleString() }
    }
  }), [salesData.monthlySales]);

  const monthlySalesSeries = useMemo(() => [
    {
      name: "Dental",
      data: salesData.monthlySales.map((item) => item.dental)
    },
    {
      name: "Dermatology",
      data: salesData.monthlySales.map((item) => item.dermatology)
    }
  ], [salesData.monthlySales]);

  const bookingConversion = salesData.totalRevenue
    ? Math.round((salesData.completedRevenue / salesData.totalRevenue) * 100)
    : 0;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="row g-3">
      <div className="col-md-12">
        <div className="card h-100 bg-white">
          <div className="card-body">
            <TimeFilter title="Sales Statistics" value={timeFilter} onChange={setTimeFilter} />
            <div className="row g-3 mb-4">
              <SalesCard
                title="Total Sales"
                value={`﷼${salesData.totalRevenue.toLocaleString()}`}
                description="Combined Revenue"
                bgColor="bg-primary-50"
                textColor="text-primary-600"
              />
              <SalesCard
                title="Completed Bookings"
                value={`﷼${salesData.completedRevenue.toLocaleString()}`}
                description="From COMPLETED status"
                bgColor="bg-success-50"
                textColor="text-success-600"
              />
              <SalesCard
                title="Upcoming Bookings"
                value={`﷼${salesData.upcomingRevenue.toLocaleString()}`}
                description="From SCHEDULED status"
                bgColor="bg-warning-50"
                textColor="text-warning-600"
              />
              <SalesCard
                title="Booking Conversion"
                value={`${bookingConversion}%`}
                description="Completed vs Total"
                bgColor="bg-info-50"
                textColor="text-info-600"
              />
            </div>

            <div className="d-flex align-items-center justify-content-center mb-4">
              <ul className="d-flex flex-wrap align-items-center gap-4 mb-0">
                <ServiceTypeIndicator
                  color="bg-primary-600"
                  label="Dental"
                  value={`﷼${salesData.dentalTotal.toLocaleString()}`}
                />
                <ServiceTypeIndicator
                  color="bg-warning-500"
                  label="Dermatology"
                  value={`﷼${salesData.dermatTotal.toLocaleString()}`}
                />
              </ul>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <MonthlySalesChart options={monthlySalesOptions} series={monthlySalesSeries} />
              </div>
              <div className="col-md-6">
                <ServicesTable data={salesData.serviceBreakdown} totalRevenue={salesData.totalRevenue} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicSalesStatistics;
