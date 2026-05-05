import BlogAppLogic from "./components/BlogAppLogic";
import { useEffect, useState, useRef } from "react";
import services from "./services/blogs";
import Blog from "./components/Blog";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
} from "react-router-dom";
import Login from "./components/login";
import Logout from "./components/Logout";
import Notify from "./components/Notify";
import BlogForm from "./components/BlogForm";
const App = () => {
  const [user, setUser] = useState();
  const [ready, setReady] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState();
  const [color, setColor] = useState("red");

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
  const timeoutRef = useRef(null);

  const setErrorWithTimeout = (msg, color = "green") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError(msg);
    setColor(color);
    timeoutRef.current = setTimeout(() => {
      setError("");
    }, 5000);
  };
  const padding = {
    padding: 5,
  };
  return (
    <>
      <div>
        <Link style={padding} to="/">
          Home
        </Link>
        {!ready && (
          <Link style={padding} to="/login">
            Login
          </Link>
        )}
        {ready && (
          <>
            <Link style={padding} to="/logout">
              logout
            </Link>
            <Link style={padding} to="/createBlog">
              Create Blog
            </Link>
          </>
        )}
      </div>
      <Notify msg={error} color={color} />

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
            />
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/logout" element={<Logout onLogout={onLogout} />} />
        <Route
          path="/createBlog"
          element={
            <BlogForm
              blogs={blogs}
              setBlogs={setBlogs}
              bloServices={services}
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
              setErrorWithTimeout={setErrorWithTimeout}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
