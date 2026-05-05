import { useEffect, useState } from "react";
import Blogs from "./Blogs";
import Login from "./login";
import ToggleBlogForm from "./ToggleBlogForm";

const BlogAppLogic = ({ user, onLogout, blogs, setBlogs, services }) => {
  return (
    <div style={{ marginLeft: 50 }}>
      {/* <ToggleBlogForm
        blogs={blogs}
        setBlogs={setBlogs}
        bloServices={services}
      /> */}
      <Blogs
        user={user}
        blogs={blogs}
        setBlogs={setBlogs}
        onLogout={onLogout}
        blogService={services}
      />
    </div>
  );
};
export default BlogAppLogic;
