import { useState } from "react";
import type { Category, Post } from "../types";
import { useRevalidator } from "react-router";
import { api } from "../lib/api";
import { capitalize } from "../utils/capitalize";

type Props = {
  post: Post;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
};

export default function PostCard({
  post,
  categories,
  categoriesLoading,
  categoriesError,
}: Props) {
  const embedUrl = `${post.url}embed/`;
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(post.categoryId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const revalidator = useRevalidator();

  const handleSave = async () => {
    if (!selectedCategoryId) return setError("Please select a category");
    setSaving(true);
    setError(null);
    try {
      await api.posts.updateCategory(post.id, selectedCategoryId);
      setIsEditing(false);
      revalidator.revalidate();
    } catch {
      setError("Could not save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E5E3DC] bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex rounded-lg bg-[#EEF4EF] px-3 py-1 text-xs font-semibold capitalize text-[#347A57]">
          {post.type}
        </span>

        <button
          className="text-xs font-semibold text-[#347A57] transition-colors hover:text-[#286344] focus-visible:outline-none focus-visible:underline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Change category"}
        </button>
      </div>

      {isEditing && (
        <div className="mb-3 rounded-xl border border-[#E5E3DC] bg-[#F8F7F4] p-3">
          {categoriesLoading ? (
            <p className="text-sm text-[#777970]">Loading categories...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <select
                className="w-full rounded-lg border border-[#E5E3DC] bg-white px-3 py-2 text-sm text-[#252923] outline-none transition focus:border-[#347A57] focus:ring-2 focus:ring-[#347A57]/15"
                value={selectedCategoryId ?? ""}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {capitalize(c.name)}
                  </option>
                ))}
              </select>

              <button
                className="w-full rounded-lg bg-[#347A57] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#286344] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save category"}
              </button>
            </div>
          )}

          {(error || categoriesError) && (
            <p className="mt-2 text-xs text-red-600">
              {error || categoriesError}
            </p>
          )}
        </div>
      )}

      <iframe
        className="min-h-188 w-full flex-1 rounded-xl bg-[#F8F7F4]"
        src={embedUrl}
        loading="lazy"
        allowFullScreen
      ></iframe>
    </div>
  );
}
