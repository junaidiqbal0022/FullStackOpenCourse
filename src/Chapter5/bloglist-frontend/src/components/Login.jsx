import { useState } from "react";
import services from "../services/blogs";
import Notify from "./Notify";
const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const user = await services.login(username, password);
      console.log(`got ${user} with ${username} and  ${password}`);
      setUser(user);
    } catch (err) {
      console.log(`error ${err}`);
      setError(`Error: ${err.name} ${err.message}`);
      new Notification(err);
    }
  };
  return (
    <>
      <h2>Login</h2>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div>
          <label style={{ display: "flex", gap: "10px" }}>
            Username
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label style={{ display: "flex", gap: "10px" }}>
            Password
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button style={{ width: 200 }} type="submit">
          login
        </button>
      </form>
      <Notify msg={error} color="red" />
    </>
  );
};

export default Login;
