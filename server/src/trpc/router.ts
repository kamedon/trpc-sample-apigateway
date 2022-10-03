import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { ApiContext } from "./index";

const t = initTRPC.context<ApiContext>().create({});
export const apiRouter = t.router({
  hoge: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input, ctx }) => {
      return `Hoge, ${input.name}`;
    }),
  foo: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return `Foo, ${input.name}`;
    }),
});
