import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"http://172.17.0.2/root/ToolsHouse-Front-End.git"
});
