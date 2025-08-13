import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
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
});
