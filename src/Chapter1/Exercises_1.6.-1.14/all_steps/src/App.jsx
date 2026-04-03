import { useState } from "react";
import { Button } from "./Button";
import { Statistics } from "./Statistics";
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

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => onGood(good)} text="good" />
      <Button onClick={() => onNeutral(neutral)} text="neutral" />
      <Button onClick={() => onBad(bad)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  );
};

export default App;
