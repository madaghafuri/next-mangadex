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
