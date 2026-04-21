import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
  
  type Theme = 'light' | 'dark' | 'system';
  type ResolvedTheme = 'light' | 'dark';
  
  type ThemeContextValue = {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
  };
  
  const ThemeContext = createContext<ThemeContextValue | null>(null);
  
  const STORAGE_KEY = 'theme';
  
  function getSystemTheme(): ResolvedTheme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
      const saved = window.localStorage?.getItem?.(STORAGE_KEY);
      return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    });

    const [systemTheme,setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());
    const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

    useEffect(() => {
      window.localStorage?.setItem?.(STORAGE_KEY, theme);
    }, [theme])

    useEffect(() => {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => setSystemTheme(media.matches ? 'dark' : 'light');
      media.addEventListener('change', onChange);
    }, []);

    useEffect(() => {
      const root = document.documentElement;
      root.classList.toggle('dark', resolvedTheme === 'dark');
      root.dataset.theme = resolvedTheme;
    }, [resolvedTheme]);
  
    const value = useMemo<ThemeContextValue>(
      () => ({
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
      }),
      [theme, resolvedTheme],
    );
  
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
  }

  export default ThemeContext;