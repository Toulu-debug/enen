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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
exports.queryBean = void 0;
var TS_USER_AGENTS_1 = require("../TS_USER_AGENTS");
var date_fns_1 = require("date-fns");
var cookie, cookiesArr = [], res, UserName;
var today = (0, date_fns_1.getDate)(new Date());
function queryBean() {
    return __awaiter(this, void 0, void 0, function () {
        var arr, _a, _b, _c, index, value, p, beanIn, beanOut, flag, _d, _e, t, amount, date, e_1, e_2_1;
        var e_2, _f, e_3, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, TS_USER_AGENTS_1.requireConfig)(false)];
                case 1:
                    cookiesArr = _h.sent();
                    arr = [];
                    _h.label = 2;
                case 2:
                    _h.trys.push([2, 15, 16, 17]);
                    _a = __values(cookiesArr.entries()), _b = _a.next();
                    _h.label = 3;
                case 3:
                    if (!!_b.done) return [3 /*break*/, 14];
                    _c = __read(_b.value, 2), index = _c[0], value = _c[1];
                    cookie = value;
                    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)[1]);
                    p = 1, beanIn = 0, beanOut = 0, flag = true;
                    _h.label = 4;
                case 4:
                    if (!(p && flag)) return [3 /*break*/, 11];
                    _h.label = 5;
                case 5:
                    _h.trys.push([5, 8, , 10]);
                    return [4 /*yield*/, (0, TS_USER_AGENTS_1.post)('https://api.m.jd.com/client.action?functionId=getJingBeanBalanceDetail', "body=".concat(encodeURIComponent(JSON.stringify({ "pageSize": "20", "page": p.toString() })), "&appid=ld"), {
                            'Host': 'api.m.jd.com',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'user-agent': TS_USER_AGENTS_1["default"],
                            'Cookie': cookie
                        })];
                case 6:
                    res = _h.sent();
                    try {
                        for (_d = (e_3 = void 0, __values(res.detailList)), _e = _d.next(); !_e.done; _e = _d.next()) {
                            t = _e.value;
                            amount = parseInt(t.amount), date = (0, date_fns_1.getDate)(new Date(t.date));
                            if (date !== today) {
                                // console.log('pass', t.eventMassage, amount, t.date)
                                flag = false;
                                break;
                            }
                            // console.log(t.eventMassage, amount)
                            amount < 0 ? beanOut += amount : beanIn += amount;
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_g = _d["return"])) _g.call(_d);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    return [4 /*yield*/, (0, TS_USER_AGENTS_1.wait)(2000)];
                case 7:
                    _h.sent();
                    if (p < 50) {
                        p++;
                    }
                    else {
                        return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 10];
                case 8:
                    e_1 = _h.sent();
                    console.log('error', e_1);
                    return [4 /*yield*/, (0, TS_USER_AGENTS_1.wait)(2000)];
                case 9:
                    _h.sent();
                    return [3 /*break*/, 11];
                case 10: return [3 /*break*/, 4];
                case 11:
                    // console.log('收入', beanIn, '\n支出', beanOut, '\n')
                    arr.push({ name: UserName, In: beanIn, Out: Math.abs(beanOut) });
                    // message += `【京东账号${index + 1}】${UserName}\n收入  ${beanIn}\n支出  ${beanOut}\n\n`
                    return [4 /*yield*/, (0, TS_USER_AGENTS_1.wait)(2000)];
                case 12:
                    // message += `【京东账号${index + 1}】${UserName}\n收入  ${beanIn}\n支出  ${beanOut}\n\n`
                    _h.sent();
                    _h.label = 13;
                case 13:
                    _b = _a.next();
                    return [3 /*break*/, 3];
                case 14: return [3 /*break*/, 17];
                case 15:
                    e_2_1 = _h.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 17];
                case 16:
                    try {
                        if (_b && !_b.done && (_f = _a["return"])) _f.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 17: 
                // message ? await sendNotify("京豆变动", message) : ''
                return [2 /*return*/, arr];
            }
        });
    });
}
exports.queryBean = queryBean;
