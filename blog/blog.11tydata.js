export default {
  layout: "post.njk",
  category: "商務知識",
  eleventyComputed: {
    // 勾選「草稿」的文章不會產生網頁，也不會出現在列表與 sitemap
    permalink: (data) => (data.draft ? false : `/blog/${data.slug}/`),
    metaTitle: (data) => data.metaTitle || data.title
  }
};
