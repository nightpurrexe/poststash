import type { Category, CreateCategoryRequest, CreatePostRequest } from "../types";
import { API_BASE } from "./config";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: res.statusText }));
    throw new Error(
      errorData.message || `Request failed with status: ${res.status}`
    )
  }

  return res.json();
}

export const api = {
  posts: {
    create: (data: CreatePostRequest) => request("/api/v1/posts", { method: "POST", body: JSON.stringify(data) }),
    updateCategory: (id: string, categoryId: string) => request(`/api/v1/posts/${id}/category`, { method: "PATCH", body: JSON.stringify({ categoryId }) })
  },
  categories: {
    getAll: () => request<Category[]>("/api/v1/categories"),
    create: (data: CreateCategoryRequest) => request<Category[]>("/api/v1/categories", { method: "POST", body: JSON.stringify(data) })
  }
}