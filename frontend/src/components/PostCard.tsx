import type { Post } from "../types";

type Props = {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const embedUrl = `${post.url}embed/`;

  return (
    <iframe
      className="w-full flex-1 min-h-188 rounded"
      src={embedUrl}
      loading="lazy"
      allowFullScreen
    ></iframe>
  )
}