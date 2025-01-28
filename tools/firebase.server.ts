import { App, initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { firebaseConfig } from "./fb";

let app: App;
let auth: Auth;

if (getApps().length === 0) {
  // app = initializeApp({
  //   credential: cert(require("../path-to-your-service-account.json")),
  // });
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  app = getApp();
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };
