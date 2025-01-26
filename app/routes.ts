import { type RouteConfig } from "@react-router/dev/routes";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";

export default remixRoutesOptionAdapter((defineRoutes) => {
  return defineRoutes((route) => {
    route("/", "routes/_index.tsx", { index: true });
    route("/trainings", "routes/trainings.tsx");
    route("/techniques", "routes/techniques.tsx");
    route("/profile", "routes/profile.tsx");
  });
}) satisfies RouteConfig;
