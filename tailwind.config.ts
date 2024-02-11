import flowbite from "flowbite/plugin";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./node_modules/flowbite-react/lib/**/*.js"],
  //darkMode: 'class', // Enable dark mode
  plugins: [flowbite],
};

export default config;
