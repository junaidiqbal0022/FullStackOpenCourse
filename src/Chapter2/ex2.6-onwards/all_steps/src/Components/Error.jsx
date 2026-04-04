const Error = ({ errorMessage }) => {
  const style = {
    color: "red",
    backgroundColor: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    background: "white",
  };
  if (errorMessage) {
    {
      console.log("rendering error component with message", errorMessage);
    }
    return <div style={style}>{errorMessage}</div>;
  }
  return null;
};

export default Error;
