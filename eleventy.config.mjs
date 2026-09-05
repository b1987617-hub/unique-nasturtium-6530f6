import anchor from "markdown-it-anchor";

export default function (eleventyConfig) {
  // ── 原有網站檔案原封不動搬過去 ──
  //
  // ⚠️ 這裡「不」明列檔名。曾經明列過，結果差點出事：
  //    _redirects 是後來才加進 main 的，不在清單裡 → 建置後不會被複製 →
  //    baseon.com.tw/line?src=xxx 直接 404，名片、招牌、DM 上的 QR 全部失效，
  //    而網站看起來完全正常。
  //    改成整批複製，新檔案會自動跟著走，不需要有人記得回來改這裡。
  for (const g of [
    "*.html", "*.webp", "*.png", "*.jpg", "*.svg", "*.ico",
    "*.txt", "*.xml", "*.pdf",
    "_headers", "_redirects",
    "admin", "blog/images"
  ]) {
    eleventyConfig.addPassthroughCopy(g);
  }

  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add("README.md");

  // ── 建置後自我檢查：原始碼裡有的檔，產出裡一定要有 ──
  //
  // 這是上面那個坑的保險。少一個檔就讓建置失敗，Netlify 就不會部署，
  // 現有網站原樣保留 —— 寧可紅字停下來，也不要安靜地上線一個壞掉的網站。
  eleventyConfig.on("eleventy.after", async () => {
    const fs = await import("node:fs");
    // 這些是「原始碼」，本來就不該原封不動出現在產出裡
    const sourceExt = [".njk", ".md", ".mjs", ".js", ".json", ".yml", ".yaml", ".toml", ".lock"];
    const missing = fs.readdirSync(".", { withFileTypes: true })
      .filter((d) => d.isFile() && !d.name.startsWith("."))
      .map((d) => d.name)
      .filter((n) => !sourceExt.some((e) => n.toLowerCase().endsWith(e)))
      .filter((n) => !fs.existsSync(`_site/${n}`));

    if (missing.length) {
      throw new Error(
        `建置產出少了這些檔案，部署會壞掉：${missing.join("、")}\n` +
        `→ 到 eleventy.config.mjs 的 passthroughCopy 補上對應的副檔名。`
      );
    }
    for (const must of ["index.html", "form.html", "_redirects", "_headers"]) {
      if (!fs.existsSync(`_site/${must}`)) {
        throw new Error(`關鍵檔案 ${must} 沒有被複製到 _site，建置中止。`);
      }
    }
  });

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

  // ── 分類 ──
  // 只有「真的有文章」的分類才會產生頁面。空的分類頁對讀者沒用，
  // 對 Google 來說還是「內容稀薄的列表頁」，會拖累整站。
  eleventyConfig.addCollection("categories", async (api) => {
    const meta = (await import("./_data/categories.js")).default;
    const posts = api.getFilteredByGlob("blog/*.md")
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.date - a.date);

    const seen = new Map();
    for (const p of posts) {
      const name = p.data.category || "商務知識";
      if (!seen.has(name)) seen.set(name, []);
      seen.get(name).push(p);
    }

    return [...seen.entries()].map(([name, list]) => {
      const m = meta[name] || {};
      return {
        name,
        title: m.title || name,
        slug: m.slug || encodeURIComponent(name),
        intro: m.intro || "",
        posts: list,
        count: list.length
      };
    }).sort((a, b) => b.count - a.count);
  });

  eleventyConfig.addFilter("catOf", (cats, name) =>
    (cats || []).find((c) => c.name === name) || null
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
