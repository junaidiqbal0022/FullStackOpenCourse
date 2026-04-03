import { Header } from "./components/Header";
import Content from "./components/Content";
import Total from "./components/Total";
const Course = ({ course }) => {
  const handleTotal = () =>
    course.parts.reduce((acc, part) => {
      console.log(
        `Before: acc: ${acc}, part: ${part.name} with ${part.exercises} exercises`,
      );
      return acc + part.exercises;
    }, 0);
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={handleTotal()} />
    </div>
  );
};
export default Course;
