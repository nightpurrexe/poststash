import { useLoaderData } from 'react-router'
import type { postsLoader } from './lib/posts-loader'
import PostCard from './components/PostCard';

export default function App() {
  const result = useLoaderData<typeof postsLoader>();

  return (
    <div>
      {result.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
