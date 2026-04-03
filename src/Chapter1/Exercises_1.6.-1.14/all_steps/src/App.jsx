import { useState } from "react";
import { Button } from "./Button";
import { Statistics } from "./Statistics";
import { StatisticLine } from "./StatisticLine";
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
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [selected, setSelected] = useState(0);
  const onNextAnecdote = () => {
    const num = Math.floor(Math.random() * anecdotes.length);
    setSelected(num);
    console.log(`selected: ${num} anecdote: ${anecdotes[num]}`);
  };
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const onVote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
    console.log(
      `vote for: ${anecdotes[selected]}, Now it has ${copy[selected]} votes`,
    );
  };
  const handleMostVoteCalc = () => {
    const maxVotes = Math.max(...votes);
    const indexOfMaxVotes = votes.indexOf(maxVotes);
    var msg = `${anecdotes[indexOfMaxVotes]} with ${maxVotes} votes`;
    console.log(msg);
    return msg;
  };
  return (
    <>
      {/* // <div>
    //   <h1>give feedback</h1>
    //   <button onclick={() => ongood(good)} text="good" />
    //   <button onclick={() => onneutral(neutral)} text="neutral" />
    //   <button onclick={() => onbad(bad)} text="bad" />
    //   <statistics good={good} neutral={neutral} bad={bad} all={all} />
    // </div> */}
      <h1>Anecdote of the Day</h1>
      <div>{anecdotes[selected]}</div>
      <StatisticLine text="has votes" value={votes[selected]} />

      <Button text="next anecdote" onClick={onNextAnecdote}></Button>
      <Button text="vote" onClick={onVote}></Button>
      <h1>Anecdote with Most Votes</h1>

      <StatisticLine value={handleMostVoteCalc()} />
    </>
  );
};

export default App;
