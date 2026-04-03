import { useState } from "react";
import { Display } from "./Display";
import { Button } from "./Button";
const App = () => {
  const Feedback = {
    GOOD: "good",
    NEUTRAL: "neutral",
    BAD: "bad",
  };
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState([]);
  const onGood = (value) => {
    var tempSet = value + 1;
    setGood(tempSet);
    setAll(all.concat(Feedback.GOOD));
  };
  const onNeutral = (value) => {
    var tempSet = value + 1;
    setNeutral(tempSet);
    setAll(all.concat(Feedback.NEUTRAL));
  };
  const onBad = (value) => {
    var tempSet = value + 1;
    setBad(tempSet);
    setAll(all.concat(Feedback.BAD));
  };
  const handleAverage = () => {
    if (all.length === 0) {
      return "average 0";
    }
    var average = (good - bad) / all.length;
    console.log(
      `good: ${good}, bad: ${bad}, all: ${all.length}, average: ${average}`,
    );
    return `average ${average}`;
  };
  const handlePositive = () => {
    if (all.length === 0) {
      return "positive 0%";
    }
    var positive = (good / all.length) * 100;
    console.log(
      `good: ${good}, bad: ${bad}, all: ${all.length}, positive: ${positive}`,
    );
    return `positive ${positive}%`;
  };
  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => onGood(good)} text="good" />
      <Button onClick={() => onNeutral(neutral)} text="neutral" />
      <Button onClick={() => onBad(bad)} text="bad" />
      <h1>statistics</h1>
      <Display text={`good ${good}`} />
      <Display text={`neutral ${neutral}`} />
      <Display text={`bad ${bad}`} />
      <Display text={`all ${all.length}`} />
      <Display text={handleAverage()} />
      <Display text={handlePositive()} />
    </div>
  );
};

export default App;
