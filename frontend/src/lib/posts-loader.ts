import type { LoaderFunctionArgs } from "react-router";
import { API_BASE } from "./config";

export async function postsLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const postsApiUrl = new URL("/api/v1/posts", API_BASE);
  const uncategorizedPostsApiUrl = new URL("/api/v1/posts/uncategorized/count", API_BASE)
  
  const allowedParams = ["page", "username", "category"]

  for (const key of allowedParams) {
    const value = url.searchParams.get(key)
    if (value) {
      postsApiUrl.searchParams.set(key, value);
    }
  }

  if (!postsApiUrl.searchParams.has("page")) {
    postsApiUrl.searchParams.set("page", "1")
  }

  const [postsRes, uncategorizedPostsRes] = await Promise.all([
    fetch(postsApiUrl.toString()),
    fetch(uncategorizedPostsApiUrl.toString())
  ])

  if (!postsRes.ok || !uncategorizedPostsRes) {
    throw new Response("Failed to fetch posts", { status: !postsRes.ok ? postsRes.status : uncategorizedPostsRes.status })
  }

  const [posts, uncategorizedPostsCount] = await Promise.all([
    postsRes.json(),
    uncategorizedPostsRes.json()
  ])

  return {
    posts,
    uncategorizedPostsCount
  }
}