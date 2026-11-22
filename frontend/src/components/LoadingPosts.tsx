export default function LoadingPosts() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#E5E3DC] border-t-[#347A57]" />
      <div className="text-center">
        <p className="text-sm font-semibold text-[#252923]">
          Fetching your posts
        </p>
        <p className="mt-1 text-xs text-[#777970]">Just a moment...</p>
      </div>
    </div>
  );
}
