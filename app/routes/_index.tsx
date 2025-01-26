import {
  createCookie,
  useLoaderData
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import { auth } from "~/firebase.client";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const authCookie = createCookie("session", {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
});

// Get token from cookie in a loader or action
export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  // if (!cookieHeader?.includes("session=")) {
  //   return redirect("/login");
  // }
  const token = await authCookie.parse(cookieHeader);

  return token;
}
export default function Index() {
  const token = useLoaderData<typeof loader>();

  const user = token ? auth.currentUser : null;
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">
          Welcome to your Judo Calendar
        </h1>
      </div>
    </div>
  );
}
