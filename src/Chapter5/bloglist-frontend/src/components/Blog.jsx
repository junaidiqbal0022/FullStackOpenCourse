import { useState, useRef } from "react";
import Notify from "./Notify";
import { useParams, useNavigate } from "react-router-dom";
const Blog = ({ blog, user, blogServices, setBlogs, setErrorWithTimeout }) => {
  if (!blog) {
    return <>Blog With Id Not Found</>;
  }
  const nav = useNavigate();
  const id = useParams().id;
  const [error, setError] = useState("");
  const [color, setColor] = useState("red");
  // const [fullyvisible, setFullyvisible] = useState(false);
  const errorWithTimeout = (msg, color = "green") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError(msg);
    setColor(color);
    timeoutRef.current = setTimeout(() => {
      setError("");
    }, 5000);
  };
  // let fullStyle = { display: fullyvisible ? "" : "none" };
  // let titleStyle = {
  //   display: fullyvisible ? "none" : "flex",
  //   gap: 10,
  // };
  const timeoutRef = useRef(null);
  const onClickDelete = async () => {
    console.log("We gonna delete some blogs");
    const conf = window.confirm(
      `Really want to delete awesome blog ${blog.title} by lagendary ${blog.auth}`,
    );
    console.log(`User has give his whatever anwser: ${conf}`);
    if (!conf) {
      errorWithTimeout("user has shown mercy");
      return;
    }
    console.log("user has not heart");

    try {
      await blogServices.deleteBlog(blog.id);
      setErrorWithTimeout(
        `"Someone" deleted the title: ${blog.title}, now ${blog.author} is crying...`,
      );
      setBlogs((prev) => ({
        ...prev,
        blogs: prev.blogs
          .filter((b) => b.id !== blog.id)
          .sort((a, b) => b.likes - a.likes),
      }));
      nav("/");
    } catch (err) {
      console.log("error in delete: ", err);
      setError(`Error: ${err.name} ${err.message}`);
      setColor("red");
    }
  };

  const onLikeClick = async (event) => {
    event.preventDefault();
    try {
      if (timeoutRef?.current) {
        console.log("Clear timeout");
        clearTimeout(timeoutRef.current);
      }
      const newBlog = { ...blog, likes: blog.likes + 1 };
      console.log("new blog:, ", newBlog);
      await blogServices.updateBlogs(newBlog);

      console.log("You are a liker....");
      setBlogs((prev) => ({
        ...prev,
        blogs: prev.blogs
          .map((b) => (b.id === newBlog.id ? newBlog : b))
          .sort((a, b) => b.likes - a.likes),
      }));

      setError("Successfully liked the blog..");
      setColor("green");
      timeoutRef.current = setTimeout(() => {
        setError("");
        setColor("");
      }, 5000);
    } catch (err) {
      console.log("error ", err);
      setError(`Error: ${err.name} ${err.message}`);
      setColor("red");
    }
  };
  return (
    <div style={{ marginTop: 20 }}>
      <Notify msg={error} color={color} />
      {/* <div style={titleStyle}>
        {blog.title} by {blog.author}
        <button onClick={() => setFullyvisible(!fullyvisible)}>View</button>
      </div>
      <div style={fullStyle}> */}
      <div style={{ display: "flex", gap: 10 }}>
        Id: {blog.id}
        {/* <button onClick={() => setFullyvisible(!fullyvisible)}>Hide</button> */}
        <button onClick={() => nav("/")}>Hide</button>
      </div>
      Title: {blog.title}
      <br />
      Author: {blog.author}
      <br />
      Link:{blog.url}
      <br />
      Likes: {blog.likes}
      {user && blog && user.id !== blog.user && (
        <>
          <button style={{ marginLeft: 10 }} onClick={onLikeClick}>
            Like
          </button>
        </>
      )}
      <br />
      {user && blog && user.id === blog.user && (
        <button
          style={{ marginTop: 10, marginLeft: 10 }}
          onClick={onClickDelete}
        >
          Remove
        </button>
      )}
      {/* </div> */}
    </div>
  );
};

export default Blog;
