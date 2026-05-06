import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
const Blogs = ({ blogService, blogs, setBlogs, setNotification }) => {
  useEffect(() => {
    const getData = async () => {
      try {
        console.log("We try get data now");
        const data = await blogService.getAll();
        console.log("getall", data);
        const dataSorted = {
          ...data,
          blogs: data.sort((a, b) => b.likes - a.likes),
        };

        setBlogs(dataSorted);
      } catch (err) {
        console.log(`error ${err}`);
        setNotification({
          msg: `Error: ${err.name} ${err.message}`,
          severity: "error",
        });
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogService]);

  return (
    <div>
      {blogs?.blogs?.length > 0 ? (
        <>
          <h3>Blogs</h3>
          <hr
            style={{
              border: "1px solid #000000",
              margin: "10px 0",
              width: "60%",
              justifyContent: "left",
              alignItems: "left",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Likes</TableCell>
                    <TableCell>Added By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blogs.blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                      </TableCell>
                      <TableCell>{blog.author}</TableCell>
                      <TableCell>{blog.likes}</TableCell>

                      <TableCell>{blog.user?.name ?? "Unknown"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* {blogs.blogs.map((blog) => (
              <div key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} by {blog.author}
                </Link>
                <hr
                  style={{
                    border: "1px solid #ddd",
                    margin: "10px 0",
                    width: "50%",
                    justifyContent: "left",
                    alignItems: "left",
                  }}
                />
              </div>
            ))} */}
          </div>
        </>
      ) : (
        <div style={{ marginTop: 20 }}>No blogs to Display</div>
      )}
    </div>
  );
};

export default Blogs;
