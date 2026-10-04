import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: "@crema", replacement: "/src/@crema" }],
  },
  define: {
    "process.env": {},
  },
  plugins: [react()],
  // Multi-academia en local: Apache reenvía <codigo>.erp-academia.test a este servidor
  // (IPv4 fijo: por defecto Node escucha solo en ::1 y el proxy no lo alcanza).
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },

});
