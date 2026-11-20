import { useState } from "react";
import type { Category, Post } from "../types";
import { useRevalidator } from "react-router";
import { api } from "../lib/api";

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
  const [selectedCategoryId, setSelectedCategoryId] = useState(post.categoryId);
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
    <div className="border rounded p-2 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold capitalize">{post.type}</span>
        <button
          className="text-blue-600 text-sm underline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Change category"}
        </button>
      </div>

      {isEditing && (
        <div className="mb-2 p-2 bg-gray-50 rounded">
          {categoriesLoading ? (
            <p className="text-sm">Loading...</p>
          ) : (
            <div className="flex gap-2 items-center">
              <select
                className="flex-1 border rounded p-1 text-sm"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "..." : "Save"}
              </button>
            </div>
          )}
          {(error || categoriesError) && (
            <p className="text-red-500 text-xs mt-1">
              {error || categoriesError}
            </p>
          )}
        </div>
      )}

      <iframe
        className="w-full flex-1 min-h-188 rounded"
        src={embedUrl}
        loading="lazy"
        allowFullScreen
      ></iframe>
    </div>
  );
}
