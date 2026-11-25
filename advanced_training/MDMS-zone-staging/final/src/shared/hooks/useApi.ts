import { useEffect, useRef, useState } from "react";

interface ApiState<T> {
  key: string | null;
  data: T | undefined;
  error: unknown;
}

export interface ApiResult<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
}

/**
 * Runs `fetcher` whenever `key` changes and aborts the previous request.
 * `key` should describe every input of the request (e.g. JSON of the params);
 * pass null to skip fetching. While a new key loads, the previous data stays
 * available so tables don't flash empty between pages.
 */
export function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  key: string | null,
): ApiResult<T> {
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const [state, setState] = useState<ApiState<T>>({
    key: null,
    data: undefined,
    error: undefined,
  });

  useEffect(() => {
    if (key === null) return;
    const controller = new AbortController();
    fetcherRef.current(controller.signal).then(
      (data) => setState({ key, data, error: undefined }),
      (error: unknown) => {
        if (!controller.signal.aborted)
          setState((prev) => ({ key, data: prev.data, error }));
      },
    );
    return () => controller.abort();
  }, [key]);

  return {
    data: state.data,
    error: state.key === key ? state.error : undefined,
    loading: key !== null && state.key !== key,
  };
}
