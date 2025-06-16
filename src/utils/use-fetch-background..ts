import { useState, useEffect } from "react";
import { sendMessageToBackground } from "./send-message-to-background";

interface BackgroundResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch data from the background script.
 *
 * @param action The action to be performed in the background script.
 * @param payload Optional payload to send with the action.
 * @returns An object containing the fetched data, loading state, and error message.
 */
export default function useFetchBackground<T = unknown>(
  action: string
): BackgroundResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);

    sendMessageToBackground<T>(action, {})
      .then((response) => {
        setLoading(false);

        setData(response);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || "An error occurred.");
      });
  }, [action]);

  return { data, loading, error };
}
