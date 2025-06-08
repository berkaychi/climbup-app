import { useMemo, useCallback, useRef, DependencyList } from "react";

/**
 * Enhanced useMemo with debugging in development
 */
export function useStableMemo<T>(
  factory: () => T,
  deps: DependencyList,
  debugName?: string
): T {
  return useMemo(() => {
    if (process.env.NODE_ENV === "development" && debugName) {
      console.log(`🔄 Recalculating memo: ${debugName}`);
    }
    return factory();
  }, deps);
}

/**
 * Enhanced useCallback with debugging in development
 */
export function useStableCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  deps: DependencyList,
  debugName?: string
): T {
  return useCallback(
    ((...args: Parameters<T>) => {
      if (process.env.NODE_ENV === "development" && debugName) {
        console.log(`🔄 Callback recreated: ${debugName}`);
      }
      return callback(...args);
    }) as T,
    deps
  );
}

/**
 * Memoize expensive computations with automatic cache invalidation
 */
export function useMemoizedComputation<T, Args extends ReadonlyArray<unknown>>(
  computation: (...args: Args) => T,
  args: Args,
  debugName?: string
): T {
  const argsRef = useRef<Args | undefined>(undefined);
  const resultRef = useRef<T | undefined>(undefined);

  return useMemo(() => {
    // Check if arguments have changed
    if (!argsRef.current || !shallowEqual(args, argsRef.current)) {
      if (process.env.NODE_ENV === "development" && debugName) {
        console.log(`🔄 Recomputing: ${debugName}`);
      }
      argsRef.current = args;
      resultRef.current = computation(...args);
    }
    return resultRef.current!;
  }, [...args]);
}

/**
 * Shallow equality check for arrays
 */
function shallowEqual<T extends ReadonlyArray<unknown>>(a: T, b: T): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Debounced value hook
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttled callback hook
 */
export function useThrottledCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delay: number,
  deps: DependencyList
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [...deps, delay]
  );
}

// Import required React hooks
import { useState, useEffect } from "react";
