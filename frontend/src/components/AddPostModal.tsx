import { useState } from "react";
import { api } from "../lib/api";

type Props = { isOpen: boolean, onClose: () => void };

export default function AddPostModal({ isOpen, onClose }: Props) {
  const [jsonInput, setJsonInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);

    try {
      const parsed = JSON.parse(jsonInput);
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
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Invalid JSON format")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-2"></h2>
          <p className="text-sm text-gray-600 mb-4">
            Paste the metadata for the Instagram post you want to keep below.
          </p>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck="false"
            className="w-full h-48 p-2 border rounded mb-2 font-mono text-sm"
            placeholder='{"post": {"url": "...", "type": "...", ...}}'
            required
          />

          {formError && (
            <p className="text-red-600 text-sm mb-4">{formError}</p>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{isSaving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}