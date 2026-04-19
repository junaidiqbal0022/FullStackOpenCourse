import { afterEach, test, expect, describe, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ToggleBlogForm from "../components/ToggleBlogForm";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import services from "../services/blogs";
import { useState } from "react";
import userEvent from '@testing-library/user-event'
afterEach(() => {
  cleanup();
});

describe("toggleable", () => {
  beforeEach(() => {
    vi.mock("../services/blogs", () => {
      return {
        default: {
          getAll: vi.fn(),
          create: vi.fn().mockImplementation(async(data)=>{
            return ({
              author: data.author,
              id: crypto.randomUUID(),
              title:data.title,
              likes:0,
              url:data.url
            })
        })
        },
      };
    });
    services.create.mockClear();
    services.getAll.mockClear();
  });
  function Wrapper() {
    const [blogs, setBlogs] = useState([]);

    return(
      <ToggleBlogForm
        bloServices={services}
        blogs={blogs}
        setBlogs={setBlogs}
      />,
    );
  }
  test("renders its children", () => {
     render(<Wrapper />);
     screen.debug()
    screen.getByText("Create new Blog");
  }); 
  
  test("Open form",async () => {
     render(<Wrapper />);

    const user = userEvent.setup()
    
    const btn = screen.getByText("Create new Blog");
    await user.click(btn);
    const btn2 = screen.getByText("submit the form");

  });
  test("Open and submit form", async() => {
     render(<Wrapper />);
    screen.debug()

    const user = userEvent.setup()
    const btn = screen.getByText("Create new Blog");
    await user.click(btn);
    const btn2 = screen.getByText("submit the form");
     expect(btn2).toBeVisible()
    await user.click(btn2)
    expect(services.create.mock.calls).toHaveLength(0)

  });
  
  test("Submit Successfully", async() => {
     render(<Wrapper />);

    const user = userEvent.setup()
    
    const btn = screen.getByText("Create new Blog");
    await user.click(btn);
    const btn2 = screen.getByText("submit the form");
     expect(btn2).toBeVisible()
    const title = screen.getByPlaceholderText("write title here")
    const author = screen.getByPlaceholderText("write author here")
    const url = screen.getByPlaceholderText("write url here")
    await user.type(title, 'testing a form...')
    await user.type(author, 'testing a form...')
    await user.type(url, 'testing:3000')
    await user.click(btn2)
    expect(services.create.mock.calls).toHaveLength(1)

  });
  
test("Validate Create Args", async() => {
    render(<Wrapper />);
    
        const user = userEvent.setup()
        
        const btn = screen.getByText("Create new Blog");
        await user.click(btn);

        const btn2 = screen.getByText("submit the form");
         expect(btn2).toBeVisible()
        const title = screen.getByPlaceholderText("write title here")
        const author = screen.getByPlaceholderText("write author here")
        const url = screen.getByPlaceholderText("write url here")
        await user.type(title, 'testing a form title...')
        await user.type(author, 'testing a form...')
        await user.type(url, 'testing:3000')
        await user.click(btn2)
        expect(services.create.mock.calls).toHaveLength(1)
        //author, title, url
        console.log(services.create.mock.calls);
      expect(services.create).toHaveBeenCalledWith(
            "testing a form...",
             "testing a form title...",
            "testing:3000"
      );
    
})


});
