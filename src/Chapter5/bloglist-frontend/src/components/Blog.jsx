const Blog = ({ blog }) => (
  <div>
    Id: {blog.id}
    <br />
    Title: {blog.title}
    <br />
    Link:{blog.url}
    <br />
    Likes: {blog.likes}
  </div>
);

export default Blog;
