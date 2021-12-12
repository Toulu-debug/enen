/**
 * 使用CK1京粉转链
 */

const axios = require('axios');

const jdCookieNode = require('./jdCookie.js');
const {USER_AGENT} = require("./USER_AGENTS");

let cookiesArr = []
Object.keys(jdCookieNode).forEach((item) => {
  cookiesArr.push(jdCookieNode[item])
})

let id = process.argv[2] || '';
if (id) {
  let body = {
    funName: "getSuperClickUrl",
    param: {
      materialInfo: `https://item.jd.com/${id}.html`,
      ext1: "200|100_3|",
    },
  }

  axios.get(`https://api.m.jd.com/api?functionId=ConvertSuperLink&appid=u&_=${Date.now()}&body=${encodeURIComponent(JSON.stringify(body))}&loginType=2`, {
    headers: {
      Cookie: cookiesArr[0],
      Host: "api.m.jd.com",
      Referer: "https://servicewechat.com/wxf463e50cd384beda/114/page-frame.html",
      "User-Agent": USER_AGENT,
      "content-type": "application/json",
    }
  }).then(res => {
    try {
      console.log(res.data.data['skuName'])
      console.log(res.data.data['promotionUrl'])
      console.log(res.data.data['wlCommission'])
    } catch (e) {
      console.log('没有返利')
    }
  })
} else {
  console.log('未提供商品ID\nUsage: node jd_ConvertSuperLink.js [ID]\nExample: node jd_ConvertSuperLink.js 100026667858')
}