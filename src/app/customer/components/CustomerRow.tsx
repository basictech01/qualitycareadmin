
"use client";
import React from "react";
import { CustomerRowProps } from "@/utils/types";

const CustomerRow: React.FC<CustomerRowProps> = ({ user, expandedUser, toggleDetails, getInitials }) => {
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center" style={{ gap: "8px" }}>
          <div
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#666",
              border: "1px solid #eaeaea",
            }}
          >
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              getInitials(user.full_name)
            )}
          </div>
        </div>
      </td>
      <td>{user.id}</td>
      <td>{user.full_name}</td>
      <td>{user.email_address}</td>
      <td>{user.phone_number}</td>
      <td>{user.points}</td>
      <td>{user.redeemed ? "Yes" : "No"}</td>
      <td>{user.total_visits}</td>
      <td>
        <button
          style={{
            border: "none",
            background: expandedUser === user.id ? "#007bff" : "#f0f0f0",
            color: expandedUser === user.id ? "white" : "black",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "12px",
          }}
          onClick={() => toggleDetails(user.id)}
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

export default CustomerRow;
