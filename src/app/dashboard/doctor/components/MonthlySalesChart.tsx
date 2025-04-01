
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { MonthlySalesChartProps } from '@/utils/types';


// Dynamically import ApexCharts
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });



const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({ options, series }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Monthly Sales Overview</h5>
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
};

export default MonthlySalesChart;
