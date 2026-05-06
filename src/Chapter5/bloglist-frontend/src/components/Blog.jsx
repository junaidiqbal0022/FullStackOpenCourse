import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Link } from "@mui/material";
const Blog = ({ blog, user, blogServices, setBlogs, setNotification }) => {
  if (!blog) {
    return <>Blog With Id Not Found</>;
  }
  const nav = useNavigate();
  const id = useParams().id;

  const timeoutRef = useRef(null);
  const onClickDelete = async () => {
    console.log("We gonna delete some blogs");
    const conf = window.confirm(
      `Really want to delete awesome blog ${blog.title} by lagendary ${blog.auth}`,
    );
    console.log(`User has give his whatever anwser: ${conf}`);
    if (!conf) {
      setNotification({ msg: "user has shown mercy", severity: "info" });
      return;
    }
    console.log("user has not heart");

    try {
      await blogServices.deleteBlog(blog.id);
      setNotification({
        msg: `"Someone" deleted the title: ${blog.title}, now ${blog.author} is crying...`,
        severity: "info",
      });
      setBlogs((prev) => ({
        ...prev,
        blogs: prev.blogs
          .filter((b) => b.id !== blog.id)
          .sort((a, b) => b.likes - a.likes),
      }));
      nav("/");
    } catch (err) {
      console.log("error in delete: ", err);
      setNotification({
        msg: `Error: ${err.name} ${err.message}`,
        severity: "error",
      });
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

      setNotification({
        msg: "Successfully liked the blog..",
        severity: "success",
      });
      timeoutRef.current = setTimeout(() => {
        setNotification({ msg: "", severity: "success" });
      }, 5000);
    } catch (err) {
      console.log("error ", err);
      setNotification({
        msg: `Error: ${err.name} ${err.message}`,
        severity: "error",
      });
    }
  };
  return (
    <div style={{ marginTop: 20 }}>
      {/* <div style={{ display: "flex", gap: 10 }}>
        Id: {blog.id}
        <Button onClick={() => nav("/")}>Hide</Button>
      </div> */}
      <Typography component="h5" variant="h5">
        {blog.title}
      </Typography>
      <Typography variant="subtitle1">by {blog.author}</Typography>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={blog.url.startsWith("http") ? blog.url : `http://${blog.url}`}
      >
        {blog.url}
      </Link>
      <Typography variant="subtitle1">
        Added by {blog.user?.name ?? "Unknown"}
      </Typography>
      <Typography variant="subtitle1">{blog.likes} Likes</Typography>
      {user && blog && user.id !== blog.user?.id && (
        <>
          <Button
            style={{ marginLeft: 10 }}
            variant="outlined"
            onClick={onLikeClick}
          >
            Like
          </Button>
        </>
      )}
      {user && blog && user.id === blog.user?.id && (
        <Button
          variant="outlined"
          style={{ marginTop: 10, marginLeft: 10 }}
          color="error"
          onClick={onClickDelete}
        >
          Remove
        </Button>
      )}
    </div>
  );
};

export default Blog;
