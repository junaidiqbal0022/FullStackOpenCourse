import React from "react";

export const StatisticLine = ({ text, value, percentage }) => {
  return (
    <div>
      {text} : {value}
      {percentage ? "%" : ""}
    </div>
  );
};
