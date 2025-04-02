
"use client";
import React from "react";
import {Status, StatusBadgeProps } from "@/utils/types";

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyles = (status: Status) => {
    const styles = {
      backgroundColor: "#ffeeba",
      color: "#856404",
    };

    switch (status) {
      case Status.Completed:
        styles.backgroundColor = "#d4edda";
        styles.color = "#155724";
        break;
      case Status.Cancelled:
        styles.backgroundColor = "#f8d7da";
        styles.color = "#721c24";
        break;
      case Status.Scheduled:
        styles.backgroundColor = "#cce5ff";
        styles.color = "#004085";
        break;
      default:
        break;
    }
    return styles;
  };

  const styles = {
    padding: "2px 6px",
    borderRadius: "3px",
    fontSize: "11px",
    ...getBadgeStyles(status),
  };

  return <span style={styles}>{status}</span>;
};

export default StatusBadge;
