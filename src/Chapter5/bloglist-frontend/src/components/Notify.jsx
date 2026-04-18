const Notify = ({ msg, color }) => {
  console.log(`received msg:${msg}, color:${color}`);
  if (!msg || typeof msg !== "string" || msg.trim() === "") {
    return null;
  }
  return (
    <>
      <h4
        style={{
          color: color ?? "red",
          backgroundColor: "rgba(175,250,250,0.5)",
          borderRadius: 3,
          border: "1px solid black",
          flex: 1,
          justifyContent: "center",
          margin: 10,
          padding: 10,
        }}
      >
        {msg}
      </h4>
    </>
  );
};

export default Notify;
