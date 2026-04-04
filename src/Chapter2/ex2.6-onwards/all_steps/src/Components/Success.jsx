const Success = ({ successMessage }) => {
  const style = {
    color: "green",
    backgroundColor: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    background: "white",
  };
  if (successMessage) {
    {
      console.log("rendering success component with message", successMessage);
    }
    return <div style={style}>{successMessage}</div>;
  }
  return null;
};

export default Success;
