import { useEffect, useState } from "react";

export const useDebounce = <T>(initialValue: T, delay = 500) => {
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    const timeId = setTimeout(() => {
      setState(initialValue);
    }, delay);

    return () => {
      clearTimeout(timeId);
    };
  }, [initialValue]);

  return state;
};

export const useMediaQuery = ({ query }: { query: string }) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  });

  return matches;
};
