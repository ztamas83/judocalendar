import { LoaderFunction, redirect } from "react-router";
import { session } from "~/cookies";

export const loader: LoaderFunction = async () => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await session.serialize("", {
        expires: new Date(0),
      }),
    },
  });
};
