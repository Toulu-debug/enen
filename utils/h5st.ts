import axios from "axios"

async function getH5ST(fn: string, body: object, appid: string, fp: string, ua: string) {
  let {data} = await axios.post('https://sharecodepool.cnmb.win/api/h5st', {
    fn, body, appid, fp, ua
  })
  return data
}

export {
  getH5ST
}
