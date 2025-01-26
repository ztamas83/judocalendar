import { LoaderFunction, redirect } from "@remix-run/node";
import { useContext } from "react";

import { session } from "~/cookies";
import { AuthContext } from "~/services/auth-provider";

export const loader: LoaderFunction = async () => {
  const state = useContext(AuthContext);

  return redirect("/", {
    headers: {
      "Set-Cookie": await session.serialize("", {
        expires: new Date(0),
      }),
    },
  });
};
