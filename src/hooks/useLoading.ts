import { useState, useCallback } from "react";

interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(fn: () => Promise<T>, minDuration?: number) => Promise<T>;
}

export function useLoading(initialState = false): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>, minDuration = 2000): Promise<T> => {
      startLoading();

      const [result] = await Promise.all([
        fn(),
        new Promise((resolve) => setTimeout(resolve, minDuration)),
      ]);

      stopLoading();
      return result;
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}
