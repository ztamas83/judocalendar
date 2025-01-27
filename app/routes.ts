import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  //route("/", "routes/_index.tsx"),
  ...(await flatRoutes()),
] satisfies RouteConfig;

// export default remixRoutesOptionAdapter((defineRoutes) => {
//   return defineRoutes((route) => {
//     route("/", "routes/_index.tsx", { index: true });
//     route("/trainings", "routes/trainings.tsx");
//     route("/techniques", "routes/techniques.tsx");
//     route("/profile", "routes/profile.tsx");
//   });
// }) satisfies RouteConfig;
