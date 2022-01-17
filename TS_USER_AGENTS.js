"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.obj2str = exports.wechat_app_msg = exports.randomWord = exports.getShareCodePool = exports.getshareCodeHW = exports.randomNumString = exports.o2s = exports.resetHosts = exports.randomString = exports.exceptCookie = exports.h5st = exports.getJxToken = exports.decrypt = exports.requestAlgo = exports.getRandomNumberByRange = exports.wait = exports.requireConfig = exports.getFarmShareCode = exports.getBeanShareCode = exports.TotalBean = void 0;
var axios_1 = require("axios");
var ts_md5_1 = require("ts-md5");
var date_fns_1 = require("date-fns");
var dotenv = require("dotenv");
var fs_1 = require("fs");
var CryptoJS = require('crypto-js');
dotenv.config();
var fingerprint, token = '', enCryptMethodJD;
var USER_AGENTS = [
    "jdapp;android;10.0.2;10;network/wifi;Mozilla/5.0 (Linux; Android 10; ONEPLUS A5010 Build/QKQ1.191014.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
    "jdapp;iPhone;10.0.2;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;android;10.0.2;9;network/4g;Mozilla/5.0 (Linux; Android 9; Mi Note 3 Build/PKQ1.181007.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36",
    "jdapp;android;10.0.2;10;network/wifi;Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
    "jdapp;android;10.0.2;9;network/wifi;Mozilla/5.0 (Linux; Android 9; 16T Build/PKQ1.190616.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "jdapp;iPhone;10.0.2;13.6;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;13.6;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;13.5;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;14.1;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;13.3;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;13.7;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;14.1;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;13.3;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;13.4;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;14.3;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;android;10.0.2;9;network/wifi;Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "jdapp;android;10.0.2;11;network/wifi;Mozilla/5.0 (Linux; Android 11; Redmi K30 5G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045511 Mobile Safari/537.36",
    "jdapp;iPhone;10.0.2;11.4;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79",
    "jdapp;android;10.0.2;10;;network/wifi;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
    "jdapp;android;10.0.2;10;network/wifi;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
    "jdapp;android;10.0.2;10;network/wifi;Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36",
    "jdapp;android;10.0.2;9;network/wifi;Mozilla/5.0 (Linux; Android 9; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "jdapp;android;10.0.2;8.1.0;network/wifi;Mozilla/5.0 (Linux; Android 8.1.0; 16 X Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "jdapp;android;10.0.2;8.0.0;network/wifi;Mozilla/5.0 (Linux; Android 8.0.0; HTC U-3w Build/OPR6.170623.013; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36",
    "jdapp;iPhone;10.0.2;14.0.1;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;android;10.0.2;10;network/wifi;Mozilla/5.0 (Linux; Android 10; LYA-AL00 Build/HUAWEILYA-AL00L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
    "jdapp;iPhone;10.0.2;14.2;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;14.3;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;14.2;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;android;10.0.2;8.1.0;network/wifi;Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36",
    "jdapp;android;10.0.2;10;network/wifi;Mozilla/5.0 (Linux; Android 10; Redmi K20 Pro Premium Edition Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
    "jdapp;iPhone;10.0.2;14.3;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;iPhone;10.0.2;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    "jdapp;android;10.0.2;11;network/wifi;Mozilla/5.0 (Linux; Android 11; Redmi K20 Pro Premium Edition Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36",
    "jdapp;android;10.0.2;10;network/wifi;Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
    "jdapp;iPhone;10.0.2;14.1;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
];
function TotalBean(cookie) {
    return {
        cookie: cookie,
        isLogin: true,
        nickName: ''
    };
}
exports.TotalBean = TotalBean;
function getRandomNumberByRange(start, end) {
    return Math.floor(Math.random() * (end - start) + start);
}
exports.getRandomNumberByRange = getRandomNumberByRange;
var USER_AGENT = USER_AGENTS[getRandomNumberByRange(0, USER_AGENTS.length)];
function getBeanShareCode(cookie) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, axios_1["default"].post('https://api.m.jd.com/client.action', "functionId=plantBeanIndex&body=".concat(encodeURIComponent(JSON.stringify({ version: "9.0.0.1", "monitor_source": "plant_app_plant_index", "monitor_refer": "" })), "&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0"), {
                        headers: {
                            Cookie: cookie,
                            Host: "api.m.jd.com",
                            Accept: "*/*",
                            Connection: "keep-alive",
                            "User-Agent": USER_AGENT
                        }
                    })];
                case 1:
                    data = (_c.sent()).data;
                    if ((_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.jwordShareInfo) === null || _b === void 0 ? void 0 : _b.shareUrl)
                        return [2 /*return*/, data.data.jwordShareInfo.shareUrl.split('Uuid=')[1]];
                    else
                        return [2 /*return*/, ''];
                    return [2 /*return*/];
            }
        });
    });
}
exports.getBeanShareCode = getBeanShareCode;
function getFarmShareCode(cookie) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].post('https://api.m.jd.com/client.action?functionId=initForFarm', "body=".concat(encodeURIComponent(JSON.stringify({ "version": 4 })), "&appid=wh5&clientVersion=9.1.0"), {
                        headers: {
                            "cookie": cookie,
                            "origin": "https://home.m.jd.com",
                            "referer": "https://home.m.jd.com/myJd/newhome.action",
                            "User-Agent": USER_AGENT,
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })];
                case 1:
                    data = (_a.sent()).data;
                    if (data.farmUserPro)
                        return [2 /*return*/, data.farmUserPro.shareCode];
                    else
                        return [2 /*return*/, ''];
                    return [2 /*return*/];
            }
        });
    });
}
exports.getFarmShareCode = getFarmShareCode;
function requireConfig(index) {
    if (index === void 0) { index = -1; }
    return __awaiter(this, void 0, void 0, function () {
        var cookiesArr, jdCookieNode;
        return __generator(this, function (_a) {
            cookiesArr = [];
            jdCookieNode = require('./jdCookie.js');
            Object.keys(jdCookieNode).forEach(function (item) {
                if (jdCookieNode[item]) {
                    cookiesArr.push(jdCookieNode[item]);
                }
            });
            console.log("\u5171".concat(cookiesArr.length, "\u4E2A\u4EAC\u4E1C\u8D26\u53F7\n"));
            if (index != -1) {
                return [2 /*return*/, [cookiesArr[index]]];
            }
            else {
                return [2 /*return*/, cookiesArr];
            }
            return [2 /*return*/];
        });
    });
}
exports.requireConfig = requireConfig;
function wait(timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
}
exports.wait = wait;
function requestAlgo(appId) {
    if (appId === void 0) { appId = 10032; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            fingerprint = generateFp();
            return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var data, enCryptMethodJDString;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, axios_1["default"].post('https://cactus.jd.com/request_algo?g_ty=ajax', {
                                    "version": "1.0",
                                    "fp": fingerprint,
                                    "appId": appId,
                                    "timestamp": Date.now(),
                                    "platform": "web",
                                    "expandParams": ""
                                }, {
                                    "headers": {
                                        'Authority': 'cactus.jd.com',
                                        'Pragma': 'no-cache',
                                        'Cache-Control': 'no-cache',
                                        'Accept': 'application/json',
                                        'User-Agent': USER_AGENT,
                                        'Content-Type': 'application/json',
                                        'Origin': 'https://st.jingxi.com',
                                        'Sec-Fetch-Site': 'cross-site',
                                        'Sec-Fetch-Mode': 'cors',
                                        'Sec-Fetch-Dest': 'empty',
                                        'Referer': 'https://st.jingxi.com/',
                                        'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
                                    }
                                })];
                            case 1:
                                data = (_a.sent()).data;
                                if (data['status'] === 200) {
                                    token = data.data.result.tk;
                                    enCryptMethodJDString = data.data.result.algo;
                                    if (enCryptMethodJDString)
                                        enCryptMethodJD = new Function("return ".concat(enCryptMethodJDString))();
                                }
                                else {
                                    console.log("fp: ".concat(fingerprint));
                                    console.log('request_algo 签名参数API请求失败:');
                                }
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.requestAlgo = requestAlgo;
function generateFp() {
    var e = "0123456789";
    var a = 13;
    var i = '';
    for (; a--;)
        i += e[Math.random() * e.length | 0];
    return (i + Date.now()).slice(0, 16);
}
function getQueryString(url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.split('?')[1].match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return '';
}
function decrypt(stk, url, appId) {
    var timestamp = ((0, date_fns_1.format)(new Date(), 'yyyyMMddhhmmssSSS'));
    var hash1;
    if (fingerprint && token && enCryptMethodJD) {
        hash1 = enCryptMethodJD(token, fingerprint.toString(), timestamp.toString(), appId.toString(), CryptoJS).toString(CryptoJS.enc.Hex);
    }
    else {
        var random = '5gkjB6SpmC9s';
        token = "tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc";
        fingerprint = 9686767825751161;
        var str = "".concat(token).concat(fingerprint).concat(timestamp).concat(appId).concat(random);
        hash1 = CryptoJS.SHA512(str, token).toString(CryptoJS.enc.Hex);
    }
    var st = '';
    stk.split(',').map(function (item, index) {
        st += "".concat(item, ":").concat(getQueryString(url, item)).concat(index === stk.split(',').length - 1 ? '' : '&');
    });
    var hash2 = CryptoJS.HmacSHA256(st, hash1.toString()).toString(CryptoJS.enc.Hex);
    return encodeURIComponent(["".concat(timestamp.toString()), "".concat(fingerprint.toString()), "".concat(appId.toString()), "".concat(token), "".concat(hash2)].join(";"));
}
exports.decrypt = decrypt;
function h5st(url, stk, params, appId) {
    if (appId === void 0) { appId = 10032; }
    for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], val = _b[1];
        url += "&".concat(key, "=").concat(val);
    }
    url += '&h5st=' + decrypt(stk, url, appId);
    return url;
}
exports.h5st = h5st;
function getJxToken(cookie) {
    function generateStr(input) {
        var src = 'abcdefghijklmnopqrstuvwxyz1234567890';
        var res = '';
        for (var i = 0; i < input; i++) {
            res += src[Math.floor(src.length * Math.random())];
        }
        return res;
    }
    var phoneId = generateStr(40);
    var timestamp = Date.now().toString();
    var nickname = cookie.match(/pt_pin=([^;]*)/)[1];
    var jstoken = ts_md5_1.Md5.hashStr('' + decodeURIComponent(nickname) + timestamp + phoneId + 'tPOamqCuk9NLgVPAljUyIHcPRmKlVxDy');
    return {
        'strPgtimestamp': timestamp,
        'strPhoneID': phoneId,
        'strPgUUNum': jstoken
    };
}
exports.getJxToken = getJxToken;
function exceptCookie(filename) {
    if (filename === void 0) { filename = 'x.ts'; }
    var except = [];
    if ((0, fs_1.existsSync)('./utils/exceptCookie.json')) {
        try {
            except = JSON.parse((0, fs_1.readFileSync)('./utils/exceptCookie.json').toString() || '{}')[filename] || [];
        }
        catch (e) {
            console.log('./utils/exceptCookie.json JSON格式错误');
        }
    }
    return except;
}
exports.exceptCookie = exceptCookie;
function randomString(e, word) {
    e = e || 32;
    var t = word === 26 ? "012345678abcdefghijklmnopqrstuvwxyz" : "0123456789abcdef", a = t.length, n = "";
    for (var i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n;
}
exports.randomString = randomString;
function resetHosts() {
    try {
        (0, fs_1.writeFileSync)('/etc/hosts', '');
    }
    catch (e) {
    }
}
exports.resetHosts = resetHosts;
function o2s(arr) {
    console.log(JSON.stringify(arr));
}
exports.o2s = o2s;
function randomNumString(e) {
    e = e || 32;
    var t = '0123456789', a = t.length, n = "";
    for (var i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n;
}
exports.randomNumString = randomNumString;
function randomWord() {
    var t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', a = t.length;
    return t.charAt(Math.floor(Math.random() * a));
}
exports.randomWord = randomWord;
function getshareCodeHW(key) {
    return __awaiter(this, void 0, void 0, function () {
        var shareCodeHW, i, data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shareCodeHW = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 5)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, axios_1["default"].get('https://api.jdsharecode.xyz/api/HW_CODES')];
                case 3:
                    data = (_a.sent()).data;
                    shareCodeHW = data[key] || [];
                    if (shareCodeHW.length !== 0) {
                        return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 6];
                case 4:
                    e_1 = _a.sent();
                    console.log("getshareCodeHW Error, Retry...");
                    return [4 /*yield*/, wait(getRandomNumberByRange(2000, 6000))];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, shareCodeHW];
            }
        });
    });
}
exports.getshareCodeHW = getshareCodeHW;
function getShareCodePool(key, num) {
    return __awaiter(this, void 0, void 0, function () {
        var shareCode, i, data, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shareCode = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 2)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, axios_1["default"].get("https://api.jdsharecode.xyz/api/".concat(key, "/").concat(num))];
                case 3:
                    data = (_a.sent()).data;
                    shareCode = data.data || [];
                    console.log("\u968F\u673A\u83B7\u53D6".concat(num, "\u4E2A").concat(key, "\u6210\u529F\uFF1A").concat(JSON.stringify(shareCode)));
                    if (shareCode.length !== 0) {
                        return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 6];
                case 4:
                    e_2 = _a.sent();
                    console.log("getShareCodePool Error, Retry...");
                    return [4 /*yield*/, wait(getRandomNumberByRange(2000, 6000))];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, shareCode];
            }
        });
    });
}
exports.getShareCodePool = getShareCodePool;
function wechat_app_msg(title, content, user) {
    return __awaiter(this, void 0, void 0, function () {
        var corpid, corpsecret, gettoken, access_token, send;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    corpid = "", corpsecret = "";
                    return [4 /*yield*/, axios_1["default"].get("https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=".concat(corpid, "&corpsecret=").concat(corpsecret))];
                case 1:
                    gettoken = (_a.sent()).data;
                    access_token = gettoken.access_token;
                    return [4 /*yield*/, axios_1["default"].post("https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=".concat(access_token), {
                            "touser": user,
                            "msgtype": "text",
                            "agentid": 1000002,
                            "text": {
                                "content": "".concat(title, "\n\n").concat(content)
                            },
                            "safe": 0
                        })];
                case 2:
                    send = (_a.sent()).data;
                    if (send.errcode === 0) {
                        console.log('企业微信应用消息发送成功');
                    }
                    else {
                        console.log('企业微信应用消息发送失败', send);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.wechat_app_msg = wechat_app_msg;
function obj2str(obj) {
    return JSON.stringify(obj);
}
exports.obj2str = obj2str;
exports["default"] = USER_AGENT;
