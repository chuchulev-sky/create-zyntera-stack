import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { createAppQueryClient } from "../api/query-client";
import { ThemeProvider } from "../context/theme-context";
import { UIProvider } from "../context/ui-context";
import { AppRouter } from "./router";
import { ModalProvider } from "@/context/modal-context";

export function AppProviders() {
    const [queryClient] = useState(() => createAppQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <UIProvider>
                <ThemeProvider>
                    <TooltipProvider>
                        <ModalProvider>
                            <AppRouter />
                        </ModalProvider>
                    </TooltipProvider>
                </ThemeProvider>
            </UIProvider>
        </QueryClientProvider>
    );
}