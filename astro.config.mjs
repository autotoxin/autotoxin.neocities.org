// @ts-check
import gezelligsimpleCriticalCss from "@gezellig/astro-simple-critical-css";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    site: "https://autotoxin.nekoweb.org",
    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [
        gezelligsimpleCriticalCss(),
        mdx(),
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler"]],
            },
        }),
    ],
});
