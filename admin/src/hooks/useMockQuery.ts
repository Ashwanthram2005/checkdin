import { useEffect, useState } from 'react';

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useMockQuery<T>(loader: () => Promise<T>, deps: unknown[] = []): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    loader().
    then((data) => {
      if (!cancelled) setState({ data, loading: false, error: null });
    }).
    catch(() => {
      if (!cancelled)
      setState({ data: null, loading: false, error: 'We could not load this data. Retry in a moment.' });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}