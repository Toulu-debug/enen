import {format} from 'date-fns';
const axios = require('axios')
const CryptoJS = require('crypto-js')

console.log('当前时间：', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
console.log('时间戳：', format(new Date(), 'yyyyMMddHHmmssSSS'));

let $: any = {};
$.name = 'hello world';
$.appId = 10028;
$.UA = require('./USER_AGENTS').USER_AGENT;
console.log('UA:', $.UA);
console.log('msg:', $.name);


!(async () => {
    await requestAlgo();

    let url = `https://m.jingxi.com/jxmc/queryservice/GetHomePageInfo?channel=7&sceneid=1001&_stk=channel%2Csceneid&_ste=1&sceneval=2`;
    let h5st = decrypt('channel,sceneid', '', url);
    console.log('时间加密：', h5st);

    console.log('test end');
})()

async function requestAlgo() {
    $.fingerprint = await generateFp();
    return new Promise(async resolve => {
        let {data} = await axios.post('https://cactus.jd.com/request_algo?g_ty=ajax', {
            "version": "1.0",
            "fp": $.fingerprint,
            "appId": $.appId,
            "timestamp": Date.now(),
            "platform": "web",
            "expandParams": ""
        }, {
            "headers": {
                'Authority': 'cactus.jd.com',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Accept': 'application/json',
                'User-Agent': $.UA,
                'Content-Type': 'application/json',
                'Origin': 'https://st.jingxi.com',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://st.jingxi.com/',
                'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
            },
        })
        if (data['status'] === 200) {
            $.token = data.data.result.tk;
            console.log('token:', $.token)
            let enCryptMethodJDString = data.data.result.algo;
            console.log('enCryptMethodJDString:', enCryptMethodJDString)
            if (enCryptMethodJDString) $.enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
        } else {
            console.log(`fp: ${$.fingerprint}`)
            console.log('request_algo 签名参数API请求失败:')
        }
        resolve(200)
    })
}

function decrypt(stk: string, type: number | string, url: string) {
    const timestamp = (format(new Date(), 'yyyyMMddhhmmssSSS'))
    let hash1 = '';
    if ($.fingerprint && $.token && $.enCryptMethodJD) {
        hash1 = $.enCryptMethodJD($.token, $.fingerprint.toString(), timestamp.toString(), $.appId.toString(), CryptoJS).toString(CryptoJS.enc.Hex);
    } else {
        const random = '5gkjB6SpmC9s';
        $.token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
        $.fingerprint = 9686767825751161;
        // $.fingerprint = 7811850938414161;
        const str = `${$.token}${$.fingerprint}${timestamp}${$.appId}${random}`;
        hash1 = CryptoJS.SHA512(str, $.token).toString(CryptoJS.enc.Hex);
    }
    let st = '';
    stk.split(',').map((item, index) => {
        st += `${item}:${getQueryString(url, item)}${index === stk.split(',').length - 1 ? '' : '&'}`;
    })
    const hash2 = CryptoJS.HmacSHA256(st, hash1.toString()).toString(CryptoJS.enc.Hex);
    return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2)].join(";"))
}

function generateFp() {
    let e = "0123456789";
    let a = 13;
    let i = '';
    for (; a--;)
        i += e[Math.random() * e.length | 0];
    return (i + Date.now()).slice(0, 16)
}

function getQueryString(url: string, name: string) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = url.split('?')[1].match(reg);
    if (r != null) return unescape(r[2]);
    return '';
}

