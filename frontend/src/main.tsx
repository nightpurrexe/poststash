import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { postsLoader } from "./lib/posts-loader.ts";
import LoadingPosts from "./components/LoadingPosts.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    loader: postsLoader,
    Component: App,
    HydrateFallback: LoadingPosts,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
