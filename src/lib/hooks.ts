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

const mediaQuery = {
  md: "(min-width: 768px)",
  sm: "(min-width: 640px)",
  lg: "(min-width: 1024px)",
};

export const useMediaQuery = ({
  query,
}: {
  query: keyof typeof mediaQuery;
}) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(mediaQuery[query]);

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

export const useLocalStorage = <T>(key: string, value: T) => {
  const [val, setVal] = useState(value);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setVal(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const setValue = (value: T) => {
    setVal(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [val, setValue] as const;
};
