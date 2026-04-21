import { createContext, useMemo, useState, type ReactNode } from "react";

type UIContextValue = {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

/**
 * UIProvider is a context provider for sidebars, modals, etc..
 * @param children - The children to render.
 * @returns The UIProvider component.
 */
export function UIProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const value = useMemo(
        () => ({
            isSidebarOpen,
            toggleSidebar: () => setIsSidebarOpen((v) => !v),
            closeSidebar: () => setIsSidebarOpen(false),
        }),
        [isSidebarOpen],
    );

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export { UIContext };
