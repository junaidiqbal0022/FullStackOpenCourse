import { afterEach, test, expect, describe, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Blogs from "../components/Blogs";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { useState } from "react";
import services from '../services/blogs'
import userEvent from '@testing-library/user-event'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const blogs={
                username: "root",
                name: "root",
                "id": "69e31d35145dcb5a4977edaf",
                blogs: [
                    {
                        title: "Blog title is random",
                        author: "Alex watermelon",
                        url: "localhost:3001/crap",
                        likes: 2,
                        id: "69e325a3f216068fbc6237bc"
                    }]
            }

afterEach(() => {
  cleanup();
});
describe("Blogs renderig", () => {
   beforeEach(() => {
    vi.mock("../services/blogs", () => {
      return {
        default: {
          getAll: vi.fn().mockImplementation(async()=>{
            return (blogs)
          
        }),
          create: vi.fn(),
          updateBlogs: vi.fn()
        },
      };
    });

        services.create.mockClear();
        services.getAll.mockClear();
        services.updateBlogs.mockClear();
  });
  
  function Wrapper() {
    const [blogs, setBlogs] = useState([]);
    
    return(
      <Blogs
        blogService={services}
        blogs={blogs}
        setBlogs={setBlogs}
      />,
    );
  }
  test("renders blogs title and author", async() => {
    
     render(<Wrapper  />);
     await sleep(1000);
     screen.debug()
     
    const item1= await screen.findByText("Blog title is random by Alex watermelon")
    const item2=  screen.queryByText ("localhost:3001/crap")

    expect(item1).toBeVisible();
    expect(item2).toBeNull()
})

 test("renders opened blog", async() => {
    
     render(<Wrapper  />);
     await sleep(1000);

    const user = userEvent.setup()
    const btn = await screen.findByText("View");
    expect(btn).toBeVisible();
    await user.click(btn);
     await sleep(1000);
    screen.debug()

    const item1= await screen.findByText("Title: Blog title is random", {exact: false})
    const item2= await screen.findByText ("Link:localhost:3001/crap", {exact: false})
    const item3= await screen.findByText ("Likes: ", {exact: false})
    const item4= await screen.findByText ("Author: Alex watermelon", {exact: false})

    expect(item1).toBeVisible();
    expect(item2).toBeVisible();
    expect(item3).toBeVisible();
    expect(item4).toBeVisible();
})

 test("Validate liked twice", async() => {
    
     render(<Wrapper  />);
     await sleep(1000);

    const user = userEvent.setup()
    const btn = await screen.findByText("View");
    expect(btn).toBeVisible();
    await user.click(btn);
     await sleep(1000);
    screen.debug()

    const item3= await screen.findByText ("Like", {exact: true})
    expect(item3).toBeVisible();

    await user.click(item3);
    await user.click(item3);

    expect(services.updateBlogs.mock.calls).toHaveLength(2)
    
})

})
