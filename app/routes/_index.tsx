"use client";
import { createCookie, type MetaFunction } from "react-router";
import { LoginForm } from "~/components/login-form";
import { useAuth } from "~/services/auth-provider";

export const meta: MetaFunction = () => {
  return [
    { title: "Your Judo Calendar" },
    {
      name: "description",
      content:
        "A simple application to keep track of your judo trainings and progress",
    },
  ];
};

const authCookie = createCookie("session", {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
});

// Get token from cookie in a loader or action
// export async function loader({ request }: LoaderFunctionArgs) {
//   const cookieHeader = request.headers.get("Cookie");
//   // if (!cookieHeader?.includes("session=")) {
//   //   return redirect("/login");
//   // }
//   const token = await authCookie.parse(cookieHeader);

//   return token;
// }
export default function Index() {
  const { loginWithGoogle, user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">
          Welcome to your Judo Calendar
        </h1>
        {user ? "" : <LoginForm />}
      </div>
    </div>
  );
}
