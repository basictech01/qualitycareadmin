// src/app/dashboard/sales/components/MonthlySalesChart.tsx
"use client";
import React from "react";
import dynamic from "next/dynamic";
import { MonthlySalesChartProps } from "@/utils/types";
// Dynamically import ApexCharts with no SSR
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });



const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({ options, series }) => (
  <div id="monthlySalesChart">
    <ReactApexChart options={options} series={series} type="bar" height={400} />
  </div>
);

export default MonthlySalesChart;
