import React from "react";
import { StatisticLine } from "./StatisticLine ";
export const Statistics = ({ good, neutral, bad, all }) => {
  const handleAverage = () => {
    if (all.length === 0) {
      return 0;
    }
    var average = (good - bad) / all.length;
    console.log(
      `good: ${good}, bad: ${bad}, all: ${all.length}, average: ${average}`,
    );
    return average;
  };
  const handlePositive = () => {
    if (all.length === 0) {
      return positive;
    }
    var positive = (good / all.length) * 100;
    console.log(
      `good: ${good}, bad: ${bad}, all: ${all.length}, positive: ${positive}`,
    );
    return positive;
  };
  return (
    <>
      <h1>statistics</h1>
      {all.length === 0 ? (
        <p>No feedback given</p>
      ) : (
        <>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all.length} />
          <StatisticLine text="average" value={handleAverage()} />
          <StatisticLine
            text="positive"
            value={handlePositive()}
            percentage={true}
          />
        </>
      )}
    </>
  );
};
