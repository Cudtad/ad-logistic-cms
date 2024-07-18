import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Define the type for the proxy object
interface ProxyOptions {
  [key: string]: {
    target: string;
    changeOrigin: boolean;
  };
}

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const devProxyServer = process.env.VITE_DEV_PROXY_SERVER;
  const proxy: ProxyOptions = {};

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
