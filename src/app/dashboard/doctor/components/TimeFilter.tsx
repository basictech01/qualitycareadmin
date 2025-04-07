
"use client";

import React from 'react';
import { TimeFilterProps } from '@/utils/types';


const TimeFilter: React.FC<TimeFilterProps> = ({title, value, onChange }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="card-title">{title}</h4>
      <select 
        className="form-select form-select-sm w-auto"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="Daily">Today</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
      </select>
    </div>
  );
};

export default TimeFilter;
