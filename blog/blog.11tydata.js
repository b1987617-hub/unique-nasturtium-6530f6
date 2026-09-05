export default {
  layout: "post.njk",
  category: "商務知識",
  eleventyComputed: {
    // 勾選「草稿」的文章不會產生網頁，也不會出現在列表與 sitemap
    permalink: (data) => (data.draft ? false : `/blog/${data.slug}/`),
    metaTitle: (data) => data.metaTitle || data.title,
    // 每篇文章自動有一個專屬的加好友追蹤來源，發文即生效，不用手動維護總表
    // /blog/business-registration-guide/ → seo_business_registration_guide
    lineSrc: (data) => "seo_" + String(data.slug || "unknown").replace(/-/g, "_")
  }
};
