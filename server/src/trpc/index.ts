import { inferAsyncReturnType } from "@trpc/server";
import { createApiContext } from "./context";
import { apiRouter } from "./router";

export type ApiContext = inferAsyncReturnType<typeof createApiContext>;
export type ApiRouter = typeof apiRouter;
