import { defineConfig } from "vitepress";
import { recipes } from "./theme/recipes.mjs";
import { brand } from "./theme/brand.mjs";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

// ---------------------------------------------------------------------------
// The sidebar is derived, not hand-maintained.
//
// Components and reference pages come from an explicitly imported, versioned
// studio snapshot. Building this site never reads a studio checkout or library.
// ADRs are read from that local snapshot.
// ---------------------------------------------------------------------------

const ROOT = resolve(import.meta.dirname, "..", "..");
const DOCS = join(ROOT, "docs");
const config = JSON.parse(readFileSync(join(ROOT, "data/studio-reference.json"), "utf-8"));

const components = Object.entries(config.components) as [string, any][];

function componentLinks(standalone: boolean) {
  return components
    .filter(([, c]) => c.standalone === standalone)
    .map(([name, c]) => ({
      text: name,
      link: `/${standalone ? "packages" : "studio"}/${name}`,
      // Capabilities are the useful thing to scan for, so surface them.
      ...(c.capabilities.length ? {} : {}),
    }));
}

/** ADRs, newest first — the recent decisions are the ones people look up. */
function adrLinks() {
  const dir = join(DOCS, "adr");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^\d{4}-.*\.md$/.test(f))
    .sort()
    .reverse()
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const number = slug.slice(0, 4);
      const title = slug
        .slice(5)
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
      return { text: `${number} — ${title}`, link: `/adr/${slug}` };
    });
}

// Site-owned Markdown writes the product's name as %product%: the one constant
// in theme/brand.mjs fills it in, in the page and in its title and description.
const named = (text: string) => text.replaceAll("%product%", brand.name);

export default defineConfig({
  title: brand.name,
  description:
    `${brand.name} is ${brand.descriptor}. It ${brand.purpose}`,
  base: process.env.DOCS_BASE || "/",
  appearance: false,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: `${process.env.DOCS_BASE || "/"}favicon.svg` }],
    ["meta", { name: "theme-color", content: "#f7f5ef" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: brand.name }],
  ],
  markdown: {
    config(md) {
      md.core.ruler.before("normalize", "product-name", (state) => {
        state.src = named(state.src);
      });
    },
  },
  transformPageData(pageData) {
    pageData.title = named(pageData.title);
    pageData.description = named(pageData.description);
    if (typeof pageData.frontmatter.title === "string") pageData.frontmatter.title = named(pageData.frontmatter.title);
    if (typeof pageData.frontmatter.description === "string") pageData.frontmatter.description = named(pageData.frontmatter.description);
  },
  transformHead({ pageData }) {
    return [
      ["meta", { property: "og:title", content: pageData.title }],
      ["meta", { property: "og:description", content: pageData.description }],
      ["meta", { name: "twitter:card", content: "summary" }],
    ];
  },
  lang: "en-US",
  cleanUrls: true,
  lastUpdated: true,

  // Reference snapshots are committed. Refresh them only with reference:sync.
  ignoreDeadLinks: false,

  themeConfig: {
    logo: { src: "/favicon.svg", alt: "" },
    siteTitle: brand.name,
    nav: [
      { text: "Films", link: "/examples" },
      { text: "Recipes", link: "/recipes/", activeMatch: "/recipes/" },
      { text: "How it works", link: "/how-it-works" },
      { text: "Collaboration", link: "/collaboration" },
      { text: "Limits", link: "/limits" },
      { text: "Docs", link: "/guide" },
      { text: "Install", link: "/quick-start" },
    ],
    socialLinks: [{ icon: "github", link: brand.repository }],

    sidebar: [
      {
        text: "Start here",
        items: [
          { text: "Quick start", link: "/quick-start" },
          { text: "How it works", link: "/how-it-works" },
          { text: "Collaboration, Git & S3", link: "/collaboration" },
          { text: "The correction, shown", link: "/correction-shown" },
          { text: "Documentation overview", link: "/guide" },
          { text: "Install and composition", link: "/install" },
          { text: "Running the agent", link: "/running" },
          { text: "Repository layout", link: "/repository-layout" },
          { text: "Contributing", link: "/contributing" },
        ],
      },
      {
        text: "Recipes",
        collapsed: false,
        items: [
          { text: "Browse all recipes", link: "/recipes/" },
          ...recipes.map(recipe => ({ text: recipe.title, link: `/recipes/${recipe.slug}` })),
        ],
      },
      {
        text: "Where it stands",
        items: [
          { text: "Limits", link: "/limits" },
          { text: `${brand.name} and the others`, link: "/compare" },
          { text: "Retake, the benchmark", link: "/retake" },
          { text: "Changelog", link: "/changelog" },
          { text: "Licence", link: "/licence" },
        ],
      },
      {
        text: "Understanding the system",
        items: [
          { text: "Architecture", link: "/architecture" },
          { text: "Domain language", link: "/context" },
          { text: "Workspace layout", link: "/workspace" },
          { text: "Pipelines", link: "/pipelines" },
        ],
      },
      {
        text: "Editorial handoff",
        items: [{ text: "DaVinci Resolve", link: "/resolve-handoff" }],
      },
      {
        text: "Packages — reusable",
        collapsed: true,
        items: componentLinks(true),
      },
      {
        text: "Studio — the product",
        collapsed: true,
        items: componentLinks(false),
      },
      {
        text: "Decision records",
        collapsed: true,
        items: [
          ...(existsSync(join(DOCS, "adr/index.md"))
            ? [{ text: "Index and status", link: "/adr/" }] : []),
          ...adrLinks(),
        ],
      },
    ],

    outline: { level: [2, 3] },

    search: { provider: "local" },

    docFooter: { prev: "Previous page", next: "Next page" },
  },
});
