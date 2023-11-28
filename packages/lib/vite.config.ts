import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({}) => {
  return {
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, "src/main.ts"),
        name: "yarut",

        // the proper extensions will be added
        fileName: "yarut",
      },
    },
  };
});
