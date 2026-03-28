import { Header } from "./Header";
import { Content } from "./Content";
import { Total } from "./Total";

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;
  const exercises = [
    {
      exerciseCount: exercises1,
      part: part1,
    },
    {
      exerciseCount: exercises2,
      part: part2,
    },
    {
      exerciseCount: exercises3,
      part: part3,
    },
  ];
  return (
    <div>
      <Header course={course} />
      <Content exercises={exercises} />
      <Total total={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

export default App;
