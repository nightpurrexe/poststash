import { useLoaderData, useSearchParams } from 'react-router'
import type { postsLoader } from './lib/posts-loader'
import PostCard from './components/PostCard';
import { useState } from 'react';
import AddPostModal from './components/AddPostModal';

export default function App() {
  const result = useLoaderData<typeof postsLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false)

  const posts = result.posts.data;
  const pagination = result.posts.pagination;
  const uncategorizedPostsCount = result.uncategorizedPostsCount;

  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;
  const totalPosts = pagination.total;

  const applyFilter = (key: "username" | "category", value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }

      next.delete("page")
      return next;
    })
  }

  const goToPage = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (page <= 1) {
        next.delete("page")
      } else {
        next.set("page", String(page))
      }

      return next;
    });

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="pb-8 max-w-7xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Saved Posts</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New Post</button>
      </header>

      <div className="flex justify-between items-center gap-4 mb-6">
        <p className="leading-none">{uncategorizedPostsCount} Uncategorized posts</p>
        <div>
          <input type="text" className="border rounded px-3 py-1 mr-3" placeholder="Filter by username" value={searchParams.get("username") ?? ""} onChange={(e) => applyFilter("username", e.target.value)} />
          <select className="border rounded px-3 py-1" value={searchParams.get("category") ?? ""} onChange={(e) => applyFilter("category", e.target.value)}>
            <option value="">All</option>
            <option value="tech">Tech</option>
            <option value="religion">Religion</option>
            <option value="work">Work</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button className="px-4 py-2 border rounded disabled:opacity-50" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
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

        <button className="px-4 py-2 border rounded disabled:opacity-50" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>
          Next
        </button>
      </div>

      <AddPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
