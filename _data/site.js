export default {
  url: "https://baseon.com.tw",
  name: "貝森國際商務中心",
  nameEn: "Baseon Space",
  ga4: "G-FLVE9T17K4",
  tagline: "賦予空間更高價值，陪企業走得更遠。",

  // ── NAP：全站唯一正解。schema 一律引用這裡，各頁不要自己寫死 ──
  addr: {
    street: "博愛街513號2樓",
    city: "竹北市",
    region: "新竹縣",
    postal: "302",
    country: "TW",
    full: "302 新竹縣竹北市博愛街513號2樓"
  },
  tel: "03-6561163",
  telE164: "+886-3-6561163",
  email: "baseonbc@baseon.com.tw",
  line: "https://line.me/R/ti/p/@baseonspace",
  lineId: "@baseonspace",
  fb: "https://www.facebook.com/baseonspace",
  hours: "Mo-Fr 09:00-18:00",
  hoursText: "週一至週五 9:00–18:00",

  // ── 加好友來源儀表板 /tools/line-stats/ ──
  lineStats: {
    // Apps Script 後端（跟 _redirects 裡的 /line 轉址是同一個部署）
    api: "https://script.google.com/macros/s/AKfycbxd9rt_rzQCUVjgzDDRlva3gEBzk3keELksy87RBbZgXvq5Xf9nNwpXDWLt4fzwi4iLqA/exec",
    // Google 登入用的 OAuth 網頁用戶端 ID。
    // 這是公開值（會出現在網頁原始碼裡），不是密鑰。
    // 到 console.cloud.google.com/apis/credentials 建立後填在這裡。
    clientId: ""
  }
};
