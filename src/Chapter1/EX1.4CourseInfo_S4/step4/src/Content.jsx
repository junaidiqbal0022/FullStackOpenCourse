export const Content = (props) => {
  return (
    <>
      {props.parts.map((exercise, index) => {
        return (
          <div key={index}>
            {console.log(`at index ${index}, we have ${exercise.name} with ${exercise.exercises} exercises`)}
            {exercise.name} {exercise.exercises}
          </div>
        );
      })}
    </>
  );
};
