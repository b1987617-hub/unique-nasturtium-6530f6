import anchor from "markdown-it-anchor";

export default function (eleventyConfig) {
  // ── 原有網站檔案原封不動搬過去（index.html 完全不碰） ──
  for (const f of [
    "index.html", "form.html", "robots.txt", "_headers",
    "logo.png", "logo.webp", "qr.webp",
    "space-1.webp", "space-2.webp", "space-3.webp", "space-4.webp",
    "space-5.webp", "space-6.webp", "space-7.webp",
    "admin"
  ]) {
    eleventyConfig.addPassthroughCopy(f);
  }
  eleventyConfig.addPassthroughCopy("blog/images");

  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add("README.md");

  // ── 標題自動產生錨點 id，目錄才抓得到 ──
  eleventyConfig.amendLibrary("md", (md) => {
    md.use(anchor, {
      level: [2, 3],
      slugify: (s) => encodeURIComponent(String(s).trim().replace(/\s+/g, "-")),
      permalink: false
    });
    md.set({ html: true, linkify: false, typographer: false });
  });

  // ── 從文章 HTML 抽出 H2 當文章目錄 ──
  eleventyConfig.addFilter("toc", (html) => {
    const out = [];
    const re = /<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
    let m;
    while ((m = re.exec(html || "")) !== null) {
      out.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, "").trim() });
    }
    return out;
  });

  eleventyConfig.addFilter("isoDate", (d) =>
    d instanceof Date ? d.toISOString().slice(0, 10) : String(d || "").slice(0, 10)
  );

  eleventyConfig.addFilter("twDate", (d) => {
    const s = d instanceof Date ? d.toISOString().slice(0, 10) : String(d || "").slice(0, 10);
    const [y, m, day] = s.split("-");
    return `${y} 年 ${Number(m)} 月 ${Number(day)} 日`;
  });

  // 給 JSON-LD 用：把字串安全塞進 JSON
  eleventyConfig.addFilter("jsonstr", (s) => JSON.stringify(String(s == null ? "" : s)));

  eleventyConfig.addFilter("others", (posts, url, n) =>
    (posts || []).filter((p) => p.url !== url).slice(0, n || 3)
  );

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("blog/*.md")
       .filter((p) => !p.data.draft)
       .sort((a, b) => b.date - a.date)
  );

  return {
    dir: { input: ".", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
