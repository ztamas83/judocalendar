import { useEffect } from "react";
import { LoaderFunction, redirect, useNavigate } from "react-router";
import { session } from "~/cookies";

// export const loader: LoaderFunction = async () => {
//   return redirect("/", {
//     headers: {
//       "Set-Cookie": await session.serialize("", {
//         expires: new Date(0),
//       }),
//     },
//   });
// };

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session cookie (if needed, use a client-side method)
    document.cookie = `${session.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}
