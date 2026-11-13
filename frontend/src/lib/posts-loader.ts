import { API_BASE } from "./config";

export async function postsLoader() {
  const apiUrl = new URL("/api/v1/posts", API_BASE);

  const res = await fetch(apiUrl.toString())

  if (!res.ok) {
    throw new Response("Failed to fetch posts", { status: res.status })
  }

  return await res.json();
}