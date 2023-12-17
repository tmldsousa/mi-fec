import { useState, useEffect } from 'react';

/**
 * Creates a state that updates when another value changes, after an amount of time of no changes
 *
 * @param value Value to track for changes
 * @param onChange (Optional) Callback to be called when debounced value changes
 * @param debounce (Optional) Milliseconds to wait before updating debounced state
 * @returns The debounced state
 */
export const useDebouncedState = <T,>(
  value: T,
  onChange?: (value: T) => void,
  debounce: number = 500
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      onChange?.(value);
    }, debounce);

    return () => clearTimeout(timer);
  }, [value, debounce, onChange]);

  return [debouncedValue, setDebouncedValue];
};
