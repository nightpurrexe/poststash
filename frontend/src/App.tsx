import { useLoaderData, useSearchParams } from 'react-router'
import type { postsLoader } from './lib/posts-loader'
import PostCard from './components/PostCard';
import { useState } from 'react';
import AddPostModal from './components/AddPostModal';

export default function App() {
  const result = useLoaderData<typeof postsLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false)

  const currentPage = result.pagination.page;
  const totalPages = result.pagination.totalPages;

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {result.data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button className="px-4 py-2 border rounded disabled:opacity-50" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
          Previous
        </button>

        <span className="text-gray-600">Page {currentPage} of {totalPages}</span>

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
