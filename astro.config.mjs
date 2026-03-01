// @ts-check
import gezelligsimpleCriticalCss from "@gezellig/astro-simple-critical-css";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    site: "https://autotoxin.nekoweb.org",
    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [gezelligsimpleCriticalCss(), mdx()],
});
