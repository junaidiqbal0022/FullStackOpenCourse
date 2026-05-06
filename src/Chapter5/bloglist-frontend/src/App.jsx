import BlogAppLogic from "./components/BlogAppLogic";
import { useEffect, useState } from "react";
import services from "./services/blogs";
import Blog from "./components/Blog";
import { useNavigate } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
} from "react-router-dom";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import Login from "./components/login";
import Logout from "./components/Logout";
import Notify from "./components/Notify";
import BlogForm from "./components/BlogForm";
const App = () => {
  const [user, setUser] = useState();
  const [ready, setReady] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState({
    msg: "",
    severity: "success",
    autoClear: true,
  });
  const nav = useNavigate();
  const match = useMatch("/blogs/:id");
  const blog = match
    ? blogs?.blogs?.find((b) => String(b.id) === match.params.id)
    : null;
  const onLogout = () => {
    console.log("onLogout");
    services.setToken();
    setUser();
  };
  useEffect(() => {
    console.log("user is ", user);
    services.setToken(user?.token);
    setReady(!!user);
  }, [user]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            onClick={() => {
              nav("/");
            }}
            color="inherit"
            variant="h6"
            to="/"
            sx={{ flexGrow: 1 }}
          >
            Blog App
          </Typography>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          {!ready && (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
          {ready && (
            <>
              <Button color="inherit" component={Link} to="/logout">
                logout
              </Button>
              <Button color="inherit" component={Link} to="/createBlog">
                Create Blog
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Notify notification={notification} setNotification={setNotification} />

      <Routes>
        <Route
          path="/"
          element={
            <BlogAppLogic
              user={user}
              onLogout={onLogout}
              blogs={blogs}
              setBlogs={setBlogs}
              services={services}
              setNotification={setNotification}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login setNotification={setNotification} setUser={setUser} />
          }
        />
        <Route path="/logout" element={<Logout onLogout={onLogout} />} />
        <Route
          path="/createBlog"
          element={
            <BlogForm
              blogs={blogs}
              setBlogs={setBlogs}
              bloServices={services}
              setNotification={setNotification}
            />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              user={user}
              blog={blog}
              blogServices={services}
              setBlogs={setBlogs}
              setNotification={setNotification}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
