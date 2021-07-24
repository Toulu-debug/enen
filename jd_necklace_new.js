const $ = new Env('点点券二代目');

let joyytoken; // = "MDFLbmZBbzAxMQ==.elhUd1Z8XlN5XXtbUz9ceyIicQZyPFQ0EXpCUG1aZ1wYcxF6EAB1IHw6BXMFCSUhCV4tGiMgJBE7ExIudlMY.6d560ccc";
let joyytoken_count = 1;

function encrypt_3(e) {
  return function (e) {
    if (Array.isArray(e)) return encrypt_3_3(e)
  }(e) || function (e) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e)
  }(e) || function (e, t) {
    if (e) {
      if ("string" == typeof e) return encrypt_3_3(e, t);
      var n = Object.prototype.toString.call(e).slice(8, -1);
      return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? encrypt_3_3(e, t) : void 0
    }
  }(e) || function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
  }()
}

function encrypt_3_3(e, t) {
  (null == t || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
  return r
}

function rotateRight(n, x) {
  return ((x >>> n) | (x << (32 - n)));
}

function choice(x, y, z) {
  return ((x & y) ^ (~x & z));
}

function majority(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z));
}

function sha256_Sigma0(x) {
  return (rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x));
}

function sha256_Sigma1(x) {
  return (rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x));
}

function sha256_sigma0(x) {
  return (rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3));
}

function sha256_sigma1(x) {
  return (rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10));
}

function sha256_expand(W, j) {
  return (W[j & 0x0f] += sha256_sigma1(W[(j + 14) & 0x0f]) + W[(j + 9) & 0x0f] +
    sha256_sigma0(W[(j + 1) & 0x0f]));
}

/* Hash constant words K: */
var K256 = new Array(
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
);

/* global arrays */
var ihash, count, buffer;
var sha256_hex_digits = "0123456789abcdef";

/* Add 32-bit integers with 16-bit operations (bug in some JS-interpreters:
overflow) */
function safe_add(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff);
}

/* Initialise the SHA256 computation */
function sha256_init() {
  ihash = new Array(8);
  count = new Array(2);
  buffer = new Array(64);
  count[0] = count[1] = 0;
  ihash[0] = 0x6a09e667;
  ihash[1] = 0xbb67ae85;
  ihash[2] = 0x3c6ef372;
  ihash[3] = 0xa54ff53a;
  ihash[4] = 0x510e527f;
  ihash[5] = 0x9b05688c;
  ihash[6] = 0x1f83d9ab;
  ihash[7] = 0x5be0cd19;
}

/* Transform a 512-bit message block */
function sha256_transform() {
  var a, b, c, d, e, f, g, h, T1, T2;
  var W = new Array(16);

  /* Initialize registers with the previous intermediate value */
  a = ihash[0];
  b = ihash[1];
  c = ihash[2];
  d = ihash[3];
  e = ihash[4];
  f = ihash[5];
  g = ihash[6];
  h = ihash[7];

  /* make 32-bit words */
  for (var i = 0; i < 16; i++)
    W[i] = ((buffer[(i << 2) + 3]) | (buffer[(i << 2) + 2] << 8) | (buffer[(i << 2) + 1] <<
      16) | (buffer[i << 2] << 24));

  for (var j = 0; j < 64; j++) {
    T1 = h + sha256_Sigma1(e) + choice(e, f, g) + K256[j];
    if (j < 16) T1 += W[j];
    else T1 += sha256_expand(W, j);
    T2 = sha256_Sigma0(a) + majority(a, b, c);
    h = g;
    g = f;
    f = e;
    e = safe_add(d, T1);
    d = c;
    c = b;
    b = a;
    a = safe_add(T1, T2);
  }

  /* Compute the current intermediate hash value */
  ihash[0] += a;
  ihash[1] += b;
  ihash[2] += c;
  ihash[3] += d;
  ihash[4] += e;
  ihash[5] += f;
  ihash[6] += g;
  ihash[7] += h;
}

/* Read the next chunk of data and update the SHA256 computation */
function sha256_update(data, inputLen) {
  var i, index, curpos = 0;
  /* Compute number of bytes mod 64 */
  index = ((count[0] >> 3) & 0x3f);
  var remainder = (inputLen & 0x3f);

  /* Update number of bits */
  if ((count[0] += (inputLen << 3)) < (inputLen << 3)) count[1]++;
  count[1] += (inputLen >> 29);

  /* Transform as many times as possible */
  for (i = 0; i + 63 < inputLen; i += 64) {
    for (var j = index; j < 64; j++)
      buffer[j] = data.charCodeAt(curpos++);
    sha256_transform();
    index = 0;
  }

  /* Buffer remaining input */
  for (var j = 0; j < remainder; j++)
    buffer[j] = data.charCodeAt(curpos++);
}

/* Finish the computation by operations such as padding */
function sha256_final() {
  var index = ((count[0] >> 3) & 0x3f);
  buffer[index++] = 0x80;
  if (index <= 56) {
    for (var i = index; i < 56; i++)
      buffer[i] = 0;
  } else {
    for (var i = index; i < 64; i++)
      buffer[i] = 0;
    sha256_transform();
    for (var i = 0; i < 56; i++)
      buffer[i] = 0;
  }
  buffer[56] = (count[1] >>> 24) & 0xff;
  buffer[57] = (count[1] >>> 16) & 0xff;
  buffer[58] = (count[1] >>> 8) & 0xff;
  buffer[59] = count[1] & 0xff;
  buffer[60] = (count[0] >>> 24) & 0xff;
  buffer[61] = (count[0] >>> 16) & 0xff;
  buffer[62] = (count[0] >>> 8) & 0xff;
  buffer[63] = count[0] & 0xff;
  sha256_transform();
}

/* Split the internal hash values into an array of bytes */
function sha256_encode_bytes() {
  var j = 0;
  var output = new Array(32);
  for (var i = 0; i < 8; i++) {
    output[j++] = ((ihash[i] >>> 24) & 0xff);
    output[j++] = ((ihash[i] >>> 16) & 0xff);
    output[j++] = ((ihash[i] >>> 8) & 0xff);
    output[j++] = (ihash[i] & 0xff);
  }
  return output;
}

/* Get the internal hash as a hex string */
function sha256_encode_hex() {
  var output = new String();
  for (var i = 0; i < 8; i++) {
    for (var j = 28; j >= 0; j -= 4)
      output += sha256_hex_digits.charAt((ihash[i] >>> j) & 0x0f);
  }
  return output;
}

let utils = {
  getDefaultVal: function (e) {
    try {
      return {
        undefined: "u",
        false: "f",
        true: "t"
      } [e] || e
    } catch (t) {
      return e
    }
  },
  requestUrl: {
    gettoken: "".concat("https://", "bh.m.jd.com/gettoken"),
    bypass: "".concat("https://blackhole", ".m.jd.com/bypass")
  },
  getTouchSession: function () {
    var e = (new Date).getTime(),
      t = this.getRandomInt(1e3, 9999);
    return String(e) + String(t)
  },
  sha256: function (data) {
    sha256_init();
    sha256_update(data, data.length);
    sha256_final();
    return sha256_encode_hex().toUpperCase();
  },
  atobPolyfill: function (e) {
    return function (e) {
      var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      if (e = String(e).replace(/[\t\n\f\r ]+/g, ""), !/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/.test(e)) throw new TypeError("解密错误");
      e += "==".slice(2 - (3 & e.length));
      for (var n, r, i, o = "", a = 0; a < e.length;) n = t.indexOf(e.charAt(a++)) << 18 | t.indexOf(e.charAt(a++)) << 12 | (r = t.indexOf(e.charAt(a++))) << 6 | (i = t.indexOf(e.charAt(a++))), o += 64 === r ? String.fromCharCode(n >> 16 & 255) : 64 === i ? String.fromCharCode(n >> 16 & 255, n >> 8 & 255) : String.fromCharCode(n >> 16 & 255, n >> 8 & 255, 255 & n);
      return o
    }(e)
  },
  btoaPolyfill: function (e) {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    return function (e) {
      for (var n, r, i, o, a = "", s = 0, u = (e = String(e)).length % 3; s < e.length;) {
        if ((r = e.charCodeAt(s++)) > 255 || (i = e.charCodeAt(s++)) > 255 || (o = e.charCodeAt(s++)) > 255) throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");
        a += t.charAt((n = r << 16 | i << 8 | o) >> 18 & 63) + t.charAt(n >> 12 & 63) + t.charAt(n >> 6 & 63) + t.charAt(63 & n)
      }
      return u ? a.slice(0, u - 3) + "===".substring(u) : a
    }(unescape(encodeURIComponent(e)))
  },
  xorEncrypt: function (e, t) {
    for (var n = t.length, r = "", i = 0; i < e.length; i++) r += String.fromCharCode(e[i].charCodeAt() ^ t[i % n].charCodeAt());
    return r
  },
  encrypt1: function (e, t) {
    for (var n = e.length, r = t.toString(), i = [], o = "", a = 0, s = 0; s < r.length; s++) a >= n && (a %= n), o = (r.charCodeAt(s) ^ e.charCodeAt(a)) % 10, i.push(o), a += 1;
    return i.join().replace(/,/g, "")
  },
  len_Fun: function (e, t) {
    return "".concat(e.substring(t, e.length)) + "".concat(e.substring(0, t))
  },
  encrypt2: function (e, t) {
    var n = t.toString(),
      r = t.toString().length,
      i = parseInt((r + e.length) / 3),
      o = "",
      a = "";
    return r > e.length ? (o = this.len_Fun(n, i), a = this.encrypt1(e, o)) : (o = this.len_Fun(e, i), a = this.encrypt1(n, o)), a
  },
  addZeroFront: function (e) {
    return e && e.length >= 5 ? e : ("00000" + String(e)).substr(-5)
  },
  addZeroBack: function (e) {
    return e && e.length >= 5 ? e : (String(e) + "00000").substr(0, 5)
  },
  encrypt3: function (e, t) {
    var n = this.addZeroBack(t).toString().substring(0, 5),
      r = this.addZeroFront(e).substring(e.length - 5),
      i = n.length,
      o = encrypt_3(Array(i).keys()),
      a = [];
    return o.forEach(function (e) {
      a.push(Math.abs(n.charCodeAt(e) - r.charCodeAt(e)))
    }), a.join().replace(/,/g, "")
  },
  getCurrentDate: function () {
    return new Date
  },
  getCurrentTime: function () {
    return this.getCurrentDate().getTime()
  },
  getRandomInt: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
      t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 9;
    return e = Math.ceil(e), t = Math.floor(t), Math.floor(Math.random() * (t - e + 1)) + e
  },
  getRandomWord: function (e) {
    for (var t = "", n = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", r = 0; r < e; r++) {
      var i = Math.round(Math.random() * (n.length - 1));
      t += n.substring(i, i + 1)
    }
    return t
  },
  getNumberInString: function (e) {
    return Number(e.replace(/[^0-9]/gi, ""))
  },
  getSpecialPosition: function (e) {
    for (var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], n = ((e = String(e)).length, t ? 1 : 0), r = "", i = 0; i < e.length; i++) i % 2 === n && (r += e[i]);
    return r
  },
  getLastAscii: function (e) {
    var t = e.charCodeAt(0).toString();
    return t[t.length - 1]
  },
  toAscii: function (e) {
    var t = "";
    for (var n in e) {
      var r = e[n],
        i = /[a-zA-Z]/.test(r);
      e.hasOwnProperty(n) && (t += i ? this.getLastAscii(r) : r)
    }
    return t
  },
  add0: function (e, t) {
    return (Array(t).join("0") + e).slice(-t)
  },
  minusByByte: function (e, t) {
    var n = e.length,
      r = t.length,
      i = Math.max(n, r),
      o = this.toAscii(e),
      a = this.toAscii(t),
      s = "",
      u = 0;
    for (n !== r && (o = this.add0(o, i), a = this.add0(a, i)); u < i;) s += Math.abs(o[u] - a[u]), u++;
    return s
  },
  Crc32: function (str) {
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
    crc = 0 ^ (-1);
    var n = 0; //a number between 0 and 255
    var x = 0; //an hex number

    for (var i = 0, iTop = str.length; i < iTop; i++) {
      n = (crc ^ str.charCodeAt(i)) & 0xFF;
      x = "0x" + table.substr(n * 9, 8);
      crc = (crc >>> 8) ^ x;
    }
    return (crc ^ (-1)) >>> 0;
  },
  getCrcCode: function (e) {
    var t = "0000000",
      n = "";
    try {
      n = this.Crc32(e).toString(36), t = this.addZeroToSeven(n)
    } catch (e) {
    }
    return t
  },
  addZeroToSeven: function (e) {
    return e && e.length >= 7 ? e : ("0000000" + String(e)).substr(-7)
  },
  getInRange: function (e, t, n) {
    var r = [];
    return e.map(function (e, i) {
      e >= t && e <= n && r.push(e)
    }), r
  },
  RecursiveSorting: function () {
    var e = this,
      t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      n = {},
      r = t;
    if ("[object Object]" == Object.prototype.toString.call(r)) {
      var i = Object.keys(r).sort(function (e, t) {
        return e < t ? -1 : e > t ? 1 : 0
      });
      i.forEach(function (t) {
        var i = r[t];
        if ("[object Object]" === Object.prototype.toString.call(i)) {
          var o = e.RecursiveSorting(i);
          n[t] = o
        } else if ("[object Array]" === Object.prototype.toString.call(i)) {
          for (var a = [], s = 0; s < i.length; s++) {
            var u = i[s];
            if ("[object Object]" === Object.prototype.toString.call(u)) {
              var c = e.RecursiveSorting(u);
              a[s] = c
            } else a[s] = u
          }
          n[t] = a
        } else n[t] = i
      })
    } else n = t;
    return n
  },
  objToString2: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      t = "";
    return Object.keys(e).forEach(function (n) {
      var r = e[n];
      null != r && (t += r instanceof Object || r instanceof Array ? "".concat("" === t ? "" : "&").concat(n, "=").concat(JSON.stringify(r)) : "".concat("" === t ? "" : "&").concat(n, "=").concat(r))
    }), t
  },
  getKey: function (e, t, n) {
    let r = this;
    return {
      1: function () {
        var e = r.getNumberInString(t),
          i = r.getSpecialPosition(n);
        return Math.abs(e - i)
      },
      2: function () {
        var e = r.getSpecialPosition(t, !1),
          i = r.getSpecialPosition(n);
        return r.minusByByte(e, i)
      },
      3: function () {
        var e = t.slice(0, 5),
          i = String(n).slice(-5);
        return r.minusByByte(e, i)
      },
      4: function () {
        return r.encrypt1(t, n)
      },
      5: function () {
        return r.encrypt2(t, n)
      },
      6: function () {
        return r.encrypt3(t, n)
      }
    } [e]()
  },
  decipherJoyToken: function (e, t) {
    let m = this;
    var n = {
      jjt: "a",
      expire: m.getCurrentTime(),
      outtime: 3,
      time_correction: !1
    };
    var r = "",
      i = e.indexOf(t) + t.length,
      o = e.length;
    if ((r = (r = e.slice(i, o).split(".")).map(function (e) {
      return m.atobPolyfill(e)
    }))[1] && r[0] && r[2]) {
      var a = r[0].slice(2, 7),
        s = r[0].slice(7, 9),
        u = m.xorEncrypt(r[1] || "", a).split("~");
      n.outtime = u[3] - 0, n.encrypt_id = u[2], n.jjt = "t";
      var c = u[0] - 0 || 0;
      c && "number" == typeof c && (n.time_correction = !0, n.expire = c);
      var l = c - m.getCurrentTime() || 0;
      return n.q = l, n.cf_v = s, n
    }
    return n
  },
  sha1: function (s) {
    var data = new Uint8Array(this.encodeUTF8(s))
    var i, j, t;
    var l = ((data.length + 8) >>> 6 << 4) + 16,
      s = new Uint8Array(l << 2);
    s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
    for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2);
    s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
    s[l - 1] = data.length << 3;
    var w = [],
      f = [
        function () {
          return m[1] & m[2] | ~m[1] & m[3];
        },
        function () {
          return m[1] ^ m[2] ^ m[3];
        },
        function () {
          return m[1] & m[2] | m[1] & m[3] | m[2] & m[3];
        },
        function () {
          return m[1] ^ m[2] ^ m[3];
        }
      ],
      rol = function (n, c) {
        return n << c | n >>> (32 - c);
      },
      k = [1518500249, 1859775393, -1894007588, -899497514],
      m = [1732584193, -271733879, null, null, -1009589776];
    m[2] = ~m[0], m[3] = ~m[1];
    for (var i = 0; i < s.length; i += 16) {
      var o = m.slice(0);
      for (j = 0; j < 80; j++)
        w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
          t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
          m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
      for (j = 0; j < 5; j++) m[j] = m[j] + o[j] | 0;
    }
    ;
    t = new DataView(new Uint32Array(m).buffer);
    for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);

    var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
      return (e < 16 ? "0" : "") + e.toString(16);
    }).join("");
    return hex.toString().toUpperCase();
  },
  encodeUTF8: function (s) {
    var i, r = [],
      c, x;
    for (i = 0; i < s.length; i++)
      if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
      else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
      else {
        if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
          c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
            r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
        else r.push(0xE0 + (c >> 12 & 0xF));
        r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
      }
    ;
    return r;
  },
  gettoken: function () {
    const https = require('https');
    var body = `content={"appname":"50082","whwswswws":"","jdkey":"","body":{"platform":"1"}}`;
    return new Promise((resolve, reject) => {
      let options = {
        hostname: "bh.m.jd.com",
        port: 443,
        path: "/gettoken",
        method: "POST",
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          "Host": "bh.m.jd.com",
          "Origin": "https://h5.m.jd.com",
          "X-Requested-With": "com.jingdong.app.mall",
          "Referer": "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html",
          "User-Agent": `jdapp;android;10.0.2;9;8363237353630343334383837333-73D2164353034363465693662666;network/wifi;model/MI 8;addressid/138087843;aid/0a4fc8ec9548a7f9;oaid/3ac46dd4d42fa41c;osVer/28;appBuild/88569;partner/jingdong;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 9; MI 8 Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045715 Mobile Safari/537.36`,
        }
      }
      const req = https.request(options, (res) => {
        res.setEncoding('utf-8');
        let rawData = '';
        res.on('error', reject);
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => resolve(rawData));
      });
      req.write(body);
      req.on('error', reject);
      req.end();
    });
  },
  get_risk_result: async function ($) {
    var appid = "50082";
    var TouchSession = this.getTouchSession();
    if (!joyytoken || joyytoken_count > 18) {
      joyytoken = JSON.parse(await this.gettoken())["joyytoken"];
      //console.log("第一次请求joyytoken");
      joyytoken_count = 0;
    }
    joyytoken_count++;
    let riskData;
    switch ($.action) {
      case 'startTask':
        riskData = {
          taskId: $.id
        };
        break;
      case 'chargeScores':
        riskData = {
          bubleId: $.id
        };
        break;
      case 'sign':
        riskData = {};
      default:
        break;
    }

    var random = Math.floor(1e+6 * Math.random()).toString().padEnd(6, '8');
    var senddata = this.objToString2(this.RecursiveSorting({
      pin: $.UserName,
      random,
      ...riskData
    }));
    var time = this.getCurrentTime();
    // time = 1626970587918;
    var encrypt_id = this.decipherJoyToken(appid + joyytoken, appid)["encrypt_id"].split(",");
    var nonce_str = this.getRandomWord(10);
    // nonce_str="iY8uFBbYX7";
    var key = this.getKey(encrypt_id[2], nonce_str, time);

    var str1 = `${senddata}&token=${joyytoken}&time=${time}&nonce_str=${nonce_str}&key=${key}&is_trust=1`;
    //console.log(str1);
    str1 = this.sha1(str1);
    var outstr = [time, "1" + nonce_str + joyytoken, encrypt_id[2] + "," + encrypt_id[3]];
    outstr.push(str1);
    outstr.push(this.getCrcCode(str1));
    outstr.push("C");
    var data = {
      aj: "u",
      bd: senddata,
      blog: "a",
      cf_v: "01",
      ci: "w3.1.0",
      cs: "2d148afa43e1a58dd9ab2993bb93343f",
      fpb: "",
      grn: 1,
      ioa: "fffffftt",
      jj: 1,
      jk: "-a45046de9fbf-0a4fc8ec9548a7f9",
      mj: [1, 0, 0],
      msg: "",
      nav: "88569",
      np: "Linux aarch64",
      nv: "Google Inc.",
      pdn: [],
      ro: ["f", "f", "f", "f", "f", "f", "f"],
      scr: [818, 393],
      ss: TouchSession,
      t: time,
      tm: [],
      tnm: [],
      wea: "ffttttua",
      wed: "ttttt",
    };
    //console.log(data);
    //console.log(JSON.stringify(data));
    data = new Buffer.from(this.xorEncrypt(JSON.stringify(data), key)).toString('base64');
    //console.log(data);
    outstr.push(data);
    outstr.push(this.getCrcCode(data));
    //console.log(outstr.join("~"));
    $.joyytoken = `joyytoken=${appid + joyytoken};`;
    return {
      extraData: {
        log: outstr.join("~"),
        sceneid: "DDhomePageh5"
      },
      ...riskData,
      random,
    };
  }
}

let cookiesArr = [], cookie = '', jdFruitShareArr = [], isBox = false, notify, newShareCodes, allMessage = '';
let body = '', res = '', uuid = 'fc13275e23b2613e6aae772533ca6f349d2e0a86', ua='';

!(async () => {
  await requireConfig();

  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.cookie = cookie;
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      ua = `jdapp;android;10.0.2;9;${randomString(28)}-${randomString(28)};`
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await main();
    }
  }
  if ($.isNode() && allMessage) {
    // await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: openUrl })
  }
})()

async function main() {
  try {
    let result = (await api('necklace_homePage', {}))['data']['result'];
    writeFile(JSON.stringify(result))
    $.lastRequestTime = result.lastRequestTime
    try {
      if (result.signInfo.todayCurrentSceneSignStatus === 1) {
        $.action = 'sign';
        body = await utils.get_risk_result($)
        console.log(body)
        res = await api('necklace_sign', body);
        try {
          res.data.biz_code === 0 ? console.log('签到成功！获得', res.data.result.totalScoreNum) : console.log('签到失败！', JSON.stringify(res))
        } catch (e) {
          console.log("Signin Error: ", res)
        }
      }
    } catch (e) {
      console.log('没有获取到签到信息！')
    }
    await $.wait(3000)

    for (let t of result.taskConfigVos) {
      // console.log(t.id, t.taskName, t.taskType, t.taskStage)
      if (t.taskStage === 0 || t.taskStage === 1) {
        if (t.taskType === 2) {
          console.log(t.taskType, t.id, t.taskName, t.taskStage)
          if (t.taskStage === 0) {
            $.id = t.id
            $.action = 'startTask'
            let body = await utils.get_risk_result($)
            res = await api('necklace_startTask', body)
            console.log('startTask: ', res)
            await $.wait(3000)
          }
          body = {
            taskId: t.id,
            currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
          }
          res = await api('necklace_reportTask', body)
          console.log('reportTask: ', res)
          await $.wait(2000)
        } else if (t.taskType === 6) {
          console.log(t.taskType, t.id, t.taskName, t.taskStage)
          $.id = t.id
          $.action = 'startTask'
          body = await await utils.get_risk_result($)
          res = await api('necklace_startTask', body)
          console.log(res)
          res = await getTask(t.id)
          for (let t6 of res.data.result.taskItems) {
            console.log(t6.id, t6.title)
            res = await api('necklace_reportTask', {taskId: t.id, itemId: t6.id})
            console.log(res)
            await $.wait(2000)
          }
        }
        if (t.taskType === 4 || t.taskType === 3) {
          await homePageTask(t.taskType, t.id)
          await $.wait(2000)
        }
      }
    }

    result = (await api('necklace_homePage', {}))['data']['result'];
    for (let bubble of result.bubbles) {
      console.log('bubble:', bubble.score, bubble.id)
      $.action = 'chargeScores'
      $.id = bubble.id
      body = await utils.get_risk_result($)
      res = await api('necklace_chargeScores', body)
      try {
        res.data.biz_code === 0
          ? console.log('领奖成功！获得', res.data.result.giftScoreNum)
          : console.log('领奖失败！', JSON.stringify(res))
      } catch (e) {
        console.log('Bubble Error: ', res)
      }
      await $.wait(2000)
    }
  } catch (e) {
    console.log('运行失败，请手动进入app查看是否正常！')
    console.log('-----------')
    console.log(e)
    console.log('-----------')
  }
}

function api(fnId, body) {
  return new Promise(resolve => {
    $.post({
      url: `https://api.m.jd.com/api?appid=coupon-necklace&functionId=${fnId}&loginType=2&client=coupon-necklace&t=${Date.now()}`,
      headers: {
        'Host': 'api.m.jd.com',
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://h5.m.jd.com',
        'accept-language': 'zh-cn',
        'User-Agent': ua,
        'referer': 'https://h5.m.jd.com/',
        'cookie': cookie + $.joyytoken
      },
      body: `body=${escape(JSON.stringify(body))}`
    }, (err, resp, data) => {
      try {
        data = JSON.parse(data)
      } catch (e) {
        $.logErr('Error: ', e, resp)
      } finally {
        resolve(data)
      }
    })
  })
}

function getTask(tid) {
  return new Promise(resolve => {
    $.post({
      url: `https://api.m.jd.com/api?appid=coupon-necklace&functionId=necklace_getTask&loginType=2&client=coupon-necklace&t=${Date.now()}`,
      headers: {
        'Host': 'api.m.jd.com',
        'accept': 'application/json, text/plain, */*',
        'origin': 'https://h5.m.jd.com',
        'User-Agent': ua,
        'sec-fetch-mode': 'cors',
        'content-type': 'application/x-www-form-urlencoded',
        'x-requested-with': 'com.jingdong.app.mall',
        'sec-fetch-site': 'same-site',
        'referer': 'https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': cookie
      },
      body: `body=%7B%22taskId%22%3A${tid}%7D`
    }, (err, resp, data) => {
      try {
        data = JSON.parse(data)
        console.log(data)
      } catch (e) {
        $.logErr('Error: ', e, resp)
      } finally {
        resolve(data)
      }
    })
  })
}

async function homePageTask(taskType, id) {
  let functionId = 'getCcTaskList'
  let body = "area=16_1315_3486_59648&body=%7B%22pageClickKey%22%3A%22CouponCenter%22%2C%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22lat%22%3A%2224.49441271645999%22%2C%22globalLat%22%3A%2224.49335%22%2C%22lng%22%3A%22118.1447713674174%22%2C%22globalLng%22%3A%22118.1423%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=75afd018b5751e9ac4cba0b51b8adb3c&st=1624535152771&sv=101&uemps=0-0&uts=0f31TVRjBStsz%2BC9YKuTtbGZPv/xrvQQdSUKvavez1nEbzXO4dLo%2BXEvUHAXAd0VPmZqkUNAf2yO/fBM7ImhPYnyBrotzw06Kk7qP6mG42fhA1t5BkW3ZGLaQgPtiuosYOHPMyHpg%2BJ9ZQBP4g3zsSFq2DUWsTOZbb85I4ThMCgqvymyLl48ebUg7aQTle9CfTJVWu5gx0YZ/ScklgN9Pg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b"
  await getCcTaskList(functionId, body, taskType);
  if(id === 229){
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49441271645999%22%2C%22taskId%22%3A%22necklace_229%22%2C%22lng%22%3A%22118.1447713674174%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=57453a76ffe9440d7961b05405fb4f13&st=1624535165882&sv=110&uemps=0-0&uts=0f31TVRjBStsz%2BC9YKuTtbGZPv/xrvQQdSUKvavez1nEbzXO4dLo%2BXEvUHAXAd0VPmZqkUNAf2yO/fBM7ImhPYnyBrotzw06Kk7qP6mG42fhA1t5BkW3ZGLaQgPtiuosYOHPMyHpg%2BJ9ZQBP4g3zsSFq2DUWsTOZbb85I4ThMCgqvymyLl48ebUg7aQTle9CfTJVWu5gx0YZ/ScklgN9Pg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  }else if(id === 260){
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22hRRVbEkLST%2BoqUB6fhir%2BfMoJS814u0eqASGoy8xq0vV1m9X9zKoAVYtaZjcO4UsQaWNyUrMVkZK5HBZ5aJo5zQ%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49435886957707%22%2C%22taskId%22%3A%22necklace_260%22%2C%22lng%22%3A%22118.144791637343%22%2C%22eid%22%3A%22eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm%5C/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY%22%7D&build=167568&client=apple&clientVersion=9.4.2&d_brand=apple&d_model=iPhone12%2C1&eid=eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY&isBackground=N&joycious=51&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=ebf4ce8ecbb641054b00c00483b1cee85660d196&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=93249982ced7ec850c69de8b3e859dab&st=1624610691429&sv=110&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJSTfJm3Nbyn7GqB7OtrJRuHoZMYV%2Bs0mkEZsSwjxzwlDPXLeepml5BnM5XPZQmPVomYBHlkSfLJWR5D1y0Ovgf60fpjMS2gXL5aLh50cNO3cmx2GvVTaTeYxvRUl%2BpaW7HXsuBhxJgA6pUzd01tBX9yiFih8xvToesg91Nl8KcWGYzXJ2/hWKXg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  }else if(id === 267){
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49437467152672%22%2C%22taskId%22%3A%22necklace_267%22%2C%22lng%22%3A%22118.1447981202065%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=64e2361aa2a81068930c0c3325fd45ef&st=1624950832218&sv=111&uemps=0-0&uts=0f31TVRjBSsMGLCxYS3UIqlZl8dbXmnuZ4ayfhN43Ot1QaV41onc66czNm7agt5ZxuI/ZiEjTyLMd9C68bu6j250BhqFBz9aHYMZHRsZRt99av4Tsia77GOWxlDaSYf5ixm0pZhBRR4OQ%2BUBD6%2BPW4wCMOS5CO3/VI2cFHPfi%2BdGNinbfncIha86vGUGuGKiHSAf4rUFY4wrafX6Rksw7g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  }else if(id === 273){
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.494383110087%22%2C%22taskId%22%3A%22necklace_273%22%2C%22lng%22%3A%22118.1447767134287%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167741&client=apple&clientVersion=10.0.8&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=71&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=c5f1773c699259a32596629ff17c77af&st=1627034890276&sv=101&uemps=0-0&uts=0f31TVRjBSuc9dw/M%2Bj%2BYjMPuoLDUbUPjPag%2BZ5OSbdXPyIGbVBxfPOWG8Z24KZdpryfyfoAUE5oYfYi1SuqGZ5atF1ARqzdFrPeo%2BZQVMmuwn/nYDGsLdj0Q9HcidhJXAaY1ti0j023Mv4f/ls51fJl5ypecBgw2sWtd8KiGQncYOe9GxCz6tlkHuSHDk3zN6hF%2BN0deRJOqJP8OOrJog%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  }else if(id === 281){
    body = `area=16_1332_42932_43102&body=%7B%22shshshfpb%22%3A%22hRRVbEkLST%2BoqUB6fhir%2BfMoJS814u0eqASGoy8xq0vV1m9X9zKoAVYtaZjcO4UsQaWNyUrMVkZK5HBZ5aJo5zQ%3D%3D%22%2C%22globalLng%22%3A%22118.541458%22%2C%22globalLat%22%3A%2224.609455%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49440185204448%22%2C%22taskId%22%3A%22necklace_281%22%2C%22lng%22%3A%22118.1448096802756%22%2C%22eid%22%3A%22eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm%5C/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY%22%7D&build=167741&client=apple&clientVersion=10.0.8&d_brand=apple&d_model=iPhone12%2C1&eid=eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY&isBackground=N&joycious=51&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=ebf4ce8ecbb641054b00c00483b1cee85660d196&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=6bf1da7e3c218998ae5bd34a5b9b0d5c&st=1627088377408&sv=122&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJPuQXd3Iw2YAKsnsGHXGtpI6DTtbcnaz7p7QeCmsoL2Cl/BMWopi0bEL/HBdhfK3iH/oMP6POfCzGYqGUp9HjUx/7lG%2BGpzuUJ%2B7ZrAQF4UMuG2/9epLOLCkpw4w6EgF4FqamAtXxTBCJZ82M%2Bkm26wJx996BKm7JCzdQfT6pJ0aFbovPOlp71A%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  }
  if (taskType === '4') {
    console.log('需等待30秒')
    functionId = 'reportSinkTask'
    body = `&appid=XPMSGC2019&monitorSource=&uuid=16245525345801334814959&body=%7B%22platformType%22%3A%221%22%2C%22taskId%22%3A%22necklace_${id}%22%7D&client=m&clientVersion=4.6.0&area=16_1315_1316_59175&geo=%5Bobject%20Object%5D`
    await $.wait(15000);
  } else {
    console.log('需等待15秒')
    functionId = 'reportCcTask'
  }
  await $.wait(16000);
  await getCcTaskList(functionId, body, taskType);
}

function getCcTaskList(fn, body, taskType) {
  let url = `https://api.m.jd.com/client.action?functionId=${fn}`
  return new Promise(resolve => {
    if (fn === 'reportSinkTask') {
      url += body
      body = ''
    }
    $.post({
      url, body,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Length": "63",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "api.m.jd.com",
        "Origin": "https://h5.m.jd.com",
        "Cookie": cookie + $.joyytoken,
        "Referer": "https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html",
        "User-Agent": ua,
      }
    }, async (err, resp, data) => {
      try {
        if (taskType === 3 && fn === 'reportCcTask')
          console.log('点击首页领券图标(进入领券中心浏览15s)任务:', data)
        if (taskType === 4 && fn === 'reportSinkTask')
          console.log('点击“券后9.9”任务:', data)
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function randomString(e) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz2345678", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}

function writeFile(text) {
  if ($.isNode()) {
    const fs = require('fs');
    fs.writeFile('a.json', text, () => {
    })
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

function requireConfig() {
  return new Promise(resolve => {
    notify = $.isNode() ? require('./sendNotify') : '';
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
      };
    } else {
      cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
    }
    console.log(`共${cookiesArr.length}个京东账号\n`)
    resolve()
  })
}

function Env(t, e) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);

  class s {
    constructor(t) {
      this.env = t
    }

    send(t, e = "GET") {
      t = "string" == typeof t ? {url: t} : t;
      let s = this.get;
      return "POST" === e && (s = this.post), new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s)
        })
      })
    }

    get(t) {
      return this.send.call(this.env, t)
    }

    post(t) {
      return this.send.call(this.env, t, "POST")
    }
  }

  return new class {
    constructor(t, e) {
      this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
    }

    isNode() {
      return "undefined" != typeof module && !!module.exports
    }

    isQuanX() {
      return "undefined" != typeof $task
    }

    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon
    }

    isLoon() {
      return "undefined" != typeof $loon
    }

    toObj(t, e = null) {
      try {
        return JSON.parse(t)
      } catch {
        return e
      }
    }

    toStr(t, e = null) {
      try {
        return JSON.stringify(t)
      } catch {
        return e
      }
    }

    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) try {
        s = JSON.parse(this.getdata(t))
      } catch {
      }
      return s
    }

    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e)
      } catch {
        return !1
      }
    }

    getScript(t) {
      return new Promise(e => {
        this.get({url: t}, (t, s, i) => e(i))
      })
    }

    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"), n = {
          url: `http://${h}/v1/scripting/evaluate`,
          body: {script_text: t, mock_type: "cron", timeout: r},
          headers: {"X-Key": o, Accept: "*/*"}
        };
        this.post(n, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }

    loaddata() {
      if (!this.isNode()) return {};
      {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
        if (!s && !i) return {};
        {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i))
          } catch (t) {
            return {}
          }
        }
      }
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
      }
    }

    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (r = Object(r)[t], void 0 === r) return s;
      return r
    }

    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
    }

    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
        if (r) try {
          const t = JSON.parse(r);
          e = t ? this.lodash_get(t, i, "") : e
        } catch (t) {
          e = ""
        }
      }
      return e
    }

    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
        }
      } else s = this.setval(t, e);
      return s
    }

    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
    }

    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
    }

    initGotEnv(t) {
      this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
    }

    get(t, e = (() => {
    })) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
        const {statusCode: s, statusCode: i, headers: r, body: o} = t;
        e(null, {status: s, statusCode: i, headers: r, body: o}, o)
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
          }
        } catch (t) {
          this.logErr(t)
        }
      }).then(t => {
        const {statusCode: s, statusCode: i, headers: r, body: o} = t;
        e(null, {status: s, statusCode: i, headers: r, body: o}, o)
      }, t => {
        const {message: s, response: i} = t;
        e(s, i, i && i.body)
      }))
    }

    post(t, e = (() => {
    })) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.post(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
        const {statusCode: s, statusCode: i, headers: r, body: o} = t;
        e(null, {status: s, statusCode: i, headers: r, body: o}, o)
      }, t => e(t)); else if (this.isNode()) {
        this.initGotEnv(t);
        const {url: s, ...i} = t;
        this.got.post(s, i).then(t => {
          const {statusCode: s, statusCode: i, headers: r, body: o} = t;
          e(null, {status: s, statusCode: i, headers: r, body: o}, o)
        }, t => {
          const {message: s, response: i} = t;
          e(s, i, i && i.body)
        })
      }
    }

    time(t, e = null) {
      const s = e ? new Date(e) : new Date;
      let i = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
      return t
    }

    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) return t;
        if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {"open-url": t} : this.isSurge() ? {url: t} : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"];
            return {openUrl: e, mediaUrl: s}
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl;
            return {"open-url": e, "media-url": s}
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {url: e}
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
      }
    }

    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
    }

    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
    }

    wait(t) {
      return new Promise(e => setTimeout(e, t))
    }

    done(t = {}) {
      const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
      this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
    }
  }(t, e)
}
