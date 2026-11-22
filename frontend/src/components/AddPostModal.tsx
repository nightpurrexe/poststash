import { useState } from "react";
import { api } from "../lib/api";
import type { PostLensMetadata } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function AddPostModal({ isOpen, onClose, onCreated }: Props) {
  const [jsonInput, setJsonInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);

    try {
      const parsed: PostLensMetadata = JSON.parse(jsonInput);
      if (!parsed?.post) throw new Error("JSON must contain a 'post' object.");

      const payload = {
        url: parsed.post.url,
        shortcode: parsed.post.shortcode,
        type: parsed.post.type,
        productType: parsed.post.productType,
        owner: {
          username: parsed.post.owner.username,
          fullName: parsed.post.owner.fullName,
        },
        caption: parsed.post.caption,
        slideCount: parsed.post.slideCount,
      };

      if (!payload.url.trim()) throw new Error("A valid post URL is required");

      await api.posts.create(payload);
      setJsonInput("");
      onClose();
      onCreated();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Invalid JSON format");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#252923]/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-[#E5E3DC] bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-[#252923]">
              Add New Post
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#777970]">
              Paste the metadata for the Instagram post you want to keep below.
            </p>
          </div>

          <label className="mb-2 block text-sm font-semibold text-[#252923]">
            Post metadata (JSON)
          </label>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck="false"
            className="mb-3 h-52 w-full resize-y rounded-xl border border-[#E5E3DC] bg-[#F8F7F4] p-4 font-mono text-xs leading-relaxed text-[#252923] outline-none transition placeholder:text-[#A3A39B] focus:border-[#347A57] focus:ring-2 focus:ring-[#347A57]/15"
            placeholder='{"post": {"url": "...", "type": "...", ...}}'
            required
          />

          {formError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          )}

          <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#777970] transition-colors hover:bg-[#F8F7F4] hover:text-[#252923]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#347A57] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#286344] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
