"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ProvidersProps {
  children: React.ReactNode;
  nonce?: string; 
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function Providers({ children }: ProvidersProps) {
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}