import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { apiRouter } from "./trpc/router";

console.log("run: http://localhost:4100");
createHTTPServer({
  router: apiRouter,
  createContext: () => {
    return {
      event: {} as any,
    };
  },
}).listen(4100);
