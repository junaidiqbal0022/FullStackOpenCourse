import { afterEach, test, expect, describe, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ToggleBlogForm from "../components/ToggleBlogForm";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import services from "../services/blogs";
import { useState } from "react";
import {
  MemoryRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
afterEach(() => {
  cleanup();
});

describe("toggleable", () => {
  beforeEach(() => {
    vi.mock("../services/blogs", () => {
      return {
        default: {
          getAll: vi.fn().mockResolvedValue([
            {
              id: 1,
              title: "Mock blog",
              author: "Author",
              likes: 0,
              url: "tiny",
            },
          ]),
        },
      };
    });
  });
  function Wrapper() {
    const [blogs, setBlogs] = useState([]);

    return (
      <Routes>
        <Route
          path="/"
          element={
            <ToggleBlogForm
              bloServices={services}
              blogs={blogs}
              setBlogs={setBlogs}
            />
          }
        />
      </Routes>
    );
  }
  test("renders its children", () => {
    render(
      <Router>
        <Wrapper />
      </Router>,
    );
    screen.getByText("Create new Blog");
  });
});
