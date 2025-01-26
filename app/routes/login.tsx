// import { Input, Typography, Button } from "@material-tailwind/react";
import { SyntheticEvent, useRef } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth as clientAuth } from "~/firebase.client";
import { auth as serverAuth } from "~/server/firebase.server";
import { ActionFunction } from "react-router";
import { session } from "~/cookies";
import { Form, Link, useActionData, useFetcher, redirect } from "react-router";
import { DateTime } from "luxon";

// use loader to check for existing session, if found, send the user to the blogs site
export async function loader({ request }) {
  return {};
}
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const idToken = form.get("idToken")?.toString();

  if (!idToken) {
    console.warn("No idToken provided");
    return redirect("/login");
  }

  // Verify the idToken is actually valid
  await serverAuth.verifyIdToken(idToken);
  const jwt = await serverAuth.createSessionCookie(idToken, {
    // 1 day - can be up to 2 weeks
    expiresIn: 60 * 60 * 24 * 1000,
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": await session.serialize(jwt),
    },
  });
};

export default function Login() {
  // to use our actionData error in our form, we need to pull in our action data
  const actionData = useActionData();

  // for refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <div className="ui container" style={{ paddingTop: 40 }}>
      <h3>Remix Login With Firebase, Email & Google Auth</h3>
      <form method="post" className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="">
          <input name="Email" required={true} ref={emailRef} />
        </div>
        <div className="field">
          <h6 color="blue-gray" className="">
            Password
          </h6>
          <input
            type="password"
            name="Password"
            required={true}
            ref={passwordRef}
            placeholder="***********"
          />
        </div>
        <div className="grid">
          <button className="mt-6" onClick={signInWithEmail}>
            email-login
          </button>
        </div>
      </form>
      <button className="mt-6 bg-blue-gray-200" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <div className="ui divider"></div>
      <div className="ui centered grid" style={{ paddingTop: 16 }}>
        <div className="six wide column">
          <Link className="ui button right floated" to="/register">
            Register
          </Link>
        </div>
        <div className="six wide column">
          <Link className="ui button" to="/forgot">
            Forgot Password?
          </Link>
        </div>
      </div>
      <div className="errors">
        {actionData?.error ? actionData?.error?.message : null}
      </div>
    </div>
  );
}
