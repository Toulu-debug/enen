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
exports.post = exports.get = exports.jdpingou = exports.randomWord = exports.getShareCodePool = exports.getshareCodeHW = exports.randomNumString = exports.o2s = exports.randomString = exports.exceptCookie = exports.getJxToken = exports.getRandomNumberByRange = exports.wait = exports.getCookie = exports.getFarmShareCode = exports.getBeanShareCode = void 0;
var axios_1 = require("axios");
var ts_md5_1 = require("ts-md5");
var dotenv = require("dotenv");
var fs_1 = require("fs");
var sendNotify_1 = require("./sendNotify");
dotenv.config();
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
function getRandomNumberByRange(start, end) {
    end <= start && (end = start + 100);
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
function getCookie(check) {
    if (check === void 0) { check = false; }
    return __awaiter(this, void 0, void 0, function () {
        var pwd, cookiesArr, jdCookieNode, keys, i, cookie, username;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pwd = __dirname;
                    cookiesArr = [];
                    jdCookieNode = require('./jdCookie.js');
                    keys = Object.keys(jdCookieNode);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < keys.length)) return [3 /*break*/, 7];
                    cookie = jdCookieNode[keys[i]];
                    if (!!check) return [3 /*break*/, 2];
                    if (pwd.includes('/ql') && !pwd.includes('JDHelloWorld')) {
                    }
                    else {
                        cookiesArr.push(cookie);
                    }
                    return [3 /*break*/, 6];
                case 2: return [4 /*yield*/, checkCookie(cookie)];
                case 3:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    cookiesArr.push(cookie);
                    return [3 /*break*/, 6];
                case 4:
                    username = decodeURIComponent(jdCookieNode[keys[i]].match(/pt_pin=([^;]*)/)[1]);
                    console.log('Cookie失效', username);
                    return [4 /*yield*/, (0, sendNotify_1.sendNotify)('Cookie失效', '【京东账号】' + username)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log("\u5171".concat(cookiesArr.length, "\u4E2A\u4EAC\u4E1C\u8D26\u53F7\n"));
                    return [2 /*return*/, cookiesArr];
            }
        });
    });
}
exports.getCookie = getCookie;
function checkCookie(cookie) {
    return __awaiter(this, void 0, void 0, function () {
        var data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wait(3000)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios_1["default"].get("https://api.m.jd.com/client.action?functionId=GetJDUserInfoUnion&appid=jd-cphdeveloper-m&body=".concat(encodeURIComponent(JSON.stringify({ "orgFlag": "JD_PinGou_New", "callSource": "mainorder", "channel": 4, "isHomewhite": 0, "sceneval": 2 })), "&loginType=2&_=").concat(Date.now(), "&sceneval=2&g_login_type=1&callback=GetJDUserInfoUnion&g_ty=ls"), {
                            headers: {
                                'authority': 'api.m.jd.com',
                                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
                                'referer': 'https://home.m.jd.com/',
                                'cookie': cookie
                            }
                        })];
                case 3:
                    data = (_a.sent()).data;
                    data = JSON.parse(data.match(/GetJDUserInfoUnion\((.*)\)/)[1]);
                    return [2 /*return*/, data.retcode === '0'];
                case 4:
                    e_1 = _a.sent();
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function wait(timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
}
exports.wait = wait;
function getJxToken(cookie, phoneId) {
    if (phoneId === void 0) { phoneId = ''; }
    function generateStr(input) {
        var src = 'abcdefghijklmnopqrstuvwxyz1234567890';
        var res = '';
        for (var i = 0; i < input; i++) {
            res += src[Math.floor(src.length * Math.random())];
        }
        return res;
    }
    if (!phoneId)
        phoneId = generateStr(40);
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
function o2s(arr, title) {
    if (title === void 0) { title = ''; }
    title ? console.log(title, JSON.stringify(arr)) : console.log(JSON.stringify(arr));
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
function randomWord(n) {
    if (n === void 0) { n = 1; }
    var t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', a = t.length;
    var rnd = '';
    for (var i = 0; i < n; i++) {
        rnd += t.charAt(Math.floor(Math.random() * a));
    }
    return rnd;
}
exports.randomWord = randomWord;
function getshareCodeHW(key) {
    return __awaiter(this, void 0, void 0, function () {
        var shareCodeHW, i, data, e_2;
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
                    e_2 = _a.sent();
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
        var shareCode, i, data, e_3;
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
                    e_3 = _a.sent();
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
/*
async function wechat_app_msg(title: string, content: string, user: string) {
  let corpid: string = "", corpsecret: string = ""
  let {data: gettoken} = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`)
  let access_token: string = gettoken.access_token

  let {data: send} = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${access_token}`, {
    "touser": user,
    "msgtype": "text",
    "agentid": 1000002,
    "text": {
      "content": `${title}\n\n${content}`
    },
    "safe": 0
  })
  if (send.errcode === 0) {
    console.log('企业微信应用消息发送成功')
  } else {
    console.log('企业微信应用消息发送失败', send)
  }
}
*/
function getDevice() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get('https://betahub.cn/api/apple/devices/iPhone', {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
                        }
                    })];
                case 1:
                    data = (_a.sent()).data;
                    data = data[getRandomNumberByRange(0, 16)];
                    return [2 /*return*/, data.identifier];
            }
        });
    });
}
function getVersion(device) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get("https://betahub.cn/api/apple/firmwares/".concat(device), {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
                        }
                    })];
                case 1:
                    data = (_a.sent()).data;
                    data = data[getRandomNumberByRange(0, data.length)];
                    return [2 /*return*/, data.firmware_info.version];
            }
        });
    });
}
function jdpingou() {
    return __awaiter(this, void 0, void 0, function () {
        var device, version;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDevice()];
                case 1:
                    device = _a.sent();
                    return [4 /*yield*/, getVersion(device)];
                case 2:
                    version = _a.sent();
                    return [2 /*return*/, "jdpingou;iPhone;5.19.0;".concat(version, ";").concat(randomString(40), ";network/wifi;model/").concat(device, ";appBuild/100833;ADID/;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/").concat(getRandomNumberByRange(10, 90), ";pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148")];
            }
        });
    });
}
exports.jdpingou = jdpingou;
function get(url, headers) {
    return new Promise(function (resolve, reject) {
        axios_1["default"].get(url, {
            headers: headers
        }).then(function (res) {
            if (typeof res.data === 'string' && res.data.includes('jsonpCBK')) {
                resolve(JSON.parse(res.data.match(/jsonpCBK.?\(([\w\W]*)\);?/)[1]));
            }
            else {
                resolve(res.data);
            }
        })["catch"](function (err) {
            var _a, _b;
            reject({
                code: ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || -1,
                msg: ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.statusText) || err.message || 'error'
            });
        });
    });
}
exports.get = get;
function post(url, prarms, headers) {
    return new Promise(function (resolve, reject) {
        axios_1["default"].post(url, prarms, {
            headers: headers
        }).then(function (res) {
            resolve(res.data);
        })["catch"](function (err) {
            var _a, _b;
            reject({
                code: ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || -1,
                msg: ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.statusText) || err.message || 'error'
            });
        });
    });
}
exports.post = post;
exports["default"] = USER_AGENT;
