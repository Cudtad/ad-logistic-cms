import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const devProxyServer = process.env.VITE_DEV_PROXY_SERVER;
  const proxy = {};

  if (devProxyServer) {
    proxy["/api"] = {
      target: devProxyServer,
      changeOrigin: true,
    };
  }
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy,
    },
  });
};
