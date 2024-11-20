import { Breakpoint } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import theme from 'utils/theme';

// Get media query breakpoint width
export function useWidth() {
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output: string | null, key: Breakpoint) => {
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

// Get window dimensions
export function getWindowDimensions() {
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  };
}

// Local Store Reducer
export const LocalStoreReducer = (
  local: Array<{ key: string; value: string }>,
  action: { type: 'SET' | 'DELETE'; data: { key: string; value?: any } }
) => {
  switch (action.type) {
    case 'SET': {
      const updated = local.some((k) => k.key === action.data.key)
        ? local.map((u) =>
            u.key === action.data.key
              ? { ...u, value: action.data.value ?? null }
              : u
          )
        : [
            ...local,
            { key: action.data.key, value: action.data.value ?? null },
          ];
      localStorage.setItem('app-data', JSON.stringify(updated));
      return updated;
    }
    case 'DELETE': {
      const updated = local.filter((l) => l.key !== action.data.key);
      localStorage.setItem('app-data', JSON.stringify(updated));
      return updated;
    }
    default:
      return local;
  }
};
