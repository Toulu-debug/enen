import axios from "axios";
import {readFileSync} from "fs";
import {o2s} from "../TS_USER_AGENTS";

let account: { pushplus?: string, pt_pin: string }[] = JSON.parse(readFileSync("./utils/account.json").toString());

export async function pushplus(title: string, content: string, template: string = 'html') {
  for (let user of account) {
    if (content.includes(decodeURIComponent(user.pt_pin)) && user.pushplus) {
      console.log(`[Pushplus] => ${decodeURIComponent(user.pt_pin)}`);
      await send(user.pushplus, title, content, template)
    }
  }
}

async function send(token: string, title, content: string, template: string) {
  let {data}: any = await axios.post('https://www.pushplus.plus/send', {
    token: token,
    title: title,
    content: content,
    template: template
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (data.code === 200) {
    console.log('pushplus发送成功')
  } else {
    o2s(data, 'pushplus发送失败')
  }
}