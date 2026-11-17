import { useEffect, useState } from "react"
import { api } from "../lib/api";

type Category = { id: string, name: string }

export function useCategories(shouldFetch: boolean) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldFetch || categories.length > 0) return;

    setLoading(true);

    api.categories
      .getAll()
      .then((data) => setCategories(data as Category[]))
      .catch(() => setError("Could not load categories"))
      .finally(() => setLoading(false))
  }, [shouldFetch, categories.length])

  return { categories, loading, error }
}