export const Content = (props) => {
  return (
    <>
      <p>
        {props.exercises[0].part} {props.exercises[0].exerciseCount}
        <br />
        {props.exercises[1].part} {props.exercises[1].exerciseCount}
        <br />
        {props.exercises[2].part} {props.exercises[2].exerciseCount}
      </p>
    </>
  );
};
