// import { App, initializeApp, getApps, cert, getApp } from "firebase-admin/app";
// import { Auth, getAuth } from "firebase-admin/auth";

// let app: App;
// let auth: Auth;

// // Check if running with Firebase emulators
// const isEmulator = process.env.FIRESTORE_EMULATOR_HOST !== undefined;

// if (getApps().length === 0) {
//   if (isEmulator) {
//     // Initialize for emulator mode
//     // Note: firebase-admin automatically connects to emulators when
//     // FIRESTORE_EMULATOR_HOST and FIREBASE_AUTH_EMULATOR_HOST env vars are set
//     console.log("🔥 Firebase Admin SDK connecting to emulators:");
//     console.log(`   Auth: ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
//     console.log(`   Firestore: ${process.env.FIRESTORE_EMULATOR_HOST}`);

//     app = initializeApp({
//       projectId: "demo-judocalendar", // Use demo project for emulator
//     });
//   } else {
//     // Production mode - use default credentials from environment
//     // app = initializeApp({
//     //   credential: cert(require("../path-to-your-service-account.json")),
//     // });
//     console.log("🔥 Firebase Admin SDK connecting to production");
//     app = initializeApp();
//   }

//   auth = getAuth(app);
// } else {
//   app = getApp();
//   auth = getAuth(app);
// }

// export { auth };
