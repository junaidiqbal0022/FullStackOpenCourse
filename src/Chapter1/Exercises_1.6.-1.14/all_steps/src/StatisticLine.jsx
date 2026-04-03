import React from "react";

export const StatisticLine = ({ text, value, percentage }) => {
  return (
    <div>
      {text !== undefined ? `${text}  :` : ""} {value}
      {percentage ? "%" : ""}
    </div>
  );
};
