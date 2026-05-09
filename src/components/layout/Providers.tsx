"use client";

import { ToastProvider } from "@/components/ui/ToastContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
