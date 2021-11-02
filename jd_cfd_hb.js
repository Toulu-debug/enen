"use strict";
/**
 * cfd 100
 * cron: 0 0 * * *
 */
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
var axios_1 = require("axios");
var date_fns_1 = require("date-fns");
var TS_USER_AGENTS_1 = require("./TS_USER_AGENTS");
var cookie = '', res = '', UserName, token = {};
!(function () { return __awaiter(void 0, void 0, void 0, function () {
    var cookiesArr, _i, _a, t;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, TS_USER_AGENTS_1.requestAlgo)()];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, TS_USER_AGENTS_1.requireConfig)()];
            case 2:
                cookiesArr = _b.sent();
                cookie = cookiesArr[0];
                UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)[1]);
                console.log("\n\u5F00\u59CB\u3010\u4EAC\u4E1C\u8D26\u53F7 " + UserName + "\n");
                token = (0, TS_USER_AGENTS_1.getJxToken)(cookie);
                return [4 /*yield*/, api('user/ExchangeState', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strZone', { dwType: '2' })];
            case 3:
                res = _b.sent();
                console.log(JSON.stringify(res));
                _i = 0, _a = res.hongbao;
                _b.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 12];
                t = _a[_i];
                console.log(t.strPrizeName, 'state:', t.dwState, 'num:', t.dwStockNum);
                if (!(t.strPrizeName === '100元')) return [3 /*break*/, 11];
                _b.label = 5;
            case 5:
                if (!1) return [3 /*break*/, 9];
                if (!(new Date().getSeconds() < 10)) return [3 /*break*/, 6];
                return [3 /*break*/, 9];
            case 6: return [4 /*yield*/, (0, TS_USER_AGENTS_1.wait)(200)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [3 /*break*/, 5];
            case 9:
                console.log('exchange:', (0, date_fns_1.format)(Date.now(), 'yyyy-MM-dd HH:mm:ss:SSS'));
                return [4 /*yield*/, api('user/ExchangePrize', '_cfd_t,bizCode,ddwPaperMoney,dwEnv,dwLvl,dwType,ptag,source,strPgUUNum,strPgtimestamp,strPhoneID,strPoolName,strZone', {
                        ddwPaperMoney: 100000,
                        dwLvl: 3,
                        dwType: 3,
                        strPgUUNum: token.strPgUUNum,
                        strPgtimestamp: token.strPgtimestamp,
                        strPhoneID: token.strPhoneID,
                        strPoolName: res.hongbaopool
                    })];
            case 10:
                res = _b.sent();
                console.log(res);
                return [3 /*break*/, 12];
            case 11:
                _i++;
                return [3 /*break*/, 4];
            case 12: return [2 /*return*/];
        }
    });
}); })();
function api(fn, stk, params) {
    return __awaiter(this, void 0, void 0, function () {
        var url, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://m.jingxi.com/jxbfd/" + fn + "?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=" + Date.now() + "&ptag=&_ste=1&_=" + Date.now() + "&sceneval=2&_stk=" + encodeURIComponent(stk);
                    url = (0, TS_USER_AGENTS_1.h5st)(url, stk, params, 10032);
                    return [4 /*yield*/, axios_1["default"].get(url, {
                            headers: {
                                'Host': 'm.jingxi.com',
                                'Referer': 'https://st.jingxi.com/',
                                'User-Agent': 'jdpingou',
                                'Cookie': cookie
                            }
                        })];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    });
}
