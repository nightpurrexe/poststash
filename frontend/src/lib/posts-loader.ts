import type { LoaderFunctionArgs } from "react-router";
import { API_BASE } from "./config";

export async function postsLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const apiUrl = new URL("/api/v1/posts", API_BASE);
  const allowedParams = ["page", "username", "category"]

  for (const key of allowedParams) {
    const value = url.searchParams.get(key)
    if (value) {
      apiUrl.searchParams.set(key, value);
    }
  }

  if (!apiUrl.searchParams.has("page")) {
    apiUrl.searchParams.set("page", "1")
  }

  const res = await fetch(apiUrl.toString())

  if (!res.ok) {
    throw new Response("Failed to fetch posts", { status: res.status })
  }

  return await res.json();
}