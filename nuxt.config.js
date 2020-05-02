const TITLE = "読み上げあいうえお表"
const DESCRIPTION =
  "テキスト読み上げ機能付き、ブラウザで楽しく学べるあいうえお表です。お子様のひらがな学習にお役立てください。"
const URL = "https://aiueo.netlify.app/"
module.exports = {
  mode: "spa",
  head: {
    htmlAttrs: {
      lang: "ja"
    },
    title: TITLE,
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, user-scalable=no"
      },
      { hid: "description", name: "description", content: DESCRIPTION },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: TITLE
      },
      { hid: "og:type", property: "og:type", content: "website" },
      { hid: "og:url", property: "og:url", content: URL },
      {
        hid: "og:image",
        property: "og:image",
        content: URL + "/ogp.jpg"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  loading: { color: "#3B8070" },
  modules: ["@nuxtjs/pwa"],
  build: {
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
    }
  },
  manifest: {
    name: TITLE,
    title: TITLE,
    "og:title": TITLE,
    description: DESCRIPTION,
    "og:description": DESCRIPTION,
    lang: "ja",
    background_color: "#f9f8dc",
    display: "standalone"
  }
}
