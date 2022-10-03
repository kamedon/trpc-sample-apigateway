import { FC, useEffect, useState } from "react";
import { trpc } from "./App";

export const Page: FC = () => {
  const hoge = trpc.hoge.useQuery({ name: "Kame" });
  const foo = trpc.foo.useMutation();
  if (!hoge.data) return <div>Loading...</div>;

  return (
    <div>
      <div>Hoge: {hoge.data}</div>
      <br />
      <div>
        <div>
          <button
            onClick={() => {
              foo.mutate({ name: "DonDon" });
            }}
          >
            Request: Foo Mutation
          </button>
        </div>
        Foo: {foo.data ?? "no request"}
      </div>
    </div>
  );
};
