import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? '';

type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useApi<T>(path: string | null): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: path !== null,
    error: null,
  });

  useEffect(() => {
    if (path === null) return;

    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetch(`${API_URL}${path}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setState({ data: null, loading: false, error: err.message });
      });

    return () => controller.abort();
  }, [path]);

  return state;
}
