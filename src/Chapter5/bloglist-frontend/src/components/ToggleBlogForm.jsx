import { useState } from "react";
import BlogForm from "./BlogForm";
const ToggleBlogForm = ({ bloServices, blogs, setBlogs }) => {
  const [formvisible, setFormvisible] = useState(false);
  const showCreateButton = { display: formvisible ? "none" : "" };
  const showForm = { display: formvisible ? "" : "none" };

  return (
    <>
      <div style={showCreateButton}>
        <button onClick={() => setFormvisible(!formvisible)}>
          Create new Blog
        </button>
      </div>
      <div style={showForm}>
        <BlogForm blogs={blogs} setBlogs={setBlogs} bloServices={bloServices} />
        <button
          style={{ marginTop: 10 }}
          onClick={() => setFormvisible(!formvisible)}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default ToggleBlogForm;
