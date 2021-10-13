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
var axios_1 = require("axios");
var ts_md5_1 = require("ts-md5");
var date_fns_1 = require("date-fns");
var sendNotify_1 = require("./sendNotify");
var validate_single_1 = require("./utils/validate_single");
var TS_USER_AGENTS_1 = require("./TS_USER_AGENTS");
var cookie, tasks, UserName, validate = '', message = '';
!(function () { return __awaiter(void 0, void 0, void 0, function () {
    var j, h, config, _i, config_1, bean, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!process.argv[2]) return [3 /*break*/, 15];
                cookie = unescape(process.argv[2]);
                if (!!validate) return [3 /*break*/, 2];
                return [4 /*yield*/, getValidate()];
            case 1:
                validate = _a.sent();
                console.log('validate:', validate);
                _a.label = 2;
            case 2:
                UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)[1]);
                console.log("\n\u5F00\u59CB\u3010\u4EAC\u4E1C\u8D26\u53F7\u3011" + UserName + "\n");
                j = 0;
                _a.label = 3;
            case 3:
                if (!(j < 10)) return [3 /*break*/, 7];
                console.log('init...');
                return [4 /*yield*/, init()];
            case 4:
                tasks = _a.sent();
                if (tasks.data)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, (0, TS_USER_AGENTS_1.wait)(200)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                j++;
                return [3 /*break*/, 3];
            case 7:
                h = new Date(tasks['currentTime']).getHours();
                config = void 0;
                _a.label = 8;
            case 8:
                _a.trys.push([8, 13, , 14]);
                if (h >= 0 && h < 8)
                    config = tasks.data['beanConfigs0'];
                if (h >= 8 && h < 16)
                    config = tasks.data['beanConfigs8'];
                if (h >= 16 && h < 24)
                    config = tasks.data['beanConfigs16'];
                _i = 0, config_1 = config;
                _a.label = 9;
            case 9:
                if (!(_i < config_1.length)) return [3 /*break*/, 12];
                bean = config_1[_i];
                console.log(bean.id, bean.giftName, bean.leftStock);
                if (!(bean.giftValue === 500)) return [3 /*break*/, 11];
                return [4 /*yield*/, exchange(bean.id)];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 9];
            case 12: return [3 /*break*/, 14];
            case 13:
                e_1 = _a.sent();
                console.log('beanConfigs Error');
                return [3 /*break*/, 14];
            case 14: return [3 /*break*/, 16];
            case 15:
                console.log('未收到Cookie');
                _a.label = 16;
            case 16:
                if (!message) return [3 /*break*/, 18];
                return [4 /*yield*/, (0, sendNotify_1.sendNotify)('宠汪汪500', message)];
            case 17:
                _a.sent();
                _a.label = 18;
            case 18: return [2 /*return*/];
        }
    });
}); })();
function getValidate() {
    return __awaiter(this, void 0, void 0, function () {
        var v;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new validate_single_1.JDJRValidator().run()];
                case 1:
                    v = _a.sent();
                    return [2 /*return*/, v.validate];
            }
        });
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var lkt, lks, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lkt = new Date().getTime().toString();
                    lks = ts_md5_1.Md5.hashStr('' + 'JL1VTNRadM68cIMQ' + lkt);
                    return [4 /*yield*/, axios_1["default"].get("https://jdjoy.jd.com/common/gift/getBeanConfigs?reqSource=h5&invokeKey=JL1VTNRadM68cIMQ&validate=" + validate, {
                            headers: {
                                'lkt': lkt,
                                'lks': lks,
                                'Host': 'jdjoy.jd.com',
                                'content-type': 'application/json',
                                'origin': 'https://h5.m.jd.com',
                                "User-Agent": TS_USER_AGENTS_1["default"],
                                'referer': 'https://jdjoy.jd.com/',
                                'cookie': cookie
                            }
                        })];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    });
}
function exchange(beanId) {
    return __awaiter(this, void 0, void 0, function () {
        var lkt, lks, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!1) return [3 /*break*/, 4];
                    if (!(new Date().getSeconds() < 50)) return [3 /*break*/, 1];
                    return [3 /*break*/, 4];
                case 1: return [4 /*yield*/, (0, TS_USER_AGENTS_1.wait)(100)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 0];
                case 4:
                    lkt = new Date().getTime();
                    console.log('exchange()', (0, date_fns_1.format)(lkt, 'hh:mm:ss:SSS'));
                    lks = ts_md5_1.Md5.hashStr('' + 'JL1VTNRadM68cIMQ' + lkt);
                    return [4 /*yield*/, axios_1["default"].post("https://jdjoy.jd.com/common/gift/new/exchange?reqSource=h5&invokeKey=JL1VTNRadM68cIMQ&validate=" + validate, JSON.stringify({ "buyParam": { "orderSource": 'pet', "saleInfoId": beanId }, "deviceInfo": {} }), {
                            headers: {
                                'lkt': lkt.toString(),
                                'lks': lks,
                                "Host": "jdjoy.jd.com",
                                "Accept-Language": "zh-cn",
                                "Content-Type": "application/json",
                                "Origin": "https://jdjoy.jd.com",
                                "User-Agent": TS_USER_AGENTS_1["default"],
                                "Referer": "https://jdjoy.jd.com/pet/index",
                                "Cookie": cookie
                            }
                        })];
                case 5:
                    data = (_a.sent()).data;
                    console.log(data);
                    if (data.errorCode === 'buy_success') {
                        message += UserName + '  500 Yes!\n';
                    }
                    return [2 /*return*/];
            }
        });
    });
}
