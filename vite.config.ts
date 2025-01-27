import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// declare module "@remix-run/node" {
//   interface Future {
//     v3_singleFetch: true;
//   }
// }

export default defineConfig({
  plugins: [
    // reactRouter({
    //   future: {
    //     v3_fetcherPersist: true,
    //     v3_relativeSplatPath: true,
    //     v3_throwAbortReason: true,
    //     v3_singleFetch: true,
    //     v3_lazyRouteDiscovery: true,
    //   },
    //   ignoredRouteFiles: ["**/*.css"],
    // }),
    reactRouter(),
    tsconfigPaths(),
    tailwindcss(),
  ],
});
