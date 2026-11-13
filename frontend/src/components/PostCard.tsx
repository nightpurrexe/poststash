import type { Post } from "../types";

type Props = {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const embedUrl = `${post.url}embed/`;
  
  return (
    <iframe 
      src={embedUrl}
      loading="lazy"
      allowFullScreen
    ></iframe>
  )
}