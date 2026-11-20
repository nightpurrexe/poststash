import { useLoaderData, useSearchParams } from "react-router";
import type { postsLoader } from "./lib/posts-loader";
import PostCard from "./components/PostCard";
import { useEffect, useState } from "react";
import AddPostModal from "./components/AddPostModal";
import AddCategoryModal from "./components/AddCategoryModal";
import { api } from "./lib/api";
import type { Category } from "./types";
import { capitalize } from "./utils/capitalize";

export default function App() {
  const result = useLoaderData<typeof postsLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddNewPostModalOpen, setIsAddNewPostModalOpen] = useState(false);
  const [isAddNewCategoryModalOpen, setIsAddNewCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    api.categories
      .getAll()
      .then(setCategories)
      .catch(() => setCategoriesError("Could not load categories"))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const posts = result.posts.data;
  const pagination = result.posts.pagination;
  const uncategorizedPostsCount = result.uncategorizedPostsCount;

  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;
  const totalPosts = pagination.total;

  const selectedCategory =
    searchParams.get("uncategorized") === "true"
      ? "uncategorized"
      : (searchParams.get("category") ?? "");

  const applyFilter = (
    key: "username" | "category" | "uncategorized",
    value: string,
  ) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }

      if (key === "uncategorized" && value) {
        next.delete("category");
      }

      if (key === "category" && value) {
        next.delete("uncategorized");
      }

      next.delete("page");
      return next;
    });
  };

  const goToPage = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (page <= 1) {
        next.delete("page");
      } else {
        next.set("page", String(page));
      }

      return next;
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      next.delete("category");
      next.delete("uncategorized");

      if (value === "uncategorized") {
        next.set("uncategorized", "true");
      } else if (value) {
        next.set("category", value);
      }

      next.delete("page");

      return next;
    });
  };

  return (
    <div className="pb-8 max-w-7xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Saved Posts</h1>
        <button
          onClick={() => setIsAddNewPostModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Post
        </button>
      </header>

      <div className="flex justify-between items-center gap-4 mb-6">
        <p className="leading-none">
          {uncategorizedPostsCount} Uncategorized posts
        </p>
        <div>
          <input
            type="text"
            className="border rounded px-3 py-1 mr-3"
            placeholder="Filter by username"
            value={searchParams.get("username") ?? ""}
            onChange={(e) => applyFilter("username", e.target.value)}
          />
          <select
            className="border rounded px-3 py-1 mr-3"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {capitalize(category.name)}
              </option>
            ))}
            <option value="uncategorized">Uncategorized</option>
          </select>
          <button
            onClick={() => setIsAddNewCategoryModalOpen(true)}
            className="bg-white text-blue-600 border border-blue-600 px-3 py-1.5 text-sm rounded hover:bg-blue-50"
          >
            Add New Category
          </button>
        </div>
      </div>
      {categoriesError && (
        <p className="text-red-500 text-sm mb-4">{categoriesError}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>

        <div className="flex flex-col items-center gap-1">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <span className="text-xs text-gray-500">
            {totalPosts} posts found
          </span>
        </div>

        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <AddPostModal
        isOpen={isAddNewPostModalOpen}
        onClose={() => setIsAddNewPostModalOpen(false)}
      />

      <AddCategoryModal
        isOpen={isAddNewCategoryModalOpen}
        onClose={() => setIsAddNewCategoryModalOpen(false)}
        onCategoryCreated={(category) => {
          setCategories((current) => [
            ...current.filter((item) => item.id !== category.id),
            category,
          ]);
        }}
      />
    </div>
  );
}
