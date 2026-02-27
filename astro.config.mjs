// @ts-check
import gezelligsimpleCriticalCss from "@gezellig/astro-simple-critical-css";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [gezelligsimpleCriticalCss()],
});
