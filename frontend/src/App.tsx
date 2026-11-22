import { useLoaderData, useRevalidator, useSearchParams } from "react-router";
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
  const revalidator = useRevalidator();
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
    <div className="min-h-screen bg-[#F8F7F4] px-4 py-8 text-[#252923] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold tracking-wide text-[#347A57]">
              POST STASH
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Your saved posts
            </h1>
            <p className="mt-1 text-sm text-[#777970]">
              Your personal space for organizing saved inspiration.
            </p>
          </div>

          <button
            onClick={() => setIsAddNewPostModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl bg-[#347A57] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#286344] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#347A57] focus-visible:ring-offset-2"
          >
            + Add New Post
          </button>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E5E3DC] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#777970]">
              Total saved posts
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-[#252923]">
              {totalPosts}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E3DC] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#777970]">
              Uncategorized posts
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-[#D97745]">
              {uncategorizedPostsCount}
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-[#E5E3DC] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-[#252923]">Find your posts</h2>
            <p className="mt-1 text-sm text-[#777970]">
              Search and filter your saved collection.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <input
              type="text"
              className="min-w-0 flex-1 rounded-xl border border-[#E5E3DC] bg-[#F8F7F4] px-4 py-2.5 text-sm text-[#252923] outline-none transition focus:border-[#347A57] focus:ring-2 focus:ring-[#347A57]/15"
              placeholder="Filter by username..."
              value={searchParams.get("username") ?? ""}
              onChange={(e) => applyFilter("username", e.target.value)}
            />

            <select
              className="w-full rounded-xl border border-[#E5E3DC] bg-[#F8F7F4] px-4 py-2.5 text-sm text-[#252923] outline-none transition focus:border-[#347A57] focus:ring-2 focus:ring-[#347A57]/15 lg:w-56"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {capitalize(category.name)}
                </option>
              ))}
              <option value="uncategorized">Uncategorized</option>
            </select>

            <button
              onClick={() => setIsAddNewCategoryModalOpen(true)}
              className="whitespace-nowrap rounded-xl border border-[#347A57] bg-white px-4 py-2.5 text-sm font-semibold text-[#347A57] transition-colors duration-200 hover:bg-[#EEF4EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#347A57] focus-visible:ring-offset-2"
            >
              + Add Category
            </button>
          </div>
        </section>

        {categoriesError && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {categoriesError}
          </p>
        )}

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D8D6CE] bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-[#252923]">
              No posts found
            </p>
            <p className="mt-2 text-sm text-[#777970]">
              Try changing your filters or add a new saved post.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-[#E5E3DC] bg-white p-4 shadow-sm">
          <button
            className="rounded-xl border border-[#E5E3DC] px-4 py-2 text-sm font-medium text-[#252923] transition-colors hover:bg-[#F8F7F4] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Previous
          </button>

          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm font-semibold text-[#252923]">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-xs text-[#777970]">
              {totalPosts} posts found
            </span>
          </div>

          <button
            className="rounded-xl border border-[#E5E3DC] px-4 py-2 text-sm font-medium text-[#252923] transition-colors hover:bg-[#F8F7F4] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>

        <AddPostModal
          isOpen={isAddNewPostModalOpen}
          onClose={() => setIsAddNewPostModalOpen(false)}
          onCreated={() => revalidator.revalidate()}
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
    </div>
  );
}
