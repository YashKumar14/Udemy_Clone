import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/

export default ({ mode }: ConfigEnv) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return defineConfig({
    plugins: [vue(), vueDevTools()],

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    // Add this section to bind the server to all interfaces (0.0.0.0)
    server: {
      host: "0.0.0.0", // Allows access from any device on the network
      port: 8081, // Set the port you want your app to run on
      open: true, // Optionally open the app in the browser automatically
      strictPort: true, //  prevents Vite from switching ports
    },

    // Add this build config
    build: {
      minify: "terser", // use Terser instead of esbuild
      terserOptions: {
        compress: {
          drop_console: true, // remove all console.* in production
          drop_debugger: true, // remove debugger statements
        },
        format: {
          comments: false, // remove comments
        },
      },
    },

    base: env.VITE_API_ROUTER_URL, // Use environment variable for base path
  });
};
