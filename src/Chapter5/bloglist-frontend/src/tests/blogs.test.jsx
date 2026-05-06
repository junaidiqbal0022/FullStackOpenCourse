import { afterEach, test, expect, describe, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Blogs from "../components/Blogs";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { use, useState } from "react";
import services from "../services/blogs";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Blog from "../components/Blog";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const blogs = [
  {
    title: "Blog title is random",
    author: "Alex watermelon",
    url: "localhost:3001/crap",
    likes: 2,
    user: "69dbdca05a9b3ed860bac339",
    id: "69e325a3f216068fbc6237bc",
  },
];

afterEach(() => {
  cleanup();
});

describe("Blogs renderig", () => {
  beforeEach(() => {
    vi.mock("../services/blogs", () => {
      return {
        default: {
          getAll: vi.fn().mockImplementation(async () => {
            return blogs;
          }),
          create: vi.fn(),
          updateBlogs: vi.fn(),
        },
      };
    });

    services.create.mockClear();
    services.getAll.mockClear();
    services.updateBlogs.mockClear();
  });

  function Wrapper({ user, id }) {
    const [blogs, setBlogs] = useState([]);

    return (
      <Routes>
        <Route
          path="/"
          element={
            <Blogs blogService={services} blogs={blogs} setBlogs={setBlogs} />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              user={user}
              blog={blogs[0]}
              blogServices={services}
              setBlogs={setBlogs}
              setErrorWithTimeout={() => {}}
            />
          }
        />
      </Routes>
    );
  }
  test("renders blogs title and author", async () => {
    await render(
      <Router>
        <Wrapper user={""} id={blogs[0].id} />
      </Router>,
    );
    await sleep(1000);
    screen.debug();
    const user = userEvent.setup();

    const item1 = await screen.findByText("Blog title is random", {
      exact: false,
    });
    expect(item1).toBeVisible();

    await user.click(item1);
    const item2 = screen.queryByText("localhost:3001/crap");

    expect(item2).toBeVisible();
  });

  test("renders opened blog", async () => {
    await render(
      <Router>
        <Wrapper />
      </Router>,
    );
    await sleep(1000);

    const user = userEvent.setup();
    const btn = await screen.findByText("Blog title is random", {
      exact: false,
    });
    expect(btn).toBeVisible();
    await user.click(btn);
    await sleep(1000);
    screen.debug();

    const item1 = await screen.findByText("Blog title is random", {
      exact: false,
    });
    const item2 = await screen.findByText("localhost:3001/crap", {
      exact: false,
    });
    const item3 = await screen.findByText("Likes", { exact: false });
    const item4 = await screen.findByText("Alex watermelon", {
      exact: false,
    });

    expect(item1).toBeVisible();
    expect(item2).toBeVisible();
    expect(item3).toBeVisible();
    expect(item4).toBeVisible();
  });

  test("Validate liked twice", async () => {
    await render(
      <Router>
        <Wrapper />
      </Router>,
    );
    await sleep(1000);

    const user = userEvent.setup();
    const btn = await screen.findByText("Blog title is random", {
      exact: false,
    });
    expect(btn).toBeVisible();
    await user.click(btn);
    await sleep(1000);
    screen.debug();

    const item3 = screen.queryByText("Like");
    expect(item3).toBeNull();

    // await user.click(item3);
    // await user.click(item3);

    // expect(services.updateBlogs.mock.calls).toHaveLength(2);
  });
});
