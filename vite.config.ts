import path from "path";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import Fonts from "unplugin-fonts/vite";
import { fonts } from "./configs/fonts.config";

// Load environment variables from .env.local for emulator configuration
// Note: Vite automatically loads .env files, but we ensure emulator env vars are available
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

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
    Fonts({ google: { families: fonts } }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
      "@/utils": path.resolve(__dirname, "./app/components/utils"),
      "~images": path.resolve(__dirname, "./app/assets/img"),
    },
  },
});
