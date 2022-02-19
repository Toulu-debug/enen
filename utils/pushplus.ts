import axios from "axios";
import {readFileSync} from "fs";

let account: { pushplus?: string, pt_pin: string }[] = JSON.parse(readFileSync("./utils/account.json").toString());

export async function pushplus(content: string) {
  for (let user of account) {
    if (content.includes(decodeURIComponent(user.pt_pin)) && user.pushplus) {
      console.log(`[Pushplus] => ${decodeURIComponent(user.pt_pin)}`);
      await send(user.pushplus, content)
    }
  }
}

async function send(token: string, content: string) {
  let {data}: any = await axios.post('https://www.pushplus.plus/send', {
    token: token,
    title: '京东红包',
    content: content,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (data.code === 200) {
    console.log('pushplus发送成功')
  }
}