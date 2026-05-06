import { useState } from "react";
import services from "../services/blogs";
import { useNavigate } from "react-router-dom";
import { Container, Button, TextField } from "@mui/material";
const Login = ({ setUser, setNotification }) => {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const user = await services.login(username, password);
      console.log(`got ${user} with ${username} and  ${password}`);
      setUser(user);
      nav("/");
    } catch (err) {
      console.log(`error ${err}`);
      setNotification({
        msg: `Error: ${err.name} ${err.message}`,
        severity: "error",
      });
    }
  };
  return (
    <Container style={{ marginLeft: 20 }} align="left" maxWidth="sm">
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
          <TextField
            required={true}
            variant="standard"
            placeholder="UserName"
            label="UserName"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            required={true}
            variant="standard"
            type="password"
            placeholder="Password"
            label="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          <Button variant="contained" size="small" type="submit">
            login
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default Login;
