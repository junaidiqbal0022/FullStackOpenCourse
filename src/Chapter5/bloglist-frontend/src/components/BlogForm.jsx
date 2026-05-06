import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, TextField } from "@mui/material";

const BlogForm = ({ bloServices, blogs, setBlogs, setNotification }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");
  const nav = useNavigate();
  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!author?.trim()) {
      console.log("author is empty");
      setNotification({ msg: "Author is empty", severity: "error" });
      return;
    }
    if (!url?.trim()) {
      console.log("url is empty");
      setNotification({ msg: "URL is empty", severity: "error" });
      return;
    }
    if (!title?.trim()) {
      console.log("title is empty");
      setNotification({ msg: "Title is empty", severity: "error" });
      return;
    }
    try {
      console.log(`got title ${title}, author: ${author} url: ${url}`);
      const resp = await bloServices.create(author, title, url);
      console.log("response is: ", resp);
      var newBlog = {
        author: resp.author,
        title: resp.title,
        url: resp.url,
        likes: resp.likes,
        id: resp.id,
      };
      const newCopy = [...blogs.blogs, newBlog];
      setBlogs({
        ...blogs,
        blogs: newCopy.sort((a, b) => b.likes - a.likes),
      });
      setNotification({
        msg: `New Blog ${resp.title}! by ${blogs.name} Added`,
        severity: "success",
      });
      setTimeout(() => {
        setNotification({ msg: "", severity: "success" });
      }, 5000);
      setAuthor("");
      setTitle("");
      setUrl("");
      nav("/");
    } catch (err) {
      console.log("error", err);
      setNotification({
        msg: `Error: ${err.name} ${err.message}`,
        severity: "error",
      });
    }
  };
  return (
    <Container style={{ marginLeft: 20 }} align="left" maxWidth="sm">
      <h5>Create New Blog</h5>
      <form
        onSubmit={onFormSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <TextField
          value={title}
          required
          placeholder="write title here"
          label="Title"
          onChange={({ target }) => setTitle(target.value)}
        />

        <TextField
          type="text"
          required
          value={author}
          placeholder="write author here"
          label="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />

        <TextField
          type="url"
          required
          label="URL"
          placeholder="write url here"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button variant="contained" style={{ maxWidth: "30%" }} type="submit">
          Create
        </Button>
      </form>
    </Container>
  );
};
export default BlogForm;
