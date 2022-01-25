/**
 * 东东农场
 * 活动入口：京东APP-我的-东东农场
 * 东东农场活动链接：https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html
 * 已支持IOS双京东账号,Node.js支持N个京东账号
 * 脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
 * ==========================Quantumultx=========================
 * [task_local]
 * #jd免费水果
 * 5 6-18/6 * * * jd_fruit.js, tag=东东农场, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdnc.png, enabled=true
 * =========================Loon=============================
 * [Script]
 * cron "5 6-18/6 * * *" script-path=jd_fruit.js,tag=东东农场
 *
 * =========================Surge============================
 * 东东农场 = type=cron,cronexp="5 6-18/6 * * *",wake-system=1,timeout=3600,script-path=jd_fruit.js
 *
 * =========================小火箭===========================
 * 东东农场 = type=cron,script-path=jd_fruit.js, cronexpr="5 6-18/6 * * *", timeout=3600, enable=true
 *
 * jd免费水果 搬的https://github.com/liuxiaoyucc/jd-helper/blob/a6f275d9785748014fc6cca821e58427162e9336/fruit/fruit.js
 */

const $ = new Env('东东农场');

console.log('\n====================Hello World====================\n')
;!function(t,r){"object"==typeof exports?module.exports=exports=r():"function"==typeof define&&define.amd?define([],r):t.CryptoJS=r()}(this,function(){var t=t||function(t,r){var e=Object.create||function(){function t(){}return function(r){var e;return t.prototype=r,e=new t,t.prototype=null,e}}(),i={},n=i.lib={},o=n.Base=function(){return{extend:function(t){var r=e(this);return t&&r.mixIn(t),r.hasOwnProperty("init")&&this.init!==r.init||(r.init=function(){r.$super.init.apply(this,arguments)}),r.init.prototype=r,r.$super=this,r},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),s=n.WordArray=o.extend({init:function(t,e){t=this.words=t||[],e!=r?this.sigBytes=e:this.sigBytes=4*t.length},toString:function(t){return(t||c).stringify(this)},concat:function(t){var r=this.words,e=t.words,i=this.sigBytes,n=t.sigBytes;if(this.clamp(),i%4)for(var o=0;o<n;o++){var s=e[o>>>2]>>>24-o%4*8&255;r[i+o>>>2]|=s<<24-(i+o)%4*8}else for(var o=0;o<n;o+=4)r[i+o>>>2]=e[o>>>2];return this.sigBytes+=n,this},clamp:function(){var r=this.words,e=this.sigBytes;r[e>>>2]&=4294967295<<32-e%4*8,r.length=t.ceil(e/4)},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(r){for(var e,i=[],n=function(r){var r=r,e=987654321,i=4294967295;return function(){e=36969*(65535&e)+(e>>16)&i,r=18e3*(65535&r)+(r>>16)&i;var n=(e<<16)+r&i;return n/=4294967296,n+=.5,n*(t.random()>.5?1:-1)}},o=0;o<r;o+=4){var a=n(4294967296*(e||t.random()));e=987654071*a(),i.push(4294967296*a()|0)}return new s.init(i,r)}}),a=i.enc={},c=a.Hex={stringify:function(t){for(var r=t.words,e=t.sigBytes,i=[],n=0;n<e;n++){var o=r[n>>>2]>>>24-n%4*8&255;i.push((o>>>4).toString(16)),i.push((15&o).toString(16))}return i.join("")},parse:function(t){for(var r=t.length,e=[],i=0;i<r;i+=2)e[i>>>3]|=parseInt(t.substr(i,2),16)<<24-i%8*4;return new s.init(e,r/2)}},h=a.Latin1={stringify:function(t){for(var r=t.words,e=t.sigBytes,i=[],n=0;n<e;n++){var o=r[n>>>2]>>>24-n%4*8&255;i.push(String.fromCharCode(o))}return i.join("")},parse:function(t){for(var r=t.length,e=[],i=0;i<r;i++)e[i>>>2]|=(255&t.charCodeAt(i))<<24-i%4*8;return new s.init(e,r)}},l=a.Utf8={stringify:function(t){try{return decodeURIComponent(escape(h.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return h.parse(unescape(encodeURIComponent(t)))}},f=n.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=l.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(r){var e=this._data,i=e.words,n=e.sigBytes,o=this.blockSize,a=4*o,c=n/a;c=r?t.ceil(c):t.max((0|c)-this._minBufferSize,0);var h=c*o,l=t.min(4*h,n);if(h){for(var f=0;f<h;f+=o)this._doProcessBlock(i,f);var u=i.splice(0,h);e.sigBytes-=l}return new s.init(u,l)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),u=(n.Hasher=f.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){f.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){t&&this._append(t);var r=this._doFinalize();return r},blockSize:16,_createHelper:function(t){return function(r,e){return new t.init(e).finalize(r)}},_createHmacHelper:function(t){return function(r,e){return new u.HMAC.init(t,e).finalize(r)}}}),i.algo={});return i}(Math);return function(){function r(t,r,e){for(var i=[],o=0,s=0;s<r;s++)if(s%4){var a=e[t.charCodeAt(s-1)]<<s%4*2,c=e[t.charCodeAt(s)]>>>6-s%4*2;i[o>>>2]|=(a|c)<<24-o%4*8,o++}return n.create(i,o)}var e=t,i=e.lib,n=i.WordArray,o=e.enc;o.Base64={stringify:function(t){var r=t.words,e=t.sigBytes,i=this._map;t.clamp();for(var n=[],o=0;o<e;o+=3)for(var s=r[o>>>2]>>>24-o%4*8&255,a=r[o+1>>>2]>>>24-(o+1)%4*8&255,c=r[o+2>>>2]>>>24-(o+2)%4*8&255,h=s<<16|a<<8|c,l=0;l<4&&o+.75*l<e;l++)n.push(i.charAt(h>>>6*(3-l)&63));var f=i.charAt(64);if(f)for(;n.length%4;)n.push(f);return n.join("")},parse:function(t){var e=t.length,i=this._map,n=this._reverseMap;if(!n){n=this._reverseMap=[];for(var o=0;o<i.length;o++)n[i.charCodeAt(o)]=o}var s=i.charAt(64);if(s){var a=t.indexOf(s);a!==-1&&(e=a)}return r(t,e,n)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(r){function e(t,r,e,i,n,o,s){var a=t+(r&e|~r&i)+n+s;return(a<<o|a>>>32-o)+r}function i(t,r,e,i,n,o,s){var a=t+(r&i|e&~i)+n+s;return(a<<o|a>>>32-o)+r}function n(t,r,e,i,n,o,s){var a=t+(r^e^i)+n+s;return(a<<o|a>>>32-o)+r}function o(t,r,e,i,n,o,s){var a=t+(e^(r|~i))+n+s;return(a<<o|a>>>32-o)+r}var s=t,a=s.lib,c=a.WordArray,h=a.Hasher,l=s.algo,f=[];!function(){for(var t=0;t<64;t++)f[t]=4294967296*r.abs(r.sin(t+1))|0}();var u=l.MD5=h.extend({_doReset:function(){this._hash=new c.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,r){for(var s=0;s<16;s++){var a=r+s,c=t[a];t[a]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}var h=this._hash.words,l=t[r+0],u=t[r+1],d=t[r+2],v=t[r+3],p=t[r+4],_=t[r+5],y=t[r+6],g=t[r+7],B=t[r+8],w=t[r+9],k=t[r+10],S=t[r+11],m=t[r+12],x=t[r+13],b=t[r+14],H=t[r+15],z=h[0],A=h[1],C=h[2],D=h[3];z=e(z,A,C,D,l,7,f[0]),D=e(D,z,A,C,u,12,f[1]),C=e(C,D,z,A,d,17,f[2]),A=e(A,C,D,z,v,22,f[3]),z=e(z,A,C,D,p,7,f[4]),D=e(D,z,A,C,_,12,f[5]),C=e(C,D,z,A,y,17,f[6]),A=e(A,C,D,z,g,22,f[7]),z=e(z,A,C,D,B,7,f[8]),D=e(D,z,A,C,w,12,f[9]),C=e(C,D,z,A,k,17,f[10]),A=e(A,C,D,z,S,22,f[11]),z=e(z,A,C,D,m,7,f[12]),D=e(D,z,A,C,x,12,f[13]),C=e(C,D,z,A,b,17,f[14]),A=e(A,C,D,z,H,22,f[15]),z=i(z,A,C,D,u,5,f[16]),D=i(D,z,A,C,y,9,f[17]),C=i(C,D,z,A,S,14,f[18]),A=i(A,C,D,z,l,20,f[19]),z=i(z,A,C,D,_,5,f[20]),D=i(D,z,A,C,k,9,f[21]),C=i(C,D,z,A,H,14,f[22]),A=i(A,C,D,z,p,20,f[23]),z=i(z,A,C,D,w,5,f[24]),D=i(D,z,A,C,b,9,f[25]),C=i(C,D,z,A,v,14,f[26]),A=i(A,C,D,z,B,20,f[27]),z=i(z,A,C,D,x,5,f[28]),D=i(D,z,A,C,d,9,f[29]),C=i(C,D,z,A,g,14,f[30]),A=i(A,C,D,z,m,20,f[31]),z=n(z,A,C,D,_,4,f[32]),D=n(D,z,A,C,B,11,f[33]),C=n(C,D,z,A,S,16,f[34]),A=n(A,C,D,z,b,23,f[35]),z=n(z,A,C,D,u,4,f[36]),D=n(D,z,A,C,p,11,f[37]),C=n(C,D,z,A,g,16,f[38]),A=n(A,C,D,z,k,23,f[39]),z=n(z,A,C,D,x,4,f[40]),D=n(D,z,A,C,l,11,f[41]),C=n(C,D,z,A,v,16,f[42]),A=n(A,C,D,z,y,23,f[43]),z=n(z,A,C,D,w,4,f[44]),D=n(D,z,A,C,m,11,f[45]),C=n(C,D,z,A,H,16,f[46]),A=n(A,C,D,z,d,23,f[47]),z=o(z,A,C,D,l,6,f[48]),D=o(D,z,A,C,g,10,f[49]),C=o(C,D,z,A,b,15,f[50]),A=o(A,C,D,z,_,21,f[51]),z=o(z,A,C,D,m,6,f[52]),D=o(D,z,A,C,v,10,f[53]),C=o(C,D,z,A,k,15,f[54]),A=o(A,C,D,z,u,21,f[55]),z=o(z,A,C,D,B,6,f[56]),D=o(D,z,A,C,H,10,f[57]),C=o(C,D,z,A,y,15,f[58]),A=o(A,C,D,z,x,21,f[59]),z=o(z,A,C,D,p,6,f[60]),D=o(D,z,A,C,S,10,f[61]),C=o(C,D,z,A,d,15,f[62]),A=o(A,C,D,z,w,21,f[63]),h[0]=h[0]+z|0,h[1]=h[1]+A|0,h[2]=h[2]+C|0,h[3]=h[3]+D|0},_doFinalize:function(){var t=this._data,e=t.words,i=8*this._nDataBytes,n=8*t.sigBytes;e[n>>>5]|=128<<24-n%32;var o=r.floor(i/4294967296),s=i;e[(n+64>>>9<<4)+15]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),e[(n+64>>>9<<4)+14]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),t.sigBytes=4*(e.length+1),this._process();for(var a=this._hash,c=a.words,h=0;h<4;h++){var l=c[h];c[h]=16711935&(l<<8|l>>>24)|4278255360&(l<<24|l>>>8)}return a},clone:function(){var t=h.clone.call(this);return t._hash=this._hash.clone(),t}});s.MD5=h._createHelper(u),s.HmacMD5=h._createHmacHelper(u)}(Math),function(){var r=t,e=r.lib,i=e.WordArray,n=e.Hasher,o=r.algo,s=[],a=o.SHA1=n.extend({_doReset:function(){this._hash=new i.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,r){for(var e=this._hash.words,i=e[0],n=e[1],o=e[2],a=e[3],c=e[4],h=0;h<80;h++){if(h<16)s[h]=0|t[r+h];else{var l=s[h-3]^s[h-8]^s[h-14]^s[h-16];s[h]=l<<1|l>>>31}var f=(i<<5|i>>>27)+c+s[h];f+=h<20?(n&o|~n&a)+1518500249:h<40?(n^o^a)+1859775393:h<60?(n&o|n&a|o&a)-1894007588:(n^o^a)-899497514,c=a,a=o,o=n<<30|n>>>2,n=i,i=f}e[0]=e[0]+i|0,e[1]=e[1]+n|0,e[2]=e[2]+o|0,e[3]=e[3]+a|0,e[4]=e[4]+c|0},_doFinalize:function(){var t=this._data,r=t.words,e=8*this._nDataBytes,i=8*t.sigBytes;return r[i>>>5]|=128<<24-i%32,r[(i+64>>>9<<4)+14]=Math.floor(e/4294967296),r[(i+64>>>9<<4)+15]=e,t.sigBytes=4*r.length,this._process(),this._hash},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}});r.SHA1=n._createHelper(a),r.HmacSHA1=n._createHmacHelper(a)}(),function(r){var e=t,i=e.lib,n=i.WordArray,o=i.Hasher,s=e.algo,a=[],c=[];!function(){function t(t){for(var e=r.sqrt(t),i=2;i<=e;i++)if(!(t%i))return!1;return!0}function e(t){return 4294967296*(t-(0|t))|0}for(var i=2,n=0;n<64;)t(i)&&(n<8&&(a[n]=e(r.pow(i,.5))),c[n]=e(r.pow(i,1/3)),n++),i++}();var h=[],l=s.SHA256=o.extend({_doReset:function(){this._hash=new n.init(a.slice(0))},_doProcessBlock:function(t,r){for(var e=this._hash.words,i=e[0],n=e[1],o=e[2],s=e[3],a=e[4],l=e[5],f=e[6],u=e[7],d=0;d<64;d++){if(d<16)h[d]=0|t[r+d];else{var v=h[d-15],p=(v<<25|v>>>7)^(v<<14|v>>>18)^v>>>3,_=h[d-2],y=(_<<15|_>>>17)^(_<<13|_>>>19)^_>>>10;h[d]=p+h[d-7]+y+h[d-16]}var g=a&l^~a&f,B=i&n^i&o^n&o,w=(i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22),k=(a<<26|a>>>6)^(a<<21|a>>>11)^(a<<7|a>>>25),S=u+k+g+c[d]+h[d],m=w+B;u=f,f=l,l=a,a=s+S|0,s=o,o=n,n=i,i=S+m|0}e[0]=e[0]+i|0,e[1]=e[1]+n|0,e[2]=e[2]+o|0,e[3]=e[3]+s|0,e[4]=e[4]+a|0,e[5]=e[5]+l|0,e[6]=e[6]+f|0,e[7]=e[7]+u|0},_doFinalize:function(){var t=this._data,e=t.words,i=8*this._nDataBytes,n=8*t.sigBytes;return e[n>>>5]|=128<<24-n%32,e[(n+64>>>9<<4)+14]=r.floor(i/4294967296),e[(n+64>>>9<<4)+15]=i,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=o.clone.call(this);return t._hash=this._hash.clone(),t}});e.SHA256=o._createHelper(l),e.HmacSHA256=o._createHmacHelper(l)}(Math),function(){function r(t){return t<<8&4278255360|t>>>8&16711935}var e=t,i=e.lib,n=i.WordArray,o=e.enc;o.Utf16=o.Utf16BE={stringify:function(t){for(var r=t.words,e=t.sigBytes,i=[],n=0;n<e;n+=2){var o=r[n>>>2]>>>16-n%4*8&65535;i.push(String.fromCharCode(o))}return i.join("")},parse:function(t){for(var r=t.length,e=[],i=0;i<r;i++)e[i>>>1]|=t.charCodeAt(i)<<16-i%2*16;return n.create(e,2*r)}};o.Utf16LE={stringify:function(t){for(var e=t.words,i=t.sigBytes,n=[],o=0;o<i;o+=2){var s=r(e[o>>>2]>>>16-o%4*8&65535);n.push(String.fromCharCode(s))}return n.join("")},parse:function(t){for(var e=t.length,i=[],o=0;o<e;o++)i[o>>>1]|=r(t.charCodeAt(o)<<16-o%2*16);return n.create(i,2*e)}}}(),function(){if("function"==typeof ArrayBuffer){var r=t,e=r.lib,i=e.WordArray,n=i.init,o=i.init=function(t){if(t instanceof ArrayBuffer&&(t=new Uint8Array(t)),(t instanceof Int8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array)&&(t=new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),t instanceof Uint8Array){for(var r=t.byteLength,e=[],i=0;i<r;i++)e[i>>>2]|=t[i]<<24-i%4*8;n.call(this,e,r)}else n.apply(this,arguments)};o.prototype=i}}(),function(r){function e(t,r,e){return t^r^e}function i(t,r,e){return t&r|~t&e}function n(t,r,e){return(t|~r)^e}function o(t,r,e){return t&e|r&~e}function s(t,r,e){return t^(r|~e)}function a(t,r){return t<<r|t>>>32-r}var c=t,h=c.lib,l=h.WordArray,f=h.Hasher,u=c.algo,d=l.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),v=l.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),p=l.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),_=l.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),y=l.create([0,1518500249,1859775393,2400959708,2840853838]),g=l.create([1352829926,1548603684,1836072691,2053994217,0]),B=u.RIPEMD160=f.extend({_doReset:function(){this._hash=l.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,r){for(var c=0;c<16;c++){var h=r+c,l=t[h];t[h]=16711935&(l<<8|l>>>24)|4278255360&(l<<24|l>>>8)}var f,u,B,w,k,S,m,x,b,H,z=this._hash.words,A=y.words,C=g.words,D=d.words,R=v.words,E=p.words,M=_.words;S=f=z[0],m=u=z[1],x=B=z[2],b=w=z[3],H=k=z[4];for(var F,c=0;c<80;c+=1)F=f+t[r+D[c]]|0,F+=c<16?e(u,B,w)+A[0]:c<32?i(u,B,w)+A[1]:c<48?n(u,B,w)+A[2]:c<64?o(u,B,w)+A[3]:s(u,B,w)+A[4],F|=0,F=a(F,E[c]),F=F+k|0,f=k,k=w,w=a(B,10),B=u,u=F,F=S+t[r+R[c]]|0,F+=c<16?s(m,x,b)+C[0]:c<32?o(m,x,b)+C[1]:c<48?n(m,x,b)+C[2]:c<64?i(m,x,b)+C[3]:e(m,x,b)+C[4],F|=0,F=a(F,M[c]),F=F+H|0,S=H,H=b,b=a(x,10),x=m,m=F;F=z[1]+B+b|0,z[1]=z[2]+w+H|0,z[2]=z[3]+k+S|0,z[3]=z[4]+f+m|0,z[4]=z[0]+u+x|0,z[0]=F},_doFinalize:function(){var t=this._data,r=t.words,e=8*this._nDataBytes,i=8*t.sigBytes;r[i>>>5]|=128<<24-i%32,r[(i+64>>>9<<4)+14]=16711935&(e<<8|e>>>24)|4278255360&(e<<24|e>>>8),t.sigBytes=4*(r.length+1),this._process();for(var n=this._hash,o=n.words,s=0;s<5;s++){var a=o[s];o[s]=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8)}return n},clone:function(){var t=f.clone.call(this);return t._hash=this._hash.clone(),t}});c.RIPEMD160=f._createHelper(B),c.HmacRIPEMD160=f._createHmacHelper(B)}(Math),function(){var r=t,e=r.lib,i=e.Base,n=r.enc,o=n.Utf8,s=r.algo;s.HMAC=i.extend({init:function(t,r){t=this._hasher=new t.init,"string"==typeof r&&(r=o.parse(r));var e=t.blockSize,i=4*e;r.sigBytes>i&&(r=t.finalize(r)),r.clamp();for(var n=this._oKey=r.clone(),s=this._iKey=r.clone(),a=n.words,c=s.words,h=0;h<e;h++)a[h]^=1549556828,c[h]^=909522486;n.sigBytes=s.sigBytes=i,this.reset()},reset:function(){var t=this._hasher;t.reset(),t.update(this._iKey)},update:function(t){return this._hasher.update(t),this},finalize:function(t){var r=this._hasher,e=r.finalize(t);r.reset();var i=r.finalize(this._oKey.clone().concat(e));return i}})}(),function(){var r=t,e=r.lib,i=e.Base,n=e.WordArray,o=r.algo,s=o.SHA1,a=o.HMAC,c=o.PBKDF2=i.extend({cfg:i.extend({keySize:4,hasher:s,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,r){for(var e=this.cfg,i=a.create(e.hasher,t),o=n.create(),s=n.create([1]),c=o.words,h=s.words,l=e.keySize,f=e.iterations;c.length<l;){var u=i.update(r).finalize(s);i.reset();for(var d=u.words,v=d.length,p=u,_=1;_<f;_++){p=i.finalize(p),i.reset();for(var y=p.words,g=0;g<v;g++)d[g]^=y[g]}o.concat(u),h[0]++}return o.sigBytes=4*l,o}});r.PBKDF2=function(t,r,e){return c.create(e).compute(t,r)}}(),function(){var r=t,e=r.lib,i=e.Base,n=e.WordArray,o=r.algo,s=o.MD5,a=o.EvpKDF=i.extend({cfg:i.extend({keySize:4,hasher:s,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,r){for(var e=this.cfg,i=e.hasher.create(),o=n.create(),s=o.words,a=e.keySize,c=e.iterations;s.length<a;){h&&i.update(h);var h=i.update(t).finalize(r);i.reset();for(var l=1;l<c;l++)h=i.finalize(h),i.reset();o.concat(h)}return o.sigBytes=4*a,o}});r.EvpKDF=function(t,r,e){return a.create(e).compute(t,r)}}(),function(){var r=t,e=r.lib,i=e.WordArray,n=r.algo,o=n.SHA256,s=n.SHA224=o.extend({_doReset:function(){this._hash=new i.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var t=o._doFinalize.call(this);return t.sigBytes-=4,t}});r.SHA224=o._createHelper(s),r.HmacSHA224=o._createHmacHelper(s)}(),function(r){var e=t,i=e.lib,n=i.Base,o=i.WordArray,s=e.x64={};s.Word=n.extend({init:function(t,r){this.high=t,this.low=r}}),s.WordArray=n.extend({init:function(t,e){t=this.words=t||[],e!=r?this.sigBytes=e:this.sigBytes=8*t.length},toX32:function(){for(var t=this.words,r=t.length,e=[],i=0;i<r;i++){var n=t[i];e.push(n.high),e.push(n.low)}return o.create(e,this.sigBytes)},clone:function(){for(var t=n.clone.call(this),r=t.words=this.words.slice(0),e=r.length,i=0;i<e;i++)r[i]=r[i].clone();return t}})}(),function(r){var e=t,i=e.lib,n=i.WordArray,o=i.Hasher,s=e.x64,a=s.Word,c=e.algo,h=[],l=[],f=[];!function(){for(var t=1,r=0,e=0;e<24;e++){h[t+5*r]=(e+1)*(e+2)/2%64;var i=r%5,n=(2*t+3*r)%5;t=i,r=n}for(var t=0;t<5;t++)for(var r=0;r<5;r++)l[t+5*r]=r+(2*t+3*r)%5*5;for(var o=1,s=0;s<24;s++){for(var c=0,u=0,d=0;d<7;d++){if(1&o){var v=(1<<d)-1;v<32?u^=1<<v:c^=1<<v-32}128&o?o=o<<1^113:o<<=1}f[s]=a.create(c,u)}}();var u=[];!function(){for(var t=0;t<25;t++)u[t]=a.create()}();var d=c.SHA3=o.extend({cfg:o.cfg.extend({outputLength:512}),_doReset:function(){for(var t=this._state=[],r=0;r<25;r++)t[r]=new a.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(t,r){for(var e=this._state,i=this.blockSize/2,n=0;n<i;n++){var o=t[r+2*n],s=t[r+2*n+1];o=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),s=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8);var a=e[n];a.high^=s,a.low^=o}for(var c=0;c<24;c++){for(var d=0;d<5;d++){for(var v=0,p=0,_=0;_<5;_++){var a=e[d+5*_];v^=a.high,p^=a.low}var y=u[d];y.high=v,y.low=p}for(var d=0;d<5;d++)for(var g=u[(d+4)%5],B=u[(d+1)%5],w=B.high,k=B.low,v=g.high^(w<<1|k>>>31),p=g.low^(k<<1|w>>>31),_=0;_<5;_++){var a=e[d+5*_];a.high^=v,a.low^=p}for(var S=1;S<25;S++){var a=e[S],m=a.high,x=a.low,b=h[S];if(b<32)var v=m<<b|x>>>32-b,p=x<<b|m>>>32-b;else var v=x<<b-32|m>>>64-b,p=m<<b-32|x>>>64-b;var H=u[l[S]];H.high=v,H.low=p}var z=u[0],A=e[0];z.high=A.high,z.low=A.low;for(var d=0;d<5;d++)for(var _=0;_<5;_++){var S=d+5*_,a=e[S],C=u[S],D=u[(d+1)%5+5*_],R=u[(d+2)%5+5*_];a.high=C.high^~D.high&R.high,a.low=C.low^~D.low&R.low}var a=e[0],E=f[c];a.high^=E.high,a.low^=E.low}},_doFinalize:function(){var t=this._data,e=t.words,i=(8*this._nDataBytes,8*t.sigBytes),o=32*this.blockSize;e[i>>>5]|=1<<24-i%32,e[(r.ceil((i+1)/o)*o>>>5)-1]|=128,t.sigBytes=4*e.length,this._process();for(var s=this._state,a=this.cfg.outputLength/8,c=a/8,h=[],l=0;l<c;l++){var f=s[l],u=f.high,d=f.low;u=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8),d=16711935&(d<<8|d>>>24)|4278255360&(d<<24|d>>>8),h.push(d),h.push(u)}return new n.init(h,a)},clone:function(){for(var t=o.clone.call(this),r=t._state=this._state.slice(0),e=0;e<25;e++)r[e]=r[e].clone();return t}});e.SHA3=o._createHelper(d),e.HmacSHA3=o._createHmacHelper(d)}(Math),function(){function r(){return s.create.apply(s,arguments)}var e=t,i=e.lib,n=i.Hasher,o=e.x64,s=o.Word,a=o.WordArray,c=e.algo,h=[r(1116352408,3609767458),r(1899447441,602891725),r(3049323471,3964484399),r(3921009573,2173295548),r(961987163,4081628472),r(1508970993,3053834265),r(2453635748,2937671579),r(2870763221,3664609560),r(3624381080,2734883394),r(310598401,1164996542),r(607225278,1323610764),r(1426881987,3590304994),r(1925078388,4068182383),r(2162078206,991336113),r(2614888103,633803317),r(3248222580,3479774868),r(3835390401,2666613458),r(4022224774,944711139),r(264347078,2341262773),r(604807628,2007800933),r(770255983,1495990901),r(1249150122,1856431235),r(1555081692,3175218132),r(1996064986,2198950837),r(2554220882,3999719339),r(2821834349,766784016),r(2952996808,2566594879),r(3210313671,3203337956),r(3336571891,1034457026),r(3584528711,2466948901),r(113926993,3758326383),r(338241895,168717936),r(666307205,1188179964),r(773529912,1546045734),r(1294757372,1522805485),r(1396182291,2643833823),r(1695183700,2343527390),r(1986661051,1014477480),r(2177026350,1206759142),r(2456956037,344077627),r(2730485921,1290863460),r(2820302411,3158454273),r(3259730800,3505952657),r(3345764771,106217008),r(3516065817,3606008344),r(3600352804,1432725776),r(4094571909,1467031594),r(275423344,851169720),r(430227734,3100823752),r(506948616,1363258195),r(659060556,3750685593),r(883997877,3785050280),r(958139571,3318307427),r(1322822218,3812723403),r(1537002063,2003034995),r(1747873779,3602036899),r(1955562222,1575990012),r(2024104815,1125592928),r(2227730452,2716904306),r(2361852424,442776044),r(2428436474,593698344),r(2756734187,3733110249),r(3204031479,2999351573),r(3329325298,3815920427),r(3391569614,3928383900),r(3515267271,566280711),r(3940187606,3454069534),r(4118630271,4000239992),r(116418474,1914138554),r(174292421,2731055270),r(289380356,3203993006),r(460393269,320620315),r(685471733,587496836),r(852142971,1086792851),r(1017036298,365543100),r(1126000580,2618297676),r(1288033470,3409855158),r(1501505948,4234509866),r(1607167915,987167468),r(1816402316,1246189591)],l=[];!function(){for(var t=0;t<80;t++)l[t]=r()}();var f=c.SHA512=n.extend({_doReset:function(){this._hash=new a.init([new s.init(1779033703,4089235720),new s.init(3144134277,2227873595),new s.init(1013904242,4271175723),new s.init(2773480762,1595750129),new s.init(1359893119,2917565137),new s.init(2600822924,725511199),new s.init(528734635,4215389547),new s.init(1541459225,327033209)])},_doProcessBlock:function(t,r){for(var e=this._hash.words,i=e[0],n=e[1],o=e[2],s=e[3],a=e[4],c=e[5],f=e[6],u=e[7],d=i.high,v=i.low,p=n.high,_=n.low,y=o.high,g=o.low,B=s.high,w=s.low,k=a.high,S=a.low,m=c.high,x=c.low,b=f.high,H=f.low,z=u.high,A=u.low,C=d,D=v,R=p,E=_,M=y,F=g,P=B,W=w,O=k,U=S,I=m,K=x,X=b,L=H,j=z,N=A,T=0;T<80;T++){var Z=l[T];if(T<16)var q=Z.high=0|t[r+2*T],G=Z.low=0|t[r+2*T+1];else{var J=l[T-15],$=J.high,Q=J.low,V=($>>>1|Q<<31)^($>>>8|Q<<24)^$>>>7,Y=(Q>>>1|$<<31)^(Q>>>8|$<<24)^(Q>>>7|$<<25),tt=l[T-2],rt=tt.high,et=tt.low,it=(rt>>>19|et<<13)^(rt<<3|et>>>29)^rt>>>6,nt=(et>>>19|rt<<13)^(et<<3|rt>>>29)^(et>>>6|rt<<26),ot=l[T-7],st=ot.high,at=ot.low,ct=l[T-16],ht=ct.high,lt=ct.low,G=Y+at,q=V+st+(G>>>0<Y>>>0?1:0),G=G+nt,q=q+it+(G>>>0<nt>>>0?1:0),G=G+lt,q=q+ht+(G>>>0<lt>>>0?1:0);Z.high=q,Z.low=G}var ft=O&I^~O&X,ut=U&K^~U&L,dt=C&R^C&M^R&M,vt=D&E^D&F^E&F,pt=(C>>>28|D<<4)^(C<<30|D>>>2)^(C<<25|D>>>7),_t=(D>>>28|C<<4)^(D<<30|C>>>2)^(D<<25|C>>>7),yt=(O>>>14|U<<18)^(O>>>18|U<<14)^(O<<23|U>>>9),gt=(U>>>14|O<<18)^(U>>>18|O<<14)^(U<<23|O>>>9),Bt=h[T],wt=Bt.high,kt=Bt.low,St=N+gt,mt=j+yt+(St>>>0<N>>>0?1:0),St=St+ut,mt=mt+ft+(St>>>0<ut>>>0?1:0),St=St+kt,mt=mt+wt+(St>>>0<kt>>>0?1:0),St=St+G,mt=mt+q+(St>>>0<G>>>0?1:0),xt=_t+vt,bt=pt+dt+(xt>>>0<_t>>>0?1:0);j=X,N=L,X=I,L=K,I=O,K=U,U=W+St|0,O=P+mt+(U>>>0<W>>>0?1:0)|0,P=M,W=F,M=R,F=E,R=C,E=D,D=St+xt|0,C=mt+bt+(D>>>0<St>>>0?1:0)|0}v=i.low=v+D,i.high=d+C+(v>>>0<D>>>0?1:0),_=n.low=_+E,n.high=p+R+(_>>>0<E>>>0?1:0),g=o.low=g+F,o.high=y+M+(g>>>0<F>>>0?1:0),w=s.low=w+W,s.high=B+P+(w>>>0<W>>>0?1:0),S=a.low=S+U,a.high=k+O+(S>>>0<U>>>0?1:0),x=c.low=x+K,c.high=m+I+(x>>>0<K>>>0?1:0),H=f.low=H+L,f.high=b+X+(H>>>0<L>>>0?1:0),A=u.low=A+N,u.high=z+j+(A>>>0<N>>>0?1:0)},_doFinalize:function(){var t=this._data,r=t.words,e=8*this._nDataBytes,i=8*t.sigBytes;r[i>>>5]|=128<<24-i%32,r[(i+128>>>10<<5)+30]=Math.floor(e/4294967296),r[(i+128>>>10<<5)+31]=e,t.sigBytes=4*r.length,this._process();var n=this._hash.toX32();return n},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t},blockSize:32});e.SHA512=n._createHelper(f),e.HmacSHA512=n._createHmacHelper(f)}(),function(){var r=t,e=r.x64,i=e.Word,n=e.WordArray,o=r.algo,s=o.SHA512,a=o.SHA384=s.extend({_doReset:function(){this._hash=new n.init([new i.init(3418070365,3238371032),new i.init(1654270250,914150663),new i.init(2438529370,812702999),new i.init(355462360,4144912697),new i.init(1731405415,4290775857),new i.init(2394180231,1750603025),new i.init(3675008525,1694076839),new i.init(1203062813,3204075428)])},_doFinalize:function(){var t=s._doFinalize.call(this);return t.sigBytes-=16,t}});r.SHA384=s._createHelper(a),r.HmacSHA384=s._createHmacHelper(a)}(),t.lib.Cipher||function(r){var e=t,i=e.lib,n=i.Base,o=i.WordArray,s=i.BufferedBlockAlgorithm,a=e.enc,c=(a.Utf8,a.Base64),h=e.algo,l=h.EvpKDF,f=i.Cipher=s.extend({cfg:n.extend(),createEncryptor:function(t,r){return this.create(this._ENC_XFORM_MODE,t,r)},createDecryptor:function(t,r){return this.create(this._DEC_XFORM_MODE,t,r)},init:function(t,r,e){this.cfg=this.cfg.extend(e),this._xformMode=t,this._key=r,this.reset()},reset:function(){s.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){t&&this._append(t);var r=this._doFinalize();return r},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function t(t){return"string"==typeof t?m:w}return function(r){return{encrypt:function(e,i,n){return t(i).encrypt(r,e,i,n)},decrypt:function(e,i,n){return t(i).decrypt(r,e,i,n)}}}}()}),u=(i.StreamCipher=f.extend({_doFinalize:function(){var t=this._process(!0);return t},blockSize:1}),e.mode={}),d=i.BlockCipherMode=n.extend({createEncryptor:function(t,r){return this.Encryptor.create(t,r)},createDecryptor:function(t,r){return this.Decryptor.create(t,r)},init:function(t,r){this._cipher=t,this._iv=r}}),v=u.CBC=function(){function t(t,e,i){var n=this._iv;if(n){var o=n;this._iv=r}else var o=this._prevBlock;for(var s=0;s<i;s++)t[e+s]^=o[s]}var e=d.extend();return e.Encryptor=e.extend({processBlock:function(r,e){var i=this._cipher,n=i.blockSize;t.call(this,r,e,n),i.encryptBlock(r,e),this._prevBlock=r.slice(e,e+n)}}),e.Decryptor=e.extend({processBlock:function(r,e){var i=this._cipher,n=i.blockSize,o=r.slice(e,e+n);i.decryptBlock(r,e),t.call(this,r,e,n),this._prevBlock=o}}),e}(),p=e.pad={},_=p.Pkcs7={pad:function(t,r){for(var e=4*r,i=e-t.sigBytes%e,n=i<<24|i<<16|i<<8|i,s=[],a=0;a<i;a+=4)s.push(n);var c=o.create(s,i);t.concat(c)},unpad:function(t){var r=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=r}},y=(i.BlockCipher=f.extend({cfg:f.cfg.extend({mode:v,padding:_}),reset:function(){f.reset.call(this);var t=this.cfg,r=t.iv,e=t.mode;if(this._xformMode==this._ENC_XFORM_MODE)var i=e.createEncryptor;else{var i=e.createDecryptor;this._minBufferSize=1}this._mode&&this._mode.__creator==i?this._mode.init(this,r&&r.words):(this._mode=i.call(e,this,r&&r.words),this._mode.__creator=i)},_doProcessBlock:function(t,r){this._mode.processBlock(t,r)},_doFinalize:function(){var t=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){t.pad(this._data,this.blockSize);var r=this._process(!0)}else{var r=this._process(!0);t.unpad(r)}return r},blockSize:4}),i.CipherParams=n.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}})),g=e.format={},B=g.OpenSSL={stringify:function(t){var r=t.ciphertext,e=t.salt;if(e)var i=o.create([1398893684,1701076831]).concat(e).concat(r);else var i=r;return i.toString(c)},parse:function(t){var r=c.parse(t),e=r.words;if(1398893684==e[0]&&1701076831==e[1]){var i=o.create(e.slice(2,4));e.splice(0,4),r.sigBytes-=16}return y.create({ciphertext:r,salt:i})}},w=i.SerializableCipher=n.extend({cfg:n.extend({format:B}),encrypt:function(t,r,e,i){i=this.cfg.extend(i);var n=t.createEncryptor(e,i),o=n.finalize(r),s=n.cfg;return y.create({ciphertext:o,key:e,iv:s.iv,algorithm:t,mode:s.mode,padding:s.padding,blockSize:t.blockSize,formatter:i.format})},decrypt:function(t,r,e,i){i=this.cfg.extend(i),r=this._parse(r,i.format);var n=t.createDecryptor(e,i).finalize(r.ciphertext);return n},_parse:function(t,r){return"string"==typeof t?r.parse(t,this):t}}),k=e.kdf={},S=k.OpenSSL={execute:function(t,r,e,i){i||(i=o.random(8));var n=l.create({keySize:r+e}).compute(t,i),s=o.create(n.words.slice(r),4*e);return n.sigBytes=4*r,y.create({key:n,iv:s,salt:i})}},m=i.PasswordBasedCipher=w.extend({cfg:w.cfg.extend({kdf:S}),encrypt:function(t,r,e,i){i=this.cfg.extend(i);var n=i.kdf.execute(e,t.keySize,t.ivSize);i.iv=n.iv;var o=w.encrypt.call(this,t,r,n.key,i);return o.mixIn(n),o},decrypt:function(t,r,e,i){i=this.cfg.extend(i),r=this._parse(r,i.format);var n=i.kdf.execute(e,t.keySize,t.ivSize,r.salt);i.iv=n.iv;var o=w.decrypt.call(this,t,r,n.key,i);return o}})}(),t.mode.CFB=function(){function r(t,r,e,i){var n=this._iv;if(n){var o=n.slice(0);this._iv=void 0}else var o=this._prevBlock;i.encryptBlock(o,0);for(var s=0;s<e;s++)t[r+s]^=o[s]}var e=t.lib.BlockCipherMode.extend();return e.Encryptor=e.extend({processBlock:function(t,e){var i=this._cipher,n=i.blockSize;r.call(this,t,e,n,i),this._prevBlock=t.slice(e,e+n)}}),e.Decryptor=e.extend({processBlock:function(t,e){var i=this._cipher,n=i.blockSize,o=t.slice(e,e+n);r.call(this,t,e,n,i),this._prevBlock=o}}),e}(),t.mode.ECB=function(){var r=t.lib.BlockCipherMode.extend();return r.Encryptor=r.extend({processBlock:function(t,r){this._cipher.encryptBlock(t,r)}}),r.Decryptor=r.extend({processBlock:function(t,r){this._cipher.decryptBlock(t,r)}}),r}(),t.pad.AnsiX923={pad:function(t,r){var e=t.sigBytes,i=4*r,n=i-e%i,o=e+n-1;t.clamp(),t.words[o>>>2]|=n<<24-o%4*8,t.sigBytes+=n},unpad:function(t){var r=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=r}},t.pad.Iso10126={pad:function(r,e){var i=4*e,n=i-r.sigBytes%i;r.concat(t.lib.WordArray.random(n-1)).concat(t.lib.WordArray.create([n<<24],1))},unpad:function(t){var r=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=r}},t.pad.Iso97971={pad:function(r,e){r.concat(t.lib.WordArray.create([2147483648],1)),t.pad.ZeroPadding.pad(r,e)},unpad:function(r){t.pad.ZeroPadding.unpad(r),r.sigBytes--}},t.mode.OFB=function(){var r=t.lib.BlockCipherMode.extend(),e=r.Encryptor=r.extend({processBlock:function(t,r){var e=this._cipher,i=e.blockSize,n=this._iv,o=this._keystream;n&&(o=this._keystream=n.slice(0),this._iv=void 0),e.encryptBlock(o,0);for(var s=0;s<i;s++)t[r+s]^=o[s]}});return r.Decryptor=e,r}(),t.pad.NoPadding={pad:function(){},unpad:function(){}},function(r){var e=t,i=e.lib,n=i.CipherParams,o=e.enc,s=o.Hex,a=e.format;a.Hex={stringify:function(t){return t.ciphertext.toString(s)},parse:function(t){var r=s.parse(t);return n.create({ciphertext:r})}}}(),function(){var r=t,e=r.lib,i=e.BlockCipher,n=r.algo,o=[],s=[],a=[],c=[],h=[],l=[],f=[],u=[],d=[],v=[];!function(){for(var t=[],r=0;r<256;r++)r<128?t[r]=r<<1:t[r]=r<<1^283;for(var e=0,i=0,r=0;r<256;r++){var n=i^i<<1^i<<2^i<<3^i<<4;n=n>>>8^255&n^99,o[e]=n,s[n]=e;var p=t[e],_=t[p],y=t[_],g=257*t[n]^16843008*n;a[e]=g<<24|g>>>8,c[e]=g<<16|g>>>16,h[e]=g<<8|g>>>24,l[e]=g;var g=16843009*y^65537*_^257*p^16843008*e;f[n]=g<<24|g>>>8,u[n]=g<<16|g>>>16,d[n]=g<<8|g>>>24,v[n]=g,e?(e=p^t[t[t[y^p]]],i^=t[t[i]]):e=i=1}}();var p=[0,1,2,4,8,16,32,64,128,27,54],_=n.AES=i.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var t=this._keyPriorReset=this._key,r=t.words,e=t.sigBytes/4,i=this._nRounds=e+6,n=4*(i+1),s=this._keySchedule=[],a=0;a<n;a++)if(a<e)s[a]=r[a];else{var c=s[a-1];a%e?e>6&&a%e==4&&(c=o[c>>>24]<<24|o[c>>>16&255]<<16|o[c>>>8&255]<<8|o[255&c]):(c=c<<8|c>>>24,c=o[c>>>24]<<24|o[c>>>16&255]<<16|o[c>>>8&255]<<8|o[255&c],c^=p[a/e|0]<<24),s[a]=s[a-e]^c}for(var h=this._invKeySchedule=[],l=0;l<n;l++){var a=n-l;if(l%4)var c=s[a];else var c=s[a-4];l<4||a<=4?h[l]=c:h[l]=f[o[c>>>24]]^u[o[c>>>16&255]]^d[o[c>>>8&255]]^v[o[255&c]]}}},encryptBlock:function(t,r){this._doCryptBlock(t,r,this._keySchedule,a,c,h,l,o)},decryptBlock:function(t,r){var e=t[r+1];t[r+1]=t[r+3],t[r+3]=e,this._doCryptBlock(t,r,this._invKeySchedule,f,u,d,v,s);var e=t[r+1];t[r+1]=t[r+3],t[r+3]=e},_doCryptBlock:function(t,r,e,i,n,o,s,a){for(var c=this._nRounds,h=t[r]^e[0],l=t[r+1]^e[1],f=t[r+2]^e[2],u=t[r+3]^e[3],d=4,v=1;v<c;v++){var p=i[h>>>24]^n[l>>>16&255]^o[f>>>8&255]^s[255&u]^e[d++],_=i[l>>>24]^n[f>>>16&255]^o[u>>>8&255]^s[255&h]^e[d++],y=i[f>>>24]^n[u>>>16&255]^o[h>>>8&255]^s[255&l]^e[d++],g=i[u>>>24]^n[h>>>16&255]^o[l>>>8&255]^s[255&f]^e[d++];h=p,l=_,f=y,u=g}var p=(a[h>>>24]<<24|a[l>>>16&255]<<16|a[f>>>8&255]<<8|a[255&u])^e[d++],_=(a[l>>>24]<<24|a[f>>>16&255]<<16|a[u>>>8&255]<<8|a[255&h])^e[d++],y=(a[f>>>24]<<24|a[u>>>16&255]<<16|a[h>>>8&255]<<8|a[255&l])^e[d++],g=(a[u>>>24]<<24|a[h>>>16&255]<<16|a[l>>>8&255]<<8|a[255&f])^e[d++];t[r]=p,t[r+1]=_,t[r+2]=y,t[r+3]=g},keySize:8});r.AES=i._createHelper(_)}(),function(){function r(t,r){var e=(this._lBlock>>>t^this._rBlock)&r;this._rBlock^=e,this._lBlock^=e<<t}function e(t,r){var e=(this._rBlock>>>t^this._lBlock)&r;this._lBlock^=e,this._rBlock^=e<<t}var i=t,n=i.lib,o=n.WordArray,s=n.BlockCipher,a=i.algo,c=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],h=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],l=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],f=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],u=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],d=a.DES=s.extend({_doReset:function(){for(var t=this._key,r=t.words,e=[],i=0;i<56;i++){var n=c[i]-1;e[i]=r[n>>>5]>>>31-n%32&1}for(var o=this._subKeys=[],s=0;s<16;s++){for(var a=o[s]=[],f=l[s],i=0;i<24;i++)a[i/6|0]|=e[(h[i]-1+f)%28]<<31-i%6,a[4+(i/6|0)]|=e[28+(h[i+24]-1+f)%28]<<31-i%6;a[0]=a[0]<<1|a[0]>>>31;for(var i=1;i<7;i++)a[i]=a[i]>>>4*(i-1)+3;a[7]=a[7]<<5|a[7]>>>27}for(var u=this._invSubKeys=[],i=0;i<16;i++)u[i]=o[15-i]},encryptBlock:function(t,r){this._doCryptBlock(t,r,this._subKeys)},decryptBlock:function(t,r){this._doCryptBlock(t,r,this._invSubKeys)},_doCryptBlock:function(t,i,n){this._lBlock=t[i],this._rBlock=t[i+1],r.call(this,4,252645135),r.call(this,16,65535),e.call(this,2,858993459),e.call(this,8,16711935),r.call(this,1,1431655765);for(var o=0;o<16;o++){for(var s=n[o],a=this._lBlock,c=this._rBlock,h=0,l=0;l<8;l++)h|=f[l][((c^s[l])&u[l])>>>0];this._lBlock=c,this._rBlock=a^h}var d=this._lBlock;this._lBlock=this._rBlock,this._rBlock=d,r.call(this,1,1431655765),e.call(this,8,16711935),e.call(this,2,858993459),r.call(this,16,65535),r.call(this,4,252645135),t[i]=this._lBlock,t[i+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});i.DES=s._createHelper(d);var v=a.TripleDES=s.extend({_doReset:function(){var t=this._key,r=t.words;this._des1=d.createEncryptor(o.create(r.slice(0,2))),this._des2=d.createEncryptor(o.create(r.slice(2,4))),this._des3=d.createEncryptor(o.create(r.slice(4,6)))},encryptBlock:function(t,r){this._des1.encryptBlock(t,r),this._des2.decryptBlock(t,r),this._des3.encryptBlock(t,r)},decryptBlock:function(t,r){this._des3.decryptBlock(t,r),this._des2.encryptBlock(t,r),this._des1.decryptBlock(t,r)},keySize:6,ivSize:2,blockSize:2});i.TripleDES=s._createHelper(v)}(),function(){function r(){for(var t=this._S,r=this._i,e=this._j,i=0,n=0;n<4;n++){r=(r+1)%256,e=(e+t[r])%256;var o=t[r];t[r]=t[e],t[e]=o,i|=t[(t[r]+t[e])%256]<<24-8*n}return this._i=r,this._j=e,i}var e=t,i=e.lib,n=i.StreamCipher,o=e.algo,s=o.RC4=n.extend({_doReset:function(){for(var t=this._key,r=t.words,e=t.sigBytes,i=this._S=[],n=0;n<256;n++)i[n]=n;for(var n=0,o=0;n<256;n++){var s=n%e,a=r[s>>>2]>>>24-s%4*8&255;o=(o+i[n]+a)%256;var c=i[n];i[n]=i[o],i[o]=c}this._i=this._j=0},_doProcessBlock:function(t,e){t[e]^=r.call(this)},keySize:8,ivSize:0});e.RC4=n._createHelper(s);var a=o.RC4Drop=s.extend({cfg:s.cfg.extend({drop:192}),_doReset:function(){s._doReset.call(this);for(var t=this.cfg.drop;t>0;t--)r.call(this)}});e.RC4Drop=n._createHelper(a)}(),t.mode.CTRGladman=function(){function r(t){if(255===(t>>24&255)){var r=t>>16&255,e=t>>8&255,i=255&t;255===r?(r=0,255===e?(e=0,255===i?i=0:++i):++e):++r,t=0,t+=r<<16,t+=e<<8,t+=i}else t+=1<<24;return t}function e(t){return 0===(t[0]=r(t[0]))&&(t[1]=r(t[1])),t}var i=t.lib.BlockCipherMode.extend(),n=i.Encryptor=i.extend({processBlock:function(t,r){var i=this._cipher,n=i.blockSize,o=this._iv,s=this._counter;o&&(s=this._counter=o.slice(0),this._iv=void 0),e(s);var a=s.slice(0);i.encryptBlock(a,0);for(var c=0;c<n;c++)t[r+c]^=a[c]}});return i.Decryptor=n,i}(),function(){function r(){for(var t=this._X,r=this._C,e=0;e<8;e++)a[e]=r[e];r[0]=r[0]+1295307597+this._b|0,r[1]=r[1]+3545052371+(r[0]>>>0<a[0]>>>0?1:0)|0,r[2]=r[2]+886263092+(r[1]>>>0<a[1]>>>0?1:0)|0,r[3]=r[3]+1295307597+(r[2]>>>0<a[2]>>>0?1:0)|0,r[4]=r[4]+3545052371+(r[3]>>>0<a[3]>>>0?1:0)|0,r[5]=r[5]+886263092+(r[4]>>>0<a[4]>>>0?1:0)|0,r[6]=r[6]+1295307597+(r[5]>>>0<a[5]>>>0?1:0)|0,r[7]=r[7]+3545052371+(r[6]>>>0<a[6]>>>0?1:0)|0,this._b=r[7]>>>0<a[7]>>>0?1:0;for(var e=0;e<8;e++){var i=t[e]+r[e],n=65535&i,o=i>>>16,s=((n*n>>>17)+n*o>>>15)+o*o,h=((4294901760&i)*i|0)+((65535&i)*i|0);c[e]=s^h}t[0]=c[0]+(c[7]<<16|c[7]>>>16)+(c[6]<<16|c[6]>>>16)|0,t[1]=c[1]+(c[0]<<8|c[0]>>>24)+c[7]|0,t[2]=c[2]+(c[1]<<16|c[1]>>>16)+(c[0]<<16|c[0]>>>16)|0,t[3]=c[3]+(c[2]<<8|c[2]>>>24)+c[1]|0,t[4]=c[4]+(c[3]<<16|c[3]>>>16)+(c[2]<<16|c[2]>>>16)|0,t[5]=c[5]+(c[4]<<8|c[4]>>>24)+c[3]|0,t[6]=c[6]+(c[5]<<16|c[5]>>>16)+(c[4]<<16|c[4]>>>16)|0,t[7]=c[7]+(c[6]<<8|c[6]>>>24)+c[5]|0}var e=t,i=e.lib,n=i.StreamCipher,o=e.algo,s=[],a=[],c=[],h=o.Rabbit=n.extend({_doReset:function(){for(var t=this._key.words,e=this.cfg.iv,i=0;i<4;i++)t[i]=16711935&(t[i]<<8|t[i]>>>24)|4278255360&(t[i]<<24|t[i]>>>8);var n=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],o=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]];this._b=0;for(var i=0;i<4;i++)r.call(this);for(var i=0;i<8;i++)o[i]^=n[i+4&7];if(e){var s=e.words,a=s[0],c=s[1],h=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8),l=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),f=h>>>16|4294901760&l,u=l<<16|65535&h;o[0]^=h,o[1]^=f,o[2]^=l,o[3]^=u,o[4]^=h,o[5]^=f,o[6]^=l,o[7]^=u;for(var i=0;i<4;i++)r.call(this)}},_doProcessBlock:function(t,e){var i=this._X;r.call(this),s[0]=i[0]^i[5]>>>16^i[3]<<16,s[1]=i[2]^i[7]>>>16^i[5]<<16,s[2]=i[4]^i[1]>>>16^i[7]<<16,s[3]=i[6]^i[3]>>>16^i[1]<<16;for(var n=0;n<4;n++)s[n]=16711935&(s[n]<<8|s[n]>>>24)|4278255360&(s[n]<<24|s[n]>>>8),t[e+n]^=s[n]},blockSize:4,ivSize:2});e.Rabbit=n._createHelper(h)}(),t.mode.CTR=function(){var r=t.lib.BlockCipherMode.extend(),e=r.Encryptor=r.extend({processBlock:function(t,r){var e=this._cipher,i=e.blockSize,n=this._iv,o=this._counter;n&&(o=this._counter=n.slice(0),this._iv=void 0);var s=o.slice(0);e.encryptBlock(s,0),o[i-1]=o[i-1]+1|0;for(var a=0;a<i;a++)t[r+a]^=s[a]}});return r.Decryptor=e,r}(),function(){function r(){for(var t=this._X,r=this._C,e=0;e<8;e++)a[e]=r[e];r[0]=r[0]+1295307597+this._b|0,r[1]=r[1]+3545052371+(r[0]>>>0<a[0]>>>0?1:0)|0,r[2]=r[2]+886263092+(r[1]>>>0<a[1]>>>0?1:0)|0,r[3]=r[3]+1295307597+(r[2]>>>0<a[2]>>>0?1:0)|0,r[4]=r[4]+3545052371+(r[3]>>>0<a[3]>>>0?1:0)|0,r[5]=r[5]+886263092+(r[4]>>>0<a[4]>>>0?1:0)|0,r[6]=r[6]+1295307597+(r[5]>>>0<a[5]>>>0?1:0)|0,r[7]=r[7]+3545052371+(r[6]>>>0<a[6]>>>0?1:0)|0,this._b=r[7]>>>0<a[7]>>>0?1:0;for(var e=0;e<8;e++){var i=t[e]+r[e],n=65535&i,o=i>>>16,s=((n*n>>>17)+n*o>>>15)+o*o,h=((4294901760&i)*i|0)+((65535&i)*i|0);c[e]=s^h}t[0]=c[0]+(c[7]<<16|c[7]>>>16)+(c[6]<<16|c[6]>>>16)|0,t[1]=c[1]+(c[0]<<8|c[0]>>>24)+c[7]|0,t[2]=c[2]+(c[1]<<16|c[1]>>>16)+(c[0]<<16|c[0]>>>16)|0,t[3]=c[3]+(c[2]<<8|c[2]>>>24)+c[1]|0,t[4]=c[4]+(c[3]<<16|c[3]>>>16)+(c[2]<<16|c[2]>>>16)|0,t[5]=c[5]+(c[4]<<8|c[4]>>>24)+c[3]|0,t[6]=c[6]+(c[5]<<16|c[5]>>>16)+(c[4]<<16|c[4]>>>16)|0,t[7]=c[7]+(c[6]<<8|c[6]>>>24)+c[5]|0}var e=t,i=e.lib,n=i.StreamCipher,o=e.algo,s=[],a=[],c=[],h=o.RabbitLegacy=n.extend({_doReset:function(){var t=this._key.words,e=this.cfg.iv,i=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],n=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]];this._b=0;for(var o=0;o<4;o++)r.call(this);for(var o=0;o<8;o++)n[o]^=i[o+4&7];if(e){var s=e.words,a=s[0],c=s[1],h=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8),l=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),f=h>>>16|4294901760&l,u=l<<16|65535&h;n[0]^=h,n[1]^=f,n[2]^=l,n[3]^=u,n[4]^=h,n[5]^=f,n[6]^=l,n[7]^=u;for(var o=0;o<4;o++)r.call(this)}},_doProcessBlock:function(t,e){var i=this._X;r.call(this),s[0]=i[0]^i[5]>>>16^i[3]<<16,s[1]=i[2]^i[7]>>>16^i[5]<<16,s[2]=i[4]^i[1]>>>16^i[7]<<16,s[3]=i[6]^i[3]>>>16^i[1]<<16;for(var n=0;n<4;n++)s[n]=16711935&(s[n]<<8|s[n]>>>24)|4278255360&(s[n]<<24|s[n]>>>8),t[e+n]^=s[n]},blockSize:4,ivSize:2});e.RabbitLegacy=n._createHelper(h)}(),t.pad.ZeroPadding={pad:function(t,r){var e=4*r;t.clamp(),t.sigBytes+=e-(t.sigBytes%e||e)},unpad:function(t){for(var r=t.words,e=t.sigBytes-1;!(r[e>>>2]>>>24-e%4*8&255);)e--;t.sigBytes=e+1}},t});;
let cookiesArr = [], cookie = '', notify, newShareCodes, allMessage = '';
let shareCodes = [''], message = '', subTitle = '', option = {}, isFruitFinished = false;
const retainWater = 100;//保留水滴大于多少g,默认100g;
let jdNotify = false;//是否关闭通知，false打开通知推送，true关闭通知推送
let jdFruitBeanCard = false;//农场使用水滴换豆卡(如果出现限时活动时100g水换20豆,此时比浇水划算,推荐换豆),true表示换豆(不浇水),false表示不换豆(继续浇水),脚本默认是浇水
let randomCount = $.isNode() ? 20 : 5;
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const newPrizeBody = {"version": 14, "channel": 1, "babelChannel": "120"};
const urlSchema = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html%22%20%7D`;
!(async () => {
  $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  if ($.isNode()) {
    if (process.argv[2]) {
      cookiesArr = [decodeURIComponent(process.argv[2])];
      console.log(`收到Cookie：${decodeURIComponent(cookiesArr[0])}`)
    }
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      message = '';
      subTitle = '';
      option = {};
      await shareCodesFormat();
      await jdFruit();
    }
  }
  if ($.isNode() && allMessage && $.ctrTemp) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})()
  .catch((e) => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

async function farmmd5() {
  return new Promise(resolve => {
    $.get({
      url: 'https://api.jdsharecode.xyz/api/autoInsert/farmmd5?farmmd5=' + $.CryptoJS.MD5($.farmInfo.farmUserPro.shareCode).toString()
    }, (err, resp, data) => {
      try {
        console.log(JSON.parse(data));
      } catch (e) {
        console.log(e)
      } finally {
        resolve()
      }
    })
  })
}

async function jdFruit() {
  subTitle = `【京东账号${$.index}】${$.nickName}`;
  try {
    await initForFarm();
    if ($.farmInfo.farmUserPro) {
      console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.farmInfo.farmUserPro.shareCode}\n`);
      await farmmd5()

      for (let k = 0; k < 3; k++) {
        try {
          await runTimes()
          break
        } catch (e) {
        }
        await $.wait(Math.floor(Math.random() * 10 + 3) * 1000)
      }

      console.log('当前种植', $.farmInfo.farmUserPro.name)
      console.log(`\n【已成功兑换水果】${$.farmInfo.farmUserPro.winTimes}次\n`);
      message += `【已兑换水果】${$.farmInfo.farmUserPro.winTimes}次\n`;
      await masterHelpShare();//助力好友
      if ($.farmInfo.treeState === 2 || $.farmInfo.treeState === 3) {
        option['open-url'] = urlSchema;
        $.msg($.name, ``, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option);
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}水果已可领取`, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看`);
        }
        return
      } else if ($.farmInfo.treeState === 1) {
        console.log(`\n${$.farmInfo.farmUserPro.name}种植中...\n`)
      } else if ($.farmInfo.treeState === 0) {
        //已下单购买, 但未开始种植新的水果
        option['open-url'] = urlSchema;
        $.msg($.name, ``, `【京东账号${$.index}】 ${$.nickName || $.UserName}\n【提醒⏰】您忘了种植新的水果\n请去京东APP或微信小程序选购并种植新的水果\n点击弹窗即达`, option);
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - 您忘了种植新的水果`, `京东账号${$.index} ${$.nickName}\n【提醒⏰】您忘了种植新的水果\n请去京东APP或微信小程序选购并种植新的水果`);
        }
        return
      }
      await doDailyTask();
      await doTenWater();//浇水十次
      await getFirstWaterAward();//领取首次浇水奖励
      await getTenWaterAward();//领取10浇水奖励
      await getWaterFriendGotAward();//领取为2好友浇水奖励
      await duck();
      await doTenWaterAgain();//再次浇水
      await predictionFruit();//预测水果成熟时间
    } else {
      console.log(`初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常,农场初始化数据: ${JSON.stringify($.farmInfo)}`);
      message = `【数据异常】请手动登录京东app查看此账号${$.name}是否正常`;
    }
  } catch (e) {
    console.log(`任务执行异常，请检查执行日志 ‼️‼️`);
    $.logErr(e);
    const errMsg = `京东账号${$.index} ${$.nickName || $.UserName}\n任务执行异常，请检查执行日志 ‼️‼️`;
    if ($.isNode()) await notify.sendNotify(`${$.name}`, errMsg);
    $.msg($.name, '', `${errMsg}`)
  }
  await showMsg();
}

function runTimes() {
  return new Promise((resolve, reject) => {
    $.get({
      url: `https://api.jdsharecode.xyz/api/runTimes?activityId=farm&sharecode=${$.farmInfo.farmUserPro.shareCode}`
    }, (err, resp, data) => {
      if (err) {
        console.log('上报失败', err)
        reject(err)
      } else {
        console.log(data)
        resolve()
      }
    })
  })
}

async function doDailyTask() {
  await taskInitForFarm();
  console.log(`开始签到`);
  if (!$.farmTask.signInit.todaySigned) {
    await signForFarm(); //签到
    if ($.signResult.code === "0") {
      console.log(`【签到成功】获得${$.signResult.amount}g💧\\n`)
      //message += `【签到成功】获得${$.signResult.amount}g💧\n`//连续签到${signResult.signDay}天
    } else {
      // message += `签到失败,详询日志\n`;
      console.log(`签到结果:  ${JSON.stringify($.signResult)}`);
    }
  } else {
    console.log(`今天已签到,连续签到${$.farmTask.signInit.totalSigned},下次签到可得${$.farmTask.signInit.signEnergyEachAmount}g\n`);
  }
  // 被水滴砸中
  console.log(`被水滴砸中： ${$.farmInfo.todayGotWaterGoalTask.canPop ? '是' : '否'}`);
  if ($.farmInfo.todayGotWaterGoalTask.canPop) {
    await gotWaterGoalTaskForFarm();
    if ($.goalResult.code === '0') {
      console.log(`【被水滴砸中】获得${$.goalResult.addEnergy}g💧\\n`);
      // message += `【被水滴砸中】获得${$.goalResult.addEnergy}g💧\n`
    }
  }
  console.log(`签到结束,开始广告浏览任务`);
  if (!$.farmTask.gotBrowseTaskAdInit.f) {
    let adverts = $.farmTask.gotBrowseTaskAdInit.userBrowseTaskAds
    let browseReward = 0
    let browseSuccess = 0
    let browseFail = 0
    for (let advert of adverts) { //开始浏览广告
      if (advert.limit <= advert.hadFinishedTimes) {
        // browseReward+=advert.reward
        console.log(`${advert.mainTitle}+ ' 已完成`);//,获得${advert.reward}g
        continue;
      }
      console.log('正在进行广告浏览任务: ' + advert.mainTitle);
      await browseAdTaskForFarm(advert.advertId, 0);
      if ($.browseResult.code === '0') {
        console.log(`${advert.mainTitle}浏览任务完成`);
        //领取奖励
        await browseAdTaskForFarm(advert.advertId, 1);
        if ($.browseRwardResult.code === '0') {
          console.log(`领取浏览${advert.mainTitle}广告奖励成功,获得${$.browseRwardResult.amount}g`)
          browseReward += $.browseRwardResult.amount
          browseSuccess++
        } else {
          browseFail++
          console.log(`领取浏览广告奖励结果:  ${JSON.stringify($.browseRwardResult)}`)
        }
      } else {
        browseFail++
        console.log(`广告浏览任务结果:   ${JSON.stringify($.browseResult)}`);
      }
    }
    if (browseFail > 0) {
      console.log(`【广告浏览】完成${browseSuccess}个,失败${browseFail},获得${browseReward}g💧\\n`);
      // message += `【广告浏览】完成${browseSuccess}个,失败${browseFail},获得${browseReward}g💧\n`;
    } else {
      console.log(`【广告浏览】完成${browseSuccess}个,获得${browseReward}g💧\n`);
      // message += `【广告浏览】完成${browseSuccess}个,获得${browseReward}g💧\n`;
    }
  } else {
    console.log(`今天已经做过浏览广告任务\n`);
  }
  //定时领水
  if (!$.farmTask.gotThreeMealInit.f) {
    //
    await gotThreeMealForFarm();
    if ($.threeMeal.code === "0") {
      console.log(`【定时领水】获得${$.threeMeal.amount}g💧\n`);
      // message += `【定时领水】获得${$.threeMeal.amount}g💧\n`;
    } else {
      // message += `【定时领水】失败,详询日志\n`;
      console.log(`定时领水成功结果:  ${JSON.stringify($.threeMeal)}`);
    }
  } else {
    console.log('当前不在定时领水时间断或者已经领过\n')
  }
  //给好友浇水
  if (!$.farmTask.waterFriendTaskInit.f) {
    if ($.farmTask.waterFriendTaskInit.waterFriendCountKey < $.farmTask.waterFriendTaskInit.waterFriendMax) {
      await doFriendsWater();
    }
  } else {
    console.log(`给${$.farmTask.waterFriendTaskInit.waterFriendMax}个好友浇水任务已完成\n`)
  }
  await getAwardInviteFriend();
  await clockInIn();//打卡领水
  await executeWaterRains();//水滴雨
  await getExtraAward();//领取额外水滴奖励
  await getExtraAward2();//新的助力奖励
  await turntableFarm()//天天抽奖得好礼
}

async function predictionFruit() {
  console.log('开始预测水果成熟时间\n');
  await initForFarm();
  await taskInitForFarm();
  let waterEveryDayT = $.farmTask.totalWaterTaskInit.totalWaterTaskTimes;//今天到到目前为止，浇了多少次水
  message += `【今日共浇水】${waterEveryDayT}次\n`;
  message += `【剩余 水滴】${$.farmInfo.farmUserPro.totalEnergy}g💧\n`;
  message += `【水果🍉进度】${(($.farmInfo.farmUserPro.treeEnergy / $.farmInfo.farmUserPro.treeTotalEnergy) * 100).toFixed(2)}%，已浇水${$.farmInfo.farmUserPro.treeEnergy / 10}次,还需${($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10}次\n`
  if ($.farmInfo.toFlowTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
    message += `【开花进度】再浇水${$.farmInfo.toFlowTimes - $.farmInfo.farmUserPro.treeEnergy / 10}次开花\n`
  } else if ($.farmInfo.toFruitTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
    message += `【结果进度】再浇水${$.farmInfo.toFruitTimes - $.farmInfo.farmUserPro.treeEnergy / 10}次结果\n`
  }
  // 预测n天后水果课可兑换功能
  let waterTotalT = ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy - $.farmInfo.farmUserPro.totalEnergy) / 10;//一共还需浇多少次水

  let waterD = Math.ceil(waterTotalT / waterEveryDayT);

  message += `【预测】${waterD === 1 ? '明天' : waterD === 2 ? '后天' : waterD + '天之后'}(${timeFormat(24 * 60 * 60 * 1000 * waterD + Date.now())}日)可兑换水果🍉`
}

//浇水十次
async function doTenWater() {
  jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
  if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
    jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
  }
  await myCardInfoForFarm();
  const {fastCard, doubleCard, beanCard, signCard} = $.myCardInfoRes;
  if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match(`限时翻倍`) && beanCard > 0) {
    console.log(`您设置的是使用水滴换豆卡，且背包有水滴换豆卡${beanCard}张, 跳过10次浇水任务`)
    return
  }
  if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
    console.log(`\n准备浇水十次`);
    let waterCount = 0;
    isFruitFinished = false;
    for (; waterCount < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit - $.farmTask.totalWaterTaskInit.totalWaterTaskTimes; waterCount++) {
      console.log(`第${waterCount + 1}次浇水`);
      await waterGoodForFarm();
      console.log(`本次浇水结果:   ${JSON.stringify($.waterResult)}`);
      if ($.waterResult.code === '0') {
        console.log(`剩余水滴${$.waterResult.totalEnergy}g`);
        if ($.waterResult.finished) {
          // 已证实，waterResult.finished为true，表示水果可以去领取兑换了
          isFruitFinished = true;
          break
        } else {
          if ($.waterResult.totalEnergy < 10) {
            console.log(`水滴不够，结束浇水`)
            break
          }
          await gotStageAward();//领取阶段性水滴奖励
        }
      } else {
        console.log('浇水出现失败异常,跳出不在继续浇水')
        break;
      }
    }
    if (isFruitFinished) {
      option['open-url'] = urlSchema;
      $.msg($.name, ``, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option);
      $.done();
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}水果已可领取`, `京东账号${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}已可领取`);
      }
    }
  } else {
    console.log('\n今日已完成10次浇水任务\n');
  }
}

//领取首次浇水奖励
async function getFirstWaterAward() {
  await taskInitForFarm();
  //领取首次浇水奖励
  if (!$.farmTask.firstWaterInit.f && $.farmTask.firstWaterInit.totalWaterTimes > 0) {
    await firstWaterTaskForFarm();
    if ($.firstWaterReward.code === '0') {
      console.log(`【首次浇水奖励】获得${$.firstWaterReward.amount}g💧\n`);
      // message += `【首次浇水奖励】获得${$.firstWaterReward.amount}g💧\n`;
    } else {
      // message += '【首次浇水奖励】领取奖励失败,详询日志\n';
      console.log(`领取首次浇水奖励结果:  ${JSON.stringify($.firstWaterReward)}`);
    }
  } else {
    console.log('首次浇水奖励已领取\n')
  }
}

//领取十次浇水奖励
async function getTenWaterAward() {
  //领取10次浇水奖励
  if (!$.farmTask.totalWaterTaskInit.f && $.farmTask.totalWaterTaskInit.totalWaterTaskTimes >= $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
    await totalWaterTaskForFarm();
    if ($.totalWaterReward.code === '0') {
      console.log(`【十次浇水奖励】获得${$.totalWaterReward.totalWaterTaskEnergy}g💧\n`);
      // message += `【十次浇水奖励】获得${$.totalWaterReward.totalWaterTaskEnergy}g💧\n`;
    } else {
      // message += '【十次浇水奖励】领取奖励失败,详询日志\n';
      console.log(`领取10次浇水奖励结果:  ${JSON.stringify($.totalWaterReward)}`);
    }
  } else if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
    // message += `【十次浇水奖励】任务未完成，今日浇水${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}次\n`;
    console.log(`【十次浇水奖励】任务未完成，今日浇水${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}次\n`);
  }
  console.log('finished 水果任务完成!');
}

//再次浇水
async function doTenWaterAgain() {
  console.log('开始检查剩余水滴能否再次浇水再次浇水\n');
  await initForFarm();
  let totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
  console.log(`剩余水滴${totalEnergy}g\n`);
  await myCardInfoForFarm();
  const {fastCard, doubleCard, beanCard, signCard} = $.myCardInfoRes;
  console.log(`背包已有道具:\n快速浇水卡:${fastCard === -1 ? '未解锁' : fastCard + '张'}\n水滴翻倍卡:${doubleCard === -1 ? '未解锁' : doubleCard + '张'}\n水滴换京豆卡:${beanCard === -1 ? '未解锁' : beanCard + '张'}\n加签卡:${signCard === -1 ? '未解锁' : signCard + '张'}\n`)
  if (totalEnergy >= 100 && doubleCard > 0) {
    //使用翻倍水滴卡
    for (let i = 0; i < new Array(doubleCard).fill('').length; i++) {
      await userMyCardForFarm('doubleCard');
      console.log(`使用翻倍水滴卡结果:${JSON.stringify($.userMyCardRes)}`);
    }
    await initForFarm();
    totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
  }
  if (signCard > 0) {
    //使用加签卡
    for (let i = 0; i < new Array(signCard).fill('').length; i++) {
      await userMyCardForFarm('signCard');
      console.log(`使用加签卡结果:${JSON.stringify($.userMyCardRes)}`);
    }
    await initForFarm();
    totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
  }
  jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
  if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
    jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
  }
  if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match('限时翻倍')) {
    console.log(`\n您设置的是水滴换豆功能,现在为您换豆`);
    if (totalEnergy >= 100 && $.myCardInfoRes.beanCard > 0) {
      //使用水滴换豆卡
      await userMyCardForFarm('beanCard');
      console.log(`使用水滴换豆卡结果:${JSON.stringify($.userMyCardRes)}`);
      if ($.userMyCardRes.code === '0') {
        message += `【水滴换豆卡】获得${$.userMyCardRes.beanCount}个京豆\n`;
        return
      }
    } else {
      console.log(`您目前水滴:${totalEnergy}g,水滴换豆卡${$.myCardInfoRes.beanCard}张,暂不满足水滴换豆的条件,为您继续浇水`)
    }
  }
  let overageEnergy = totalEnergy - retainWater;
  if (totalEnergy >= ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy)) {
    //如果现有的水滴，大于水果可兑换所需的对滴(也就是把水滴浇完，水果就能兑换了)
    isFruitFinished = false;
    for (let i = 0; i < ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10; i++) {
      await waterGoodForFarm();
      console.log(`本次浇水结果(水果马上就可兑换了):   ${JSON.stringify($.waterResult)}`);
      if ($.waterResult.code === '0') {
        console.log('\n浇水10g成功\n');
        if ($.waterResult.finished) {
          // 已证实，waterResult.finished为true，表示水果可以去领取兑换了
          isFruitFinished = true;
          break
        } else {
          console.log(`目前水滴【${$.waterResult.totalEnergy}】g,继续浇水，水果马上就可以兑换了`)
        }
      } else {
        console.log('浇水出现失败异常,跳出不在继续浇水')
        break;
      }
    }
    if (isFruitFinished) {
      option['open-url'] = urlSchema;
      $.msg($.name, ``, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option);
      $.done();
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}水果已可领取`, `京东账号${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}已可领取`);
      }
    }
  } else if (overageEnergy >= 10) {
    console.log("目前剩余水滴：【" + totalEnergy + "】g，可继续浇水");
    isFruitFinished = false;
    for (let i = 0; i < parseInt(overageEnergy / 10); i++) {
      await waterGoodForFarm();
      console.log(`本次浇水结果:   ${JSON.stringify($.waterResult)}`);
      if ($.waterResult.code === '0') {
        console.log(`\n浇水10g成功,剩余${$.waterResult.totalEnergy}\n`)
        if ($.waterResult.finished) {
          // 已证实，waterResult.finished为true，表示水果可以去领取兑换了
          isFruitFinished = true;
          break
        } else {
          await gotStageAward()
        }
      } else {
        console.log('浇水出现失败异常,跳出不在继续浇水')
        break;
      }
    }
    if (isFruitFinished) {
      option['open-url'] = urlSchema;
      $.msg($.name, ``, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option);
      $.done();
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}水果已可领取`, `京东账号${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}已可领取`);
      }
    }
  } else {
    console.log("目前剩余水滴：【" + totalEnergy + "】g,不再继续浇水,保留部分水滴用于完成第二天【十次浇水得水滴】任务")
  }
}

//领取阶段性水滴奖励
function gotStageAward() {
  return new Promise(async resolve => {
    if ($.waterResult.waterStatus === 0 && $.waterResult.treeEnergy === 10) {
      console.log('果树发芽了,奖励30g水滴');
      await gotStageAwardForFarm('1');
      console.log(`浇水阶段奖励1领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`);
      if ($.gotStageAwardForFarmRes.code === '0') {
        // message += `【果树发芽了】奖励${$.gotStageAwardForFarmRes.addEnergy}\n`;
        console.log(`【果树发芽了】奖励${$.gotStageAwardForFarmRes.addEnergy}\n`);
      }
    } else if ($.waterResult.waterStatus === 1) {
      console.log('果树开花了,奖励40g水滴');
      await gotStageAwardForFarm('2');
      console.log(`浇水阶段奖励2领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`);
      if ($.gotStageAwardForFarmRes.code === '0') {
        // message += `【果树开花了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`;
        console.log(`【果树开花了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`);
      }
    } else if ($.waterResult.waterStatus === 2) {
      console.log('果树长出小果子啦, 奖励50g水滴');
      await gotStageAwardForFarm('3');
      console.log(`浇水阶段奖励3领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`)
      if ($.gotStageAwardForFarmRes.code === '0') {
        // message += `【果树结果了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`;
        console.log(`【果树结果了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`);
      }
    }
    resolve()
  })
}

//天天抽奖活动
async function turntableFarm() {
  await initForTurntableFarm();
  if ($.initForTurntableFarmRes.code === '0') {
    //领取定时奖励 //4小时一次
    let {
      timingIntervalHours,
      timingLastSysTime,
      sysTime,
      timingGotStatus,
      remainLotteryTimes,
      turntableInfos
    } = $.initForTurntableFarmRes;

    if (!timingGotStatus) {
      console.log(`是否到了领取免费赠送的抽奖机会----${sysTime > (timingLastSysTime + 60 * 60 * timingIntervalHours * 1000)}`)
      if (sysTime > (timingLastSysTime + 60 * 60 * timingIntervalHours * 1000)) {
        await timingAwardForTurntableFarm();
        console.log(`领取定时奖励结果${JSON.stringify($.timingAwardRes)}`);
        await initForTurntableFarm();
        remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
      } else {
        console.log(`免费赠送的抽奖机会未到时间`)
      }
    } else {
      console.log('4小时候免费赠送的抽奖机会已领取')
    }
    if ($.initForTurntableFarmRes.turntableBrowserAds && $.initForTurntableFarmRes.turntableBrowserAds.length > 0) {
      for (let index = 0; index < $.initForTurntableFarmRes.turntableBrowserAds.length; index++) {
        if (!$.initForTurntableFarmRes.turntableBrowserAds[index].status) {
          console.log(`开始浏览天天抽奖的第${index + 1}个逛会场任务`)
          await browserForTurntableFarm(1, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
          if ($.browserForTurntableFarmRes.code === '0' && $.browserForTurntableFarmRes.status) {
            console.log(`第${index + 1}个逛会场任务完成，开始领取水滴奖励\n`)
            await browserForTurntableFarm(2, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
            if ($.browserForTurntableFarmRes.code === '0') {
              console.log(`第${index + 1}个逛会场任务领取水滴奖励完成\n`)
              await initForTurntableFarm();
              remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
            }
          }
        } else {
          console.log(`浏览天天抽奖的第${index + 1}个逛会场任务已完成`)
        }
      }
    }
    //天天抽奖助力
    console.log('开始天天抽奖--好友助力--每人每天只有三次助力机会.')
    for (let code of newShareCodes) {
      if (code === $.farmInfo.farmUserPro.shareCode) {
        console.log('天天抽奖-不能自己给自己助力\n')
        continue
      }
      await lotteryMasterHelp(code);
      // console.log('天天抽奖助力结果',lotteryMasterHelpRes.helpResult)
      if ($.lotteryMasterHelpRes.helpResult.code === '0') {
        console.log(`天天抽奖-助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}成功\n`)
      } else if ($.lotteryMasterHelpRes.helpResult.code === '11') {
        console.log(`天天抽奖-不要重复助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}\n`)
      } else if ($.lotteryMasterHelpRes.helpResult.code === '13') {
        console.log(`天天抽奖-助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}失败,助力次数耗尽\n`);
        break;
      }
    }
    console.log(`---天天抽奖次数remainLotteryTimes----${remainLotteryTimes}次`)
    //抽奖
    if (remainLotteryTimes > 0) {
      console.log('开始抽奖')
      let lotteryResult = '';
      for (let i = 0; i < new Array(remainLotteryTimes).fill('').length; i++) {
        await lotteryForTurntableFarm()
        console.log(`第${i + 1}次抽奖结果${JSON.stringify($.lotteryRes)}`);
        if ($.lotteryRes.code === '0') {
          turntableInfos.map((item) => {
            if (item.type === $.lotteryRes.type) {
              console.log(`lotteryRes.type${$.lotteryRes.type}`);
              if ($.lotteryRes.type.match(/bean/g) && $.lotteryRes.type.match(/bean/g)[0] === 'bean') {
                lotteryResult += `${item.name}个，`;
              } else if ($.lotteryRes.type.match(/water/g) && $.lotteryRes.type.match(/water/g)[0] === 'water') {
                lotteryResult += `${item.name}，`;
              } else {
                lotteryResult += `${item.name}，`;
              }
            }
          })
          //没有次数了
          if ($.lotteryRes.remainLotteryTimes === 0) {
            break
          }
        }
      }
      if (lotteryResult) {
        console.log(`【天天抽奖】${lotteryResult.substr(0, lotteryResult.length - 1)}\n`)
        // message += `【天天抽奖】${lotteryResult.substr(0, lotteryResult.length - 1)}\n`;
      }
    } else {
      console.log('天天抽奖--抽奖机会为0次')
    }
  } else {
    console.log('初始化天天抽奖得好礼失败')
  }
}

//领取额外奖励水滴
async function getExtraAward() {
  await masterHelpTaskInitForFarm();
  if ($.masterHelpResult.code === '0') {
    if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length >= 5) {
      // 已有五人助力。领取助力后的奖励
      if (!$.masterHelpResult.masterGotFinal) {
        await masterGotFinishedTaskForFarm();
        if ($.masterGotFinished.code === '0') {
          console.log(`已成功领取好友助力奖励：【${$.masterGotFinished.amount}】g水`);
          message += `【额外奖励】${$.masterGotFinished.amount}g水领取成功\n`;
        }
      } else {
        console.log("已经领取过5好友助力额外奖励");
        message += `【额外奖励】已被领取过\n`;
      }
    } else {
      console.log("助力好友未达到5个");
      message += `【额外奖励】领取失败,原因：给您助力的人未达5个\n`;
    }
    if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length > 0) {
      let str = '';
      $.masterHelpResult.masterHelpPeoples.map((item, index) => {
        if (index === ($.masterHelpResult.masterHelpPeoples.length - 1)) {
          str += item.nickName || "匿名用户";
        } else {
          str += (item.nickName || "匿名用户") + ',';
        }
        let date = new Date(item.time);
        let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getMinutes();
        console.log(`\n京东昵称【${item.nickName || "匿名用户"}】 在 ${time} 给您助过力\n`);
      })
      message += `【助力您的好友】${str}\n`;
    }
    console.log('领取额外奖励水滴结束\n');
  }
}

//领取新的助力奖励
async function getExtraAward2() {
  await masterHelpTaskInitForFarm2();
  if ($.masterHelpResult2.code === '0') {
    peopleHelps = $.masterHelpResult2.assistFriendList
    status = $.masterHelpResult2.status
    assistStageList = $.masterHelpResult2.assistStageList
    if (status != '0') {
      for (let vo of assistStageList) {
        stageStaus = vo.stageStaus
        assistNum = vo.assistNum
        if (stageStaus == '2') {
          await masterGotFinishedTaskForFarm2()
          if ($.masterGotFinished2.code === '0') {
            console.log(`已成功领取${assistNum}个好友助力奖励：【${$.masterGotFinished2.amount}】g水`);
            message += `【${assistNum}个好友额外奖励】${$.masterGotFinished2.amount}g水领取成功\n`;
          }
        } else if (stageStaus == '3') {
          console.log(`已经领取过${assistNum}个好友助力额外奖励`);
          message += `【${assistNum}个好友助力额外奖励】已被领取过\n`;
        }
      }
    } else {
      console.log("助力好友少于2个");
      message += `【额外奖励】领取失败,原因：给您助力的人少于2个\n`;
    }
    if (Array.isArray(peopleHelps) && peopleHelps.length !== 0) {
      let str = '';
      peopleHelps.map((item, index) => {
        if (index === (peopleHelps.length - 1)) {
          str += item.nickName || "匿名用户";
        } else {
          str += (item.nickName || "匿名用户") + ',';
        }
        let date = new Date(item.time);
        let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getMinutes();
        console.log(`\n京东昵称【${item.nickName || "匿名用户"}】 在 ${time} 给您助过力\n`);
      })
      message += `【助力您的好友】${str}\n`;
    }
    console.log('领取额外奖励水滴结束\n');
  }
}

//助力好友
async function masterHelpShare() {
  console.log('开始助力好友')
  let salveHelpAddWater = 0;
  let remainTimes = 3;//今日剩余助力次数,默认3次（京东农场每人每天3次助力机会）。
  let helpSuccessPeoples = '';//成功助力好友
  console.log(`格式化后的助力码::${JSON.stringify(newShareCodes)}\n`);

  for (let code of newShareCodes) {
    console.log(`开始助力京东账号${$.index} - ${$.nickName}的好友: ${code}`);
    if (!code) continue;
    if (code === $.farmInfo.farmUserPro.shareCode) {
      console.log('不能为自己助力哦，跳过自己的shareCode\n')
      continue
    }
    await masterHelp(code);
    if ($.helpResult.code === '0') {
      if ($.helpResult.helpResult.code === '0') {
        //助力成功
        salveHelpAddWater += $.helpResult.helpResult.salveHelpAddWater;
        console.log(`【助力好友结果】: 已成功给【${$.helpResult.helpResult.masterUserInfo.nickName}】助力`);
        console.log(`给好友【${$.helpResult.helpResult.masterUserInfo.nickName}】助力获得${$.helpResult.helpResult.salveHelpAddWater}g水滴`)
        helpSuccessPeoples += ($.helpResult.helpResult.masterUserInfo.nickName || '匿名用户') + ',';
      } else if ($.helpResult.helpResult.code === '8') {
        console.log(`【助力好友结果】: 助力【${$.helpResult.helpResult.masterUserInfo.nickName}】失败，您今天助力次数已耗尽`);
      } else if ($.helpResult.helpResult.code === '9') {
        console.log(`【助力好友结果】: 之前给【${$.helpResult.helpResult.masterUserInfo.nickName}】助力过了`);
      } else if ($.helpResult.helpResult.code === '10') {
        console.log(`【助力好友结果】: 好友【${$.helpResult.helpResult.masterUserInfo.nickName}】已满五人助力`);
      } else {
        console.log(`助力其他情况：${JSON.stringify($.helpResult.helpResult)}`);
      }
      console.log(`【今日助力次数还剩】${$.helpResult.helpResult.remainTimes}次\n`);
      remainTimes = $.helpResult.helpResult.remainTimes;
      if ($.helpResult.helpResult.remainTimes === 0) {
        console.log(`您当前助力次数已耗尽，跳出助力`);
        break
      }
    } else {
      console.log(`助力失败::${JSON.stringify($.helpResult)}`);
    }
  }
  if ($.isLoon() || $.isQuanX() || $.isSurge()) {
    let helpSuccessPeoplesKey = timeFormat() + $.farmInfo.farmUserPro.shareCode;
    if (!$.getdata(helpSuccessPeoplesKey)) {
      //把前一天的清除
      $.setdata('', timeFormat(Date.now() - 24 * 60 * 60 * 1000) + $.farmInfo.farmUserPro.shareCode);
      $.setdata('', helpSuccessPeoplesKey);
    }
    if (helpSuccessPeoples) {
      if ($.getdata(helpSuccessPeoplesKey)) {
        $.setdata($.getdata(helpSuccessPeoplesKey) + ',' + helpSuccessPeoples, helpSuccessPeoplesKey);
      } else {
        $.setdata(helpSuccessPeoples, helpSuccessPeoplesKey);
      }
    }
    helpSuccessPeoples = $.getdata(helpSuccessPeoplesKey);
  }
  if (helpSuccessPeoples && helpSuccessPeoples.length > 0) {
    message += `【您助力的好友👬】${helpSuccessPeoples.substr(0, helpSuccessPeoples.length - 1)}\n`;
  }
  if (salveHelpAddWater > 0) {
    // message += `【助力好友👬】获得${salveHelpAddWater}g💧\n`;
    console.log(`【助力好友👬】获得${salveHelpAddWater}g💧\n`);
  }
  message += `【今日剩余助力👬】${remainTimes}次\n`;
  console.log('助力好友结束，即将开始领取额外水滴奖励\n');
}

//水滴雨
async function executeWaterRains() {
  let executeWaterRain = !$.farmTask.waterRainInit.f;
  if (executeWaterRain) {
    console.log(`水滴雨任务，每天两次，最多可得10g水滴`);
    console.log(`两次水滴雨任务是否全部完成：${$.farmTask.waterRainInit.f ? '是' : '否'}`);
    if ($.farmTask.waterRainInit.lastTime) {
      if (Date.now() < ($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000)) {
        executeWaterRain = false;
        // message += `【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】未到时间，请${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}再试\n`;
        console.log(`\【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】未到时间，请${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}再试\n`);
      }
    }
    if (executeWaterRain) {
      console.log(`开始水滴雨任务,这是第${$.farmTask.waterRainInit.winTimes + 1}次，剩余${2 - ($.farmTask.waterRainInit.winTimes + 1)}次`);
      await waterRainForFarm();
      console.log('水滴雨waterRain');
      if ($.waterRain.code === '0') {
        console.log('水滴雨任务执行成功，获得水滴：' + $.waterRain.addEnergy + 'g');
        console.log(`【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】获得${$.waterRain.addEnergy}g水滴\n`);
        // message += `【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】获得${$.waterRain.addEnergy}g水滴\n`;
      }
    }
  } else {
    // message += `【水滴雨】已全部完成，获得20g💧\n`;
  }
}

//打卡领水活动
async function clockInIn() {
  console.log('开始打卡领水活动（签到，关注，领券）');
  await clockInInitForFarm();
  if ($.clockInInit.code === '0') {
    // 签到得水滴
    if (!$.clockInInit.todaySigned) {
      console.log('开始今日签到');
      await clockInForFarm();
      console.log(`打卡结果${JSON.stringify($.clockInForFarmRes)}`);
      if ($.clockInForFarmRes.code === '0') {
        // message += `【第${$.clockInForFarmRes.signDay}天签到】获得${$.clockInForFarmRes.amount}g💧\n`;
        console.log(`【第${$.clockInForFarmRes.signDay}天签到】获得${$.clockInForFarmRes.amount}g💧\n`)
        if ($.clockInForFarmRes.signDay === 7) {
          //可以领取惊喜礼包
          console.log('开始领取--惊喜礼包38g水滴');
          await gotClockInGift();
          if ($.gotClockInGiftRes.code === '0') {
            // message += `【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`;
            console.log(`【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`);
          }
        }
      }
    }
    if ($.clockInInit.todaySigned && $.clockInInit.totalSigned === 7) {
      console.log('开始领取--惊喜礼包38g水滴');
      await gotClockInGift();
      if ($.gotClockInGiftRes.code === '0') {
        // message += `【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`;
        console.log(`【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`);
      }
    }
    // 限时关注得水滴
    if ($.clockInInit.themes && $.clockInInit.themes.length > 0) {
      for (let item of $.clockInInit.themes) {
        if (!item.hadGot) {
          console.log(`关注ID${item.id}`);
          await clockInFollowForFarm(item.id, "theme", "1");
          console.log(`themeStep1--结果${JSON.stringify($.themeStep1)}`);
          if ($.themeStep1.code === '0') {
            await clockInFollowForFarm(item.id, "theme", "2");
            console.log(`themeStep2--结果${JSON.stringify($.themeStep2)}`);
            if ($.themeStep2.code === '0') {
              console.log(`关注${item.name}，获得水滴${$.themeStep2.amount}g`);
            }
          }
        }
      }
    }
    // 限时领券得水滴
    if ($.clockInInit.venderCoupons && $.clockInInit.venderCoupons.length > 0) {
      for (let item of $.clockInInit.venderCoupons) {
        if (!item.hadGot) {
          console.log(`领券的ID${item.id}`);
          await clockInFollowForFarm(item.id, "venderCoupon", "1");
          console.log(`venderCouponStep1--结果${JSON.stringify($.venderCouponStep1)}`);
          if ($.venderCouponStep1.code === '0') {
            await clockInFollowForFarm(item.id, "venderCoupon", "2");
            if ($.venderCouponStep2.code === '0') {
              console.log(`venderCouponStep2--结果${JSON.stringify($.venderCouponStep2)}`);
              console.log(`从${item.name}领券，获得水滴${$.venderCouponStep2.amount}g`);
            }
          }
        }
      }
    }
  }
  console.log('开始打卡领水活动（签到，关注，领券）结束\n');
}

//
async function getAwardInviteFriend() {
  await friendListInitForFarm();//查询好友列表
  // console.log(`查询好友列表数据：${JSON.stringify($.friendList)}\n`)
  if ($.friendList) {
    console.log(`\n今日已邀请好友${$.friendList.inviteFriendCount}个 / 每日邀请上限${$.friendList.inviteFriendMax}个`);
    console.log(`开始删除${$.friendList.friends && $.friendList.friends.length}个好友,可拿每天的邀请奖励`);
    if ($.friendList.friends && $.friendList.friends.length > 0) {
      for (let friend of $.friendList.friends) {
        console.log(`\n开始删除好友 [${friend.shareCode}]`);
        const deleteFriendForFarm = await request('deleteFriendForFarm', {
          "shareCode": `${friend.shareCode}`,
          "version": 8,
          "channel": 1
        });
        if (deleteFriendForFarm && deleteFriendForFarm.code === '0') {
          console.log(`删除好友 [${friend.shareCode}] 成功\n`);
        }
      }
    }
    await receiveFriendInvite();//为他人助力,接受邀请成为别人的好友
    if ($.friendList.inviteFriendCount > 0) {
      if ($.friendList.inviteFriendCount > $.friendList.inviteFriendGotAwardCount) {
        console.log('开始领取邀请好友的奖励');
        await awardInviteFriendForFarm();
        console.log(`领取邀请好友的奖励结果：：${JSON.stringify($.awardInviteFriendRes)}`);
      }
    } else {
      console.log('今日未邀请过好友')
    }
  } else {
    console.log(`查询好友列表失败\n`);
  }
}

//给好友浇水
async function doFriendsWater() {
  await friendListInitForFarm();
  console.log('开始给好友浇水...');
  await taskInitForFarm();
  const {waterFriendCountKey, waterFriendMax} = $.farmTask.waterFriendTaskInit;
  console.log(`今日已给${waterFriendCountKey}个好友浇水`);
  if (waterFriendCountKey < waterFriendMax) {
    let needWaterFriends = [];
    if ($.friendList.friends && $.friendList.friends.length > 0) {
      $.friendList.friends.map((item, index) => {
        if (item.friendState === 1) {
          if (needWaterFriends.length < (waterFriendMax - waterFriendCountKey)) {
            needWaterFriends.push(item.shareCode);
          }
        }
      });
      console.log(`需要浇水的好友列表shareCodes:${JSON.stringify(needWaterFriends)}`);
      let waterFriendsCount = 0, cardInfoStr = '';
      for (let index = 0; index < needWaterFriends.length; index++) {
        await waterFriendForFarm(needWaterFriends[index]);
        console.log(`为第${index + 1}个好友浇水结果:${JSON.stringify($.waterFriendForFarmRes)}\n`)
        if ($.waterFriendForFarmRes.code === '0') {
          waterFriendsCount++;
          if ($.waterFriendForFarmRes.cardInfo) {
            console.log('为好友浇水获得道具了');
            if ($.waterFriendForFarmRes.cardInfo.type === 'beanCard') {
              console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `水滴换豆卡,`;
            } else if ($.waterFriendForFarmRes.cardInfo.type === 'fastCard') {
              console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `快速浇水卡,`;
            } else if ($.waterFriendForFarmRes.cardInfo.type === 'doubleCard') {
              console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `水滴翻倍卡,`;
            } else if ($.waterFriendForFarmRes.cardInfo.type === 'signCard') {
              console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `加签卡,`;
            }
          }
        } else if ($.waterFriendForFarmRes.code === '11') {
          console.log('水滴不够,跳出浇水')
        }
      }
      // message += `【好友浇水】已给${waterFriendsCount}个好友浇水,消耗${waterFriendsCount * 10}g水\n`;
      console.log(`【好友浇水】已给${waterFriendsCount}个好友浇水,消耗${waterFriendsCount * 10}g水\n`);
      if (cardInfoStr && cardInfoStr.length > 0) {
        // message += `【好友浇水奖励】${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`;
        console.log(`【好友浇水奖励】${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`);
      }
    } else {
      console.log('您的好友列表暂无好友,快去邀请您的好友吧!')
    }
  } else {
    console.log(`今日已为好友浇水量已达${waterFriendMax}个`)
  }
}

//领取给3个好友浇水后的奖励水滴
async function getWaterFriendGotAward() {
  await taskInitForFarm();
  const {
    waterFriendCountKey,
    waterFriendMax,
    waterFriendSendWater,
    waterFriendGotAward
  } = $.farmTask.waterFriendTaskInit
  if (waterFriendCountKey >= waterFriendMax) {
    if (!waterFriendGotAward) {
      await waterFriendGotAwardForFarm();
      console.log(`领取给${waterFriendMax}个好友浇水后的奖励水滴::${JSON.stringify($.waterFriendGotAwardRes)}`)
      if ($.waterFriendGotAwardRes.code === '0') {
        // message += `【给${waterFriendMax}好友浇水】奖励${$.waterFriendGotAwardRes.addWater}g水滴\n`;
        console.log(`【给${waterFriendMax}好友浇水】奖励${$.waterFriendGotAwardRes.addWater}g水滴\n`);
      }
    } else {
      console.log(`给好友浇水的${waterFriendSendWater}g水滴奖励已领取\n`);
      // message += `【给${waterFriendMax}好友浇水】奖励${waterFriendSendWater}g水滴已领取\n`;
    }
  } else {
    console.log(`暂未给${waterFriendMax}个好友浇水\n`);
  }
}

//接收成为对方好友的邀请
async function receiveFriendInvite() {
  for (let code of newShareCodes) {
    if (code === $.farmInfo.farmUserPro.shareCode) {
      console.log('自己不能邀请自己成为好友噢\n')
      continue
    }
    await inviteFriend(code);
    // console.log(`接收邀请成为好友结果:${JSON.stringify($.inviteFriendRes)}`)
    if ($.inviteFriendRes && $.inviteFriendRes.helpResult && $.inviteFriendRes.helpResult.code === '0') {
      console.log(`接收邀请成为好友结果成功,您已成为${$.inviteFriendRes.helpResult.masterUserInfo.nickName}的好友`)
    } else if ($.inviteFriendRes && $.inviteFriendRes.helpResult && $.inviteFriendRes.helpResult.code === '17') {
      console.log(`接收邀请成为好友结果失败,对方已是您的好友`)
    }
  }
  // console.log(`开始接受6fbd26cc27ac44d6a7fed34092453f77的邀请\n`)
  // await inviteFriend('6fbd26cc27ac44d6a7fed34092453f77');
  // console.log(`接收邀请成为好友结果:${JSON.stringify($.inviteFriendRes.helpResult)}`)
  // if ($.inviteFriendRes.helpResult.code === '0') {
  //   console.log(`您已成为${$.inviteFriendRes.helpResult.masterUserInfo.nickName}的好友`)
  // } else if ($.inviteFriendRes.helpResult.code === '17') {
  //   console.log(`对方已是您的好友`)
  // }
}

async function duck() {
  for (let i = 0; i < 10; i++) {
    //这里循环十次
    await getFullCollectionReward();
    if ($.duckRes.code === '0') {
      if (!$.duckRes.hasLimit) {
        console.log(`小鸭子游戏:${$.duckRes.title}`);
        // if ($.duckRes.type !== 3) {
        //   console.log(`${$.duckRes.title}`);
        //   if ($.duckRes.type === 1) {
        //     message += `【小鸭子】为你带回了水滴\n`;
        //   } else if ($.duckRes.type === 2) {
        //     message += `【小鸭子】为你带回快速浇水卡\n`
        //   }
        // }
      } else {
        console.log(`${$.duckRes.title}`)
        break;
      }
    } else if ($.duckRes.code === '10') {
      console.log(`小鸭子游戏达到上限`)
      break;
    }
  }
}

// ========================API调用接口========================
//鸭子，点我有惊喜
async function getFullCollectionReward() {
  return new Promise(resolve => {
    const body = {"type": 2, "version": 6, "channel": 2};
    $.post(taskUrl("getFullCollectionReward", body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东农场: API查询请求失败 ‼️‼️');
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            $.duckRes = JSON.parse(data);
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

/**
 * 领取10次浇水奖励API
 */
async function totalWaterTaskForFarm() {
  const functionId = arguments.callee.name.toString();
  $.totalWaterReward = await request(functionId);
}

//领取首次浇水奖励API
async function firstWaterTaskForFarm() {
  const functionId = arguments.callee.name.toString();
  $.firstWaterReward = await request(functionId);
}

//领取给3个好友浇水后的奖励水滴API
async function waterFriendGotAwardForFarm() {
  const functionId = arguments.callee.name.toString();
  $.waterFriendGotAwardRes = await request(functionId, {"version": 4, "channel": 1});
}

// 查询背包道具卡API
async function myCardInfoForFarm() {
  const functionId = arguments.callee.name.toString();
  $.myCardInfoRes = await request(functionId, {"version": 5, "channel": 1});
}

//使用道具卡API
async function userMyCardForFarm(cardType) {
  const functionId = arguments.callee.name.toString();
  $.userMyCardRes = await request(functionId, {"cardType": cardType});
}

/**
 * 领取浇水过程中的阶段性奖励
 * @param type
 * @returns {Promise<void>}
 */
async function gotStageAwardForFarm(type) {
  $.gotStageAwardForFarmRes = await request(arguments.callee.name.toString(), {'type': type});
}

//浇水API
async function waterGoodForFarm() {
  await $.wait(1000);
  console.log('等待了1秒');

  const functionId = arguments.callee.name.toString();
  $.waterResult = await request(functionId);
}

// 初始化集卡抽奖活动数据API
async function initForTurntableFarm() {
  $.initForTurntableFarmRes = await request(arguments.callee.name.toString(), {version: 4, channel: 1});
}

async function lotteryForTurntableFarm() {
  await $.wait(2000);
  console.log('等待了2秒');
  $.lotteryRes = await request(arguments.callee.name.toString(), {type: 1, version: 4, channel: 1});
}

async function timingAwardForTurntableFarm() {
  $.timingAwardRes = await request(arguments.callee.name.toString(), {version: 4, channel: 1});
}

async function browserForTurntableFarm(type, adId) {
  if (type === 1) {
    console.log('浏览爆品会场');
  }
  if (type === 2) {
    console.log('天天抽奖浏览任务领取水滴');
  }
  const body = {"type": type, "adId": adId, "version": 4, "channel": 1};
  $.browserForTurntableFarmRes = await request(arguments.callee.name.toString(), body);
  // 浏览爆品会场8秒
}

//天天抽奖浏览任务领取水滴API
async function browserForTurntableFarm2(type) {
  const body = {"type": 2, "adId": type, "version": 4, "channel": 1};
  $.browserForTurntableFarm2Res = await request('browserForTurntableFarm', body);
}

/**
 * 天天抽奖拿好礼-助力API(每人每天三次助力机会)
 */
async function lotteryMasterHelp() {
  $.lotteryMasterHelpRes = await request(`initForFarm`, {
    imageUrl: "",
    nickName: "",
    shareCode: arguments[0] + '-3',
    babelChannel: "3",
    version: 4,
    channel: 1
  });
}

//领取5人助力后的额外奖励API
async function masterGotFinishedTaskForFarm() {
  const functionId = arguments.callee.name.toString();
  $.masterGotFinished = await request(functionId);
}

//助力好友信息API
async function masterHelpTaskInitForFarm() {
  const functionId = arguments.callee.name.toString();
  $.masterHelpResult = await request(functionId);
}


//领取新的助力奖励
async function masterGotFinishedTaskForFarm2() {
  const functionId = `receiveStageEnergy`;
  $.masterGotFinished2 = await request(functionId, newPrizeBody);
}

//新的助力好友信息API
async function masterHelpTaskInitForFarm2() {
  const functionId = `farmAssistInit`;
  $.masterHelpResult2 = await request(functionId, newPrizeBody);
}

//接受对方邀请,成为对方好友的API
async function inviteFriend() {
  $.inviteFriendRes = await request(`initForFarm`, {
    imageUrl: "",
    nickName: "",
    shareCode: arguments[0] + '-inviteFriend',
    version: 4,
    channel: 2
  });
}

// 助力好友API
async function masterHelp() {
  $.helpResult = await request(`initForFarm`, {
    imageUrl: "",
    nickName: "",
    shareCode: arguments[0],
    babelChannel: "3",
    version: 2,
    channel: 1
  });
}

/**
 * 水滴雨API
 */
async function waterRainForFarm() {
  const functionId = arguments.callee.name.toString();
  const body = {"type": 1, "hongBaoTimes": 100, "version": 3};
  $.waterRain = await request(functionId, body);
}

/**
 * 打卡领水API
 */
async function clockInInitForFarm() {
  const functionId = arguments.callee.name.toString();
  $.clockInInit = await request(functionId);
}

// 连续签到API
async function clockInForFarm() {
  const functionId = arguments.callee.name.toString();
  $.clockInForFarmRes = await request(functionId, {"type": 1});
}

//关注，领券等API
async function clockInFollowForFarm(id, type, step) {
  const functionId = arguments.callee.name.toString();
  let body = {
    id,
    type,
    step
  }
  if (type === 'theme') {
    if (step === '1') {
      $.themeStep1 = await request(functionId, body);
    } else if (step === '2') {
      $.themeStep2 = await request(functionId, body);
    }
  } else if (type === 'venderCoupon') {
    if (step === '1') {
      $.venderCouponStep1 = await request(functionId, body);
    } else if (step === '2') {
      $.venderCouponStep2 = await request(functionId, body);
    }
  }
}

// 领取连续签到7天的惊喜礼包API
async function gotClockInGift() {
  $.gotClockInGiftRes = await request('clockInForFarm', {"type": 2})
}

//定时领水API
async function gotThreeMealForFarm() {
  const functionId = arguments.callee.name.toString();
  $.threeMeal = await request(functionId);
}

/**
 * 浏览广告任务API
 * type为0时, 完成浏览任务
 * type为1时, 领取浏览任务奖励
 */
async function browseAdTaskForFarm(advertId, type) {
  const functionId = arguments.callee.name.toString();
  if (type === 0) {
    $.browseResult = await request(functionId, {advertId, type});
  } else if (type === 1) {
    $.browseRwardResult = await request(functionId, {advertId, type});
  }
}

// 被水滴砸中API
async function gotWaterGoalTaskForFarm() {
  $.goalResult = await request(arguments.callee.name.toString(), {type: 3});
}

//签到API
async function signForFarm() {
  const functionId = arguments.callee.name.toString();
  $.signResult = await request(functionId);
}

/**
 * 初始化农场, 可获取果树及用户信息API
 */
async function initForFarm() {
  return new Promise(resolve => {
    const option = {
      url: `${JD_API_HOST}?functionId=initForFarm`,
      body: `body=${escape(JSON.stringify({"version": 4}))}&appid=wh5&clientVersion=9.1.0`,
      headers: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "cookie": cookie,
        "origin": "https://home.m.jd.com",
        "pragma": "no-cache",
        "referer": "https://home.m.jd.com/myJd/newhome.action",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;10.2.2;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      timeout: 10000,
    };
    $.post(option, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东农场: API查询请求失败 ‼️‼️');
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            $.farmInfo = JSON.parse(data)
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

// 初始化任务列表API
async function taskInitForFarm() {
  console.log('\n初始化任务列表')
  const functionId = arguments.callee.name.toString();
  $.farmTask = await request(functionId);
}

//获取好友列表API
async function friendListInitForFarm() {
  $.friendList = await request('friendListInitForFarm', {"version": 4, "channel": 1});
  // console.log('aa', aa);
}

// 领取邀请好友的奖励API
async function awardInviteFriendForFarm() {
  $.awardInviteFriendRes = await request('awardInviteFriendForFarm');
}

//为好友浇水API
async function waterFriendForFarm(shareCode) {
  const body = {"shareCode": shareCode, "version": 6, "channel": 1}
  $.waterFriendForFarmRes = await request('waterFriendForFarm', body);
}

async function showMsg() {
  if ($.isNode() && process.env.FRUIT_NOTIFY_CONTROL) {
    $.ctrTemp = `${process.env.FRUIT_NOTIFY_CONTROL}` === 'false';
  } else if ($.getdata('jdFruitNotify')) {
    $.ctrTemp = $.getdata('jdFruitNotify') === 'false';
  } else {
    $.ctrTemp = `${jdNotify}` === 'false';
  }
  if ($.ctrTemp) {
    $.msg($.name, subTitle, message, option);
    if ($.isNode()) {
      allMessage += `${subTitle}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`;
      // await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `${subTitle}\n${message}`);
    }
  } else {
    $.log(`\n${message}\n`);
  }
}

function timeFormat(time) {
  let date;
  if (time) {
    date = new Date(time)
  } else {
    date = new Date();
  }
  return date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
}

function readShareCode() {
  return new Promise(async resolve => {
    $.get({url: `https://api.jdsharecode.xyz/api/farm/${randomCount}`, timeout: 10000}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取个${randomCount}码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
    resolve()
  })
}

function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > shareCodes.length ? (shareCodes.length - 1) : ($.index - 1);
      newShareCodes = shareCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      // newShareCodes = newShareCodes.concat(readShareCodeRes.data || []);
      newShareCodes = [...new Set([...newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify(newShareCodes)}`)
    resolve();
  })
}

function requireConfig() {
  return new Promise(resolve => {
    console.log('开始获取配置文件\n')
    notify = $.isNode() ? require('./sendNotify') : '';
    //Node.js用户请在jdCookie.js处填写京东ck;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    const jdFruitShareCodes = $.isNode() ? require('./jdFruitShareCodes.js') : '';
    //IOS等用户直接用NobyDa的jd cookie
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
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(jdFruitShareCodes).forEach((item) => {
        if (jdFruitShareCodes[item]) {
          $.shareCodesArr.push(jdFruitShareCodes[item])
        }
      })
    } else {
      if ($.getdata('jd_fruit_inviter')) $.shareCodesArr = $.getdata('jd_fruit_inviter').split('\n').filter(item => !!item);
      console.log(`\nBoxJs设置的${$.name}好友邀请码:${$.getdata('jd_fruit_inviter') ? $.getdata('jd_fruit_inviter') : '暂无'}\n`);
    }
    // console.log(`$.shareCodesArr::${JSON.stringify($.shareCodesArr)}`)
    // console.log(`jdFruitShareArr账号长度::${$.shareCodesArr.length}`)
    console.log(`您提供了${$.shareCodesArr.length}个账号的农场助力码\n`);
    resolve()
  })
}

function request(function_id, body = {}, timeout = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      $.get(taskUrl(function_id, body), (err, resp, data) => {
        try {
          if (err) {
            console.log('\n东东农场: API查询请求失败 ‼️‼️')
            console.log(JSON.stringify(err));
            console.log(`function_id:${function_id}`)
            $.logErr(err);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      })
    }, timeout)
  })
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&body=${escape(JSON.stringify(body))}`,
    headers: {
      Cookie: cookie,
      UserAgent: $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;10.2.2;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    },
    timeout: 10000,
  }
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

// prettier-ignore
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
        const [o, h] = i.split("@"), n = {url: `http://${h}/v1/scripting/evaluate`, body: {script_text: t, mock_type: "cron", timeout: r}, headers: {"X-Key": o, Accept: "*/*"}};
        this.post(n, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }

    loaddata() {
      if (!this.isNode()) return {};
      {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
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
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
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
      let i = {"M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds()};
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