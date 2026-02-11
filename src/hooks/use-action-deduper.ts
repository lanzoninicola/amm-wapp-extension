import { useRef } from "react";

interface UseActionDeduperOptions {
  windowMs?: number;
  releaseDelayMs?: number;
}

export function useActionDeduper(options: UseActionDeduperOptions = {}) {
  const { windowMs = 600, releaseDelayMs = 250 } = options;

  const isRunningRef = useRef(false);
  const lastKeyRef = useRef("");
  const lastAtRef = useRef(0);

  async function runWithDedup<T>(key: string, action: () => Promise<T>): Promise<T | null> {
    if (isRunningRef.current) return null;

    const now = Date.now();
    if (lastKeyRef.current === key && now - lastAtRef.current < windowMs) return null;

    isRunningRef.current = true;
    lastKeyRef.current = key;
    lastAtRef.current = now;

    try {
      return await action();
    } finally {
      window.setTimeout(() => {
        isRunningRef.current = false;
      }, releaseDelayMs);
    }
  }

  return {
    runWithDedup,
  };
}
