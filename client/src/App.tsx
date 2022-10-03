import "./App.css";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react";
import { Page } from "./Page";
import { ApiRouter } from "server";

export const trpc = createTRPCReact<ApiRouter>();
const createTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:4000/api",
      }),
    ],
  });
};

function App() {
  const trpcClient = createTRPCClient();
  const queryClient = new QueryClient();

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
