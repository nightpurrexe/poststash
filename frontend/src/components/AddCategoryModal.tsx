import { useState } from "react";
import { api } from "../lib/api";
import type { Category } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: Category) => void;
};

export default function AddCategoryModal({
  isOpen,
  onClose,
  onCategoryCreated,
}: Props) {
  const [categoryInput, setCategoryInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);

    try {
      const payload = {
        name: categoryInput,
      };

      const [category] = await api.categories.create(payload);
      if (!category)
        throw new Error("Category was created but not returned by the server");
      onCategoryCreated(category);
      setCategoryInput("");
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Invalid JSON format");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-2">Add New Category</h2>
          <p className="text-sm text-gray-600 mb-4">
            Create a new category to organize your posts.
          </p>

          <input
            type="text"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            className="w-full p-2 border rounded mb-2 font-mono text-sm"
            placeholder="Sports"
            required
          />

          {formError && (
            <p className="text-red-600 text-sm mb-4">{formError}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
