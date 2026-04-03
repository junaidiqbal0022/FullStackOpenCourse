import { Header } from "./components/Header";
import Content from "./components/Content";
import Total from "./components/Total";
const Course = ({ course }) => {
  const handleTotal = () => {
    var sum = 0;
    for (var i = 0; i < course.parts.length; i++) {
      sum += course.parts[i].exercises;
    }
    return sum;
  };
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={handleTotal()} />
    </div>
  );
};
export default Course;
