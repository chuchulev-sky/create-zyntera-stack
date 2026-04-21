import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { authClient } from "../auth/auth-client";
import { useCurrentUser } from "../hooks/use-current-user";
import { useTheme } from "../hooks/use-theme";

export function RootLayout({ children }: { children?: ReactNode}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { session, user, sessionPending } = useCurrentUser();
    const { theme, toggleTheme, setTheme } = useTheme();

    const authUser = session?.user;

    async function handleSignOut() {
        await authClient.signOut();
        await queryClient.invalidateQueries();
        navigate('/login')
    }

    return (
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <nav className="mx-auto flex w-full max-w-5xl items-center gap-4">
              <Link className="text-sm font-medium hover:underline" to="/">
                Home
              </Link>
              {authUser ? (
                <>
                  <Link className="text-sm font-medium hover:underline" to="/app">
                    App
                  </Link>
                  {user?.role === 'admin' ? (
                    <Link className="text-sm font-medium hover:underline" to="/admin">
                      Admin
                    </Link>
                  ) : null}
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Toggle theme
                    </button>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                      className="rounded-md border border-slate-300 bg-transparent px-2 py-1 text-xs dark:border-slate-700"
                      aria-label="Theme mode"
                    >
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{authUser.email}</span>
                    <button
                      type="button"
                      onClick={() => void handleSignOut()}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Toggle theme
                  </button>
                  <Link className="text-sm font-medium hover:underline" to="/login">
                    Login
                  </Link>
                  <Link className="text-sm font-medium hover:underline" to="/register">
                    Register
                  </Link>
                </div>
              )}
              {sessionPending ? (
                <span className="text-xs text-slate-400 dark:text-slate-500">...</span>
              ) : null}
            </nav>
          </header>
          <main className="mx-auto w-full max-w-5xl px-4 py-6">{children ?? <Outlet />}</main>
        </div>
      );
    }