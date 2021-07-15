/*
京东京喜工厂
更新时间：2021-6-25
修复做任务、收集电力出现火爆，不能完成任务，重新计算h5st验证
参考自 ：https://www.orzlee.com/web-development/2021/03/03/lxk0301-jingdong-signin-scriptjingxi-factory-solves-the-problem-of-unable-to-signin.html
活动入口：京东APP-游戏与互动-查看更多-京喜工厂
或者: 京东APP首页搜索 "玩一玩" ,造物工厂即可

已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京喜工厂
10 * * * * jd_dreamFactory.js, tag=京喜工厂, img-url=https://github.com/58xinian/icon/raw/master/jdgc.png, enabled=true

================Loon==============
[Script]
cron "10 * * * *" script-path=jd_dreamFactory.js,tag=京喜工厂

===============Surge=================
京喜工厂 = type=cron,cronexp="10 * * * *",wake-system=1,timeout=3600,script-path=jd_dreamFactory.js

============小火箭=========
京喜工厂 = type=cron,script-path=jd_dreamFactory.js, cronexpr="10 * * * *", timeout=3600, enable=true

 */
// prettier-ignore
;!function(a,b){"object"==typeof exports?module.exports=exports=b():"function"==typeof define&&define.amd?define([],b):a.CryptoJS=b()}(this,function(){var B=B||function(p,r){var u=Object.create||function(){function c(){}return function(a){var b;return c.prototype=a,b=new c,c.prototype=null,b}}(),v={},w=v.lib={},z=w.Base=function(){return{extend:function(a){var b=u(this);return a&&b.mixIn(a),b.hasOwnProperty("init")&&this.init!==b.init||(b.init=function(){b.$super.init.apply(this,arguments)}),b.init.prototype=b,b.$super=this,b},create:function(){var a=this.extend();return a.init.apply(a,arguments),a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),x=w.WordArray=z.extend({init:function(a,b){a=this.words=a||[],b!=r?this.sigBytes=b:this.sigBytes=4*a.length},toString:function(a){return(a||n).stringify(this)},concat:function(a){var b=this.words,c=a.words,d=this.sigBytes,e=a.sigBytes;if(this.clamp(),d%4)for(var f=0;f<e;f++){var h=c[f>>>2]>>>24-f%4*8&255;b[d+f>>>2]|=h<<24-(d+f)%4*8}else for(var f=0;f<e;f+=4)b[d+f>>>2]=c[f>>>2];return this.sigBytes+=e,this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-b%4*8,a.length=p.ceil(b/4)},clone:function(){var a=z.clone.call(this);return a.words=this.words.slice(0),a},random:function(e){for(var f,h=[],g=function(b){var b=b,c=987654321,d=4294967295;return function(){c=36969*(65535&c)+(c>>16)&d,b=18e3*(65535&b)+(b>>16)&d;var a=(c<<16)+b&d;return a/=4294967296,a+=.5,a*(p.random()>.5?1:-1)}},i=0;i<e;i+=4){var k=g(4294967296*(f||p.random()));f=987654071*k(),h.push(4294967296*k()|0)}return new x.init(h,e)}}),y=v.enc={},n=y.Hex={stringify:function(a){for(var b=a.words,c=a.sigBytes,d=[],e=0;e<c;e++){var f=b[e>>>2]>>>24-e%4*8&255;d.push((f>>>4).toString(16)),d.push((15&f).toString(16))}return d.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-d%8*4;return new x.init(c,b/2)}},F=y.Latin1={stringify:function(a){for(var b=a.words,c=a.sigBytes,d=[],e=0;e<c;e++){var f=b[e>>>2]>>>24-e%4*8&255;d.push(String.fromCharCode(f))}return d.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(255&a.charCodeAt(d))<<24-d%4*8;return new x.init(c,b)}},G=y.Utf8={stringify:function(a){try{return decodeURIComponent(escape(F.stringify(a)))}catch(a){throw new Error("Malformed UTF-8 data")}},parse:function(a){return F.parse(unescape(encodeURIComponent(a)))}},j=w.BufferedBlockAlgorithm=z.extend({reset:function(){this._data=new x.init,this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=G.parse(a)),this._data.concat(a),this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,d=b.sigBytes,e=this.blockSize,f=4*e,h=d/f;h=a?p.ceil(h):p.max((0|h)-this._minBufferSize,0);var g=h*e,i=p.min(4*g,d);if(g){for(var k=0;k<g;k+=e)this._doProcessBlock(c,k);var m=c.splice(0,g);b.sigBytes-=i}return new x.init(m,i)},clone:function(){var a=z.clone.call(this);return a._data=this._data.clone(),a},_minBufferSize:0}),l=(w.Hasher=j.extend({cfg:z.extend(),init:function(a){this.cfg=this.cfg.extend(a),this.reset()},reset:function(){j.reset.call(this),this._doReset()},update:function(a){return this._append(a),this._process(),this},finalize:function(a){a&&this._append(a);var b=this._doFinalize();return b},blockSize:16,_createHelper:function(c){return function(a,b){return new c.init(b).finalize(a)}},_createHmacHelper:function(c){return function(a,b){return new l.HMAC.init(c,b).finalize(a)}}}),v.algo={});return v}(Math);return function(){function r(a,b,c){for(var d=[],e=0,f=0;f<b;f++)if(f%4){var h=c[a.charCodeAt(f-1)]<<f%4*2,g=c[a.charCodeAt(f)]>>>6-f%4*2;d[e>>>2]|=(h|g)<<24-e%4*8,e++}return w.create(d,e)}var u=B,v=u.lib,w=v.WordArray,z=u.enc;z.Base64={stringify:function(a){var b=a.words,c=a.sigBytes,d=this._map;a.clamp();for(var e=[],f=0;f<c;f+=3)for(var h=b[f>>>2]>>>24-f%4*8&255,g=b[f+1>>>2]>>>24-(f+1)%4*8&255,i=b[f+2>>>2]>>>24-(f+2)%4*8&255,k=h<<16|g<<8|i,m=0;m<4&&f+.75*m<c;m++)e.push(d.charAt(k>>>6*(3-m)&63));var p=d.charAt(64);if(p)for(;e.length%4;)e.push(p);return e.join("")},parse:function(a){var b=a.length,c=this._map,d=this._reverseMap;if(!d){d=this._reverseMap=[];for(var e=0;e<c.length;e++)d[c.charCodeAt(e)]=e}var f=c.charAt(64);if(f){var h=a.indexOf(f);h!==-1&&(b=h)}return r(a,b,d)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(H){function C(a,b,c,d,e,f,h){var g=a+(b&c|~b&d)+e+h;return(g<<f|g>>>32-f)+b}function D(a,b,c,d,e,f,h){var g=a+(b&d|c&~d)+e+h;return(g<<f|g>>>32-f)+b}function E(a,b,c,d,e,f,h){var g=a+(b^c^d)+e+h;return(g<<f|g>>>32-f)+b}function A(a,b,c,d,e,f,h){var g=a+(c^(b|~d))+e+h;return(g<<f|g>>>32-f)+b}var I=B,J=I.lib,L=J.WordArray,N=J.Hasher,K=I.algo,s=[];!function(){for(var a=0;a<64;a++)s[a]=4294967296*H.abs(H.sin(a+1))|0}();var P=K.MD5=N.extend({_doReset:function(){this._hash=new L.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(a,b){for(var c=0;c<16;c++){var d=b+c,e=a[d];a[d]=16711935&(e<<8|e>>>24)|4278255360&(e<<24|e>>>8)}var f=this._hash.words,h=a[b+0],g=a[b+1],i=a[b+2],k=a[b+3],m=a[b+4],p=a[b+5],r=a[b+6],u=a[b+7],v=a[b+8],w=a[b+9],z=a[b+10],x=a[b+11],y=a[b+12],n=a[b+13],F=a[b+14],G=a[b+15],j=f[0],l=f[1],o=f[2],q=f[3];j=C(j,l,o,q,h,7,s[0]),q=C(q,j,l,o,g,12,s[1]),o=C(o,q,j,l,i,17,s[2]),l=C(l,o,q,j,k,22,s[3]),j=C(j,l,o,q,m,7,s[4]),q=C(q,j,l,o,p,12,s[5]),o=C(o,q,j,l,r,17,s[6]),l=C(l,o,q,j,u,22,s[7]),j=C(j,l,o,q,v,7,s[8]),q=C(q,j,l,o,w,12,s[9]),o=C(o,q,j,l,z,17,s[10]),l=C(l,o,q,j,x,22,s[11]),j=C(j,l,o,q,y,7,s[12]),q=C(q,j,l,o,n,12,s[13]),o=C(o,q,j,l,F,17,s[14]),l=C(l,o,q,j,G,22,s[15]),j=D(j,l,o,q,g,5,s[16]),q=D(q,j,l,o,r,9,s[17]),o=D(o,q,j,l,x,14,s[18]),l=D(l,o,q,j,h,20,s[19]),j=D(j,l,o,q,p,5,s[20]),q=D(q,j,l,o,z,9,s[21]),o=D(o,q,j,l,G,14,s[22]),l=D(l,o,q,j,m,20,s[23]),j=D(j,l,o,q,w,5,s[24]),q=D(q,j,l,o,F,9,s[25]),o=D(o,q,j,l,k,14,s[26]),l=D(l,o,q,j,v,20,s[27]),j=D(j,l,o,q,n,5,s[28]),q=D(q,j,l,o,i,9,s[29]),o=D(o,q,j,l,u,14,s[30]),l=D(l,o,q,j,y,20,s[31]),j=E(j,l,o,q,p,4,s[32]),q=E(q,j,l,o,v,11,s[33]),o=E(o,q,j,l,x,16,s[34]),l=E(l,o,q,j,F,23,s[35]),j=E(j,l,o,q,g,4,s[36]),q=E(q,j,l,o,m,11,s[37]),o=E(o,q,j,l,u,16,s[38]),l=E(l,o,q,j,z,23,s[39]),j=E(j,l,o,q,n,4,s[40]),q=E(q,j,l,o,h,11,s[41]),o=E(o,q,j,l,k,16,s[42]),l=E(l,o,q,j,r,23,s[43]),j=E(j,l,o,q,w,4,s[44]),q=E(q,j,l,o,y,11,s[45]),o=E(o,q,j,l,G,16,s[46]),l=E(l,o,q,j,i,23,s[47]),j=A(j,l,o,q,h,6,s[48]),q=A(q,j,l,o,u,10,s[49]),o=A(o,q,j,l,F,15,s[50]),l=A(l,o,q,j,p,21,s[51]),j=A(j,l,o,q,y,6,s[52]),q=A(q,j,l,o,k,10,s[53]),o=A(o,q,j,l,z,15,s[54]),l=A(l,o,q,j,g,21,s[55]),j=A(j,l,o,q,v,6,s[56]),q=A(q,j,l,o,G,10,s[57]),o=A(o,q,j,l,r,15,s[58]),l=A(l,o,q,j,n,21,s[59]),j=A(j,l,o,q,m,6,s[60]),q=A(q,j,l,o,x,10,s[61]),o=A(o,q,j,l,i,15,s[62]),l=A(l,o,q,j,w,21,s[63]),f[0]=f[0]+j|0,f[1]=f[1]+l|0,f[2]=f[2]+o|0,f[3]=f[3]+q|0},_doFinalize:function(){var a=this._data,b=a.words,c=8*this._nDataBytes,d=8*a.sigBytes;b[d>>>5]|=128<<24-d%32;var e=H.floor(c/4294967296),f=c;b[(d+64>>>9<<4)+15]=16711935&(e<<8|e>>>24)|4278255360&(e<<24|e>>>8),b[(d+64>>>9<<4)+14]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8),a.sigBytes=4*(b.length+1),this._process();for(var h=this._hash,g=h.words,i=0;i<4;i++){var k=g[i];g[i]=16711935&(k<<8|k>>>24)|4278255360&(k<<24|k>>>8)}return h},clone:function(){var a=N.clone.call(this);return a._hash=this._hash.clone(),a}});I.MD5=N._createHelper(P),I.HmacMD5=N._createHmacHelper(P)}(Math),function(){var p=B,r=p.lib,u=r.WordArray,v=r.Hasher,w=p.algo,z=[],x=w.SHA1=v.extend({_doReset:function(){this._hash=new u.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(a,b){for(var c=this._hash.words,d=c[0],e=c[1],f=c[2],h=c[3],g=c[4],i=0;i<80;i++){if(i<16)z[i]=0|a[b+i];else{var k=z[i-3]^z[i-8]^z[i-14]^z[i-16];z[i]=k<<1|k>>>31}var m=(d<<5|d>>>27)+g+z[i];m+=i<20?(e&f|~e&h)+1518500249:i<40?(e^f^h)+1859775393:i<60?(e&f|e&h|f&h)-1894007588:(e^f^h)-899497514,g=h,h=f,f=e<<30|e>>>2,e=d,d=m}c[0]=c[0]+d|0,c[1]=c[1]+e|0,c[2]=c[2]+f|0,c[3]=c[3]+h|0,c[4]=c[4]+g|0},_doFinalize:function(){var a=this._data,b=a.words,c=8*this._nDataBytes,d=8*a.sigBytes;return b[d>>>5]|=128<<24-d%32,b[(d+64>>>9<<4)+14]=Math.floor(c/4294967296),b[(d+64>>>9<<4)+15]=c,a.sigBytes=4*b.length,this._process(),this._hash},clone:function(){var a=v.clone.call(this);return a._hash=this._hash.clone(),a}});p.SHA1=v._createHelper(x),p.HmacSHA1=v._createHmacHelper(x)}(),function(j){var l=B,o=l.lib,q=o.WordArray,H=o.Hasher,C=l.algo,D=[],E=[];!function(){function d(a){for(var b=j.sqrt(a),c=2;c<=b;c++)if(!(a%c))return!1;return!0}function e(a){return 4294967296*(a-(0|a))|0}for(var f=2,h=0;h<64;)d(f)&&(h<8&&(D[h]=e(j.pow(f,.5))),E[h]=e(j.pow(f,1/3)),h++),f++}();var A=[],I=C.SHA256=H.extend({_doReset:function(){this._hash=new q.init(D.slice(0))},_doProcessBlock:function(a,b){for(var c=this._hash.words,d=c[0],e=c[1],f=c[2],h=c[3],g=c[4],i=c[5],k=c[6],m=c[7],p=0;p<64;p++){if(p<16)A[p]=0|a[b+p];else{var r=A[p-15],u=(r<<25|r>>>7)^(r<<14|r>>>18)^r>>>3,v=A[p-2],w=(v<<15|v>>>17)^(v<<13|v>>>19)^v>>>10;A[p]=u+A[p-7]+w+A[p-16]}var z=g&i^~g&k,x=d&e^d&f^e&f,y=(d<<30|d>>>2)^(d<<19|d>>>13)^(d<<10|d>>>22),n=(g<<26|g>>>6)^(g<<21|g>>>11)^(g<<7|g>>>25),F=m+n+z+E[p]+A[p],G=y+x;m=k,k=i,i=g,g=h+F|0,h=f,f=e,e=d,d=F+G|0}c[0]=c[0]+d|0,c[1]=c[1]+e|0,c[2]=c[2]+f|0,c[3]=c[3]+h|0,c[4]=c[4]+g|0,c[5]=c[5]+i|0,c[6]=c[6]+k|0,c[7]=c[7]+m|0},_doFinalize:function(){var a=this._data,b=a.words,c=8*this._nDataBytes,d=8*a.sigBytes;return b[d>>>5]|=128<<24-d%32,b[(d+64>>>9<<4)+14]=j.floor(c/4294967296),b[(d+64>>>9<<4)+15]=c,a.sigBytes=4*b.length,this._process(),this._hash},clone:function(){var a=H.clone.call(this);return a._hash=this._hash.clone(),a}});l.SHA256=H._createHelper(I),l.HmacSHA256=H._createHmacHelper(I)}(Math),function(){function h(a){return a<<8&4278255360|a>>>8&16711935}var g=B,i=g.lib,k=i.WordArray,m=g.enc;m.Utf16=m.Utf16BE={stringify:function(a){for(var b=a.words,c=a.sigBytes,d=[],e=0;e<c;e+=2){var f=b[e>>>2]>>>16-e%4*8&65535;d.push(String.fromCharCode(f))}return d.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>1]|=a.charCodeAt(d)<<16-d%2*16;return k.create(c,2*b)}};m.Utf16LE={stringify:function(a){for(var b=a.words,c=a.sigBytes,d=[],e=0;e<c;e+=2){var f=h(b[e>>>2]>>>16-e%4*8&65535);d.push(String.fromCharCode(f))}return d.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>1]|=h(a.charCodeAt(d)<<16-d%2*16);return k.create(c,2*b)}}}(),function(){if("function"==typeof ArrayBuffer){var e=B,f=e.lib,h=f.WordArray,g=h.init,i=h.init=function(a){if(a instanceof ArrayBuffer&&(a=new Uint8Array(a)),(a instanceof Int8Array||"undefined"!=typeof Uint8ClampedArray&&a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)&&(a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength)),a instanceof Uint8Array){for(var b=a.byteLength,c=[],d=0;d<b;d++)c[d>>>2]|=a[d]<<24-d%4*8;g.call(this,c,b)}else g.apply(this,arguments)};i.prototype=h}}(),function(l){function o(a,b,c){return a^b^c}function q(a,b,c){return a&b|~a&c}function H(a,b,c){return(a|~b)^c}function C(a,b,c){return a&c|b&~c}function D(a,b,c){return a^(b|~c)}function E(a,b){return a<<b|a>>>32-b}var A=B,I=A.lib,J=I.WordArray,L=I.Hasher,N=A.algo,K=J.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),s=J.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),P=J.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),S=J.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),U=J.create([0,1518500249,1859775393,2400959708,2840853838]),M=J.create([1352829926,1548603684,1836072691,2053994217,0]),V=N.RIPEMD160=L.extend({_doReset:function(){this._hash=J.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(a,b){for(var c=0;c<16;c++){var d=b+c,e=a[d];a[d]=16711935&(e<<8|e>>>24)|4278255360&(e<<24|e>>>8)}var f,h,g,i,k,m,p,r,u,v,w=this._hash.words,z=U.words,x=M.words,y=K.words,n=s.words,F=P.words,G=S.words;m=f=w[0],p=h=w[1],r=g=w[2],u=i=w[3],v=k=w[4];for(var j,c=0;c<80;c+=1)j=f+a[b+y[c]]|0,j+=c<16?o(h,g,i)+z[0]:c<32?q(h,g,i)+z[1]:c<48?H(h,g,i)+z[2]:c<64?C(h,g,i)+z[3]:D(h,g,i)+z[4],j|=0,j=E(j,F[c]),j=j+k|0,f=k,k=i,i=E(g,10),g=h,h=j,j=m+a[b+n[c]]|0,j+=c<16?D(p,r,u)+x[0]:c<32?C(p,r,u)+x[1]:c<48?H(p,r,u)+x[2]:c<64?q(p,r,u)+x[3]:o(p,r,u)+x[4],j|=0,j=E(j,G[c]),j=j+v|0,m=v,v=u,u=E(r,10),r=p,p=j;j=w[1]+g+u|0,w[1]=w[2]+i+v|0,w[2]=w[3]+k+m|0,w[3]=w[4]+f+p|0,w[4]=w[0]+h+r|0,w[0]=j},_doFinalize:function(){var a=this._data,b=a.words,c=8*this._nDataBytes,d=8*a.sigBytes;b[d>>>5]|=128<<24-d%32,b[(d+64>>>9<<4)+14]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),a.sigBytes=4*(b.length+1),this._process();for(var e=this._hash,f=e.words,h=0;h<5;h++){var g=f[h];f[h]=16711935&(g<<8|g>>>24)|4278255360&(g<<24|g>>>8)}return e},clone:function(){var a=L.clone.call(this);return a._hash=this._hash.clone(),a}});A.RIPEMD160=L._createHelper(V),A.HmacRIPEMD160=L._createHmacHelper(V)}(Math),function(){var k=B,m=k.lib,p=m.Base,r=k.enc,u=r.Utf8,v=k.algo;v.HMAC=p.extend({init:function(a,b){a=this._hasher=new a.init,"string"==typeof b&&(b=u.parse(b));var c=a.blockSize,d=4*c;b.sigBytes>d&&(b=a.finalize(b)),b.clamp();for(var e=this._oKey=b.clone(),f=this._iKey=b.clone(),h=e.words,g=f.words,i=0;i<c;i++)h[i]^=1549556828,g[i]^=909522486;e.sigBytes=f.sigBytes=d,this.reset()},reset:function(){var a=this._hasher;a.reset(),a.update(this._iKey)},update:function(a){return this._hasher.update(a),this},finalize:function(a){var b=this._hasher,c=b.finalize(a);b.reset();var d=b.finalize(this._oKey.clone().concat(c));return d}})}(),function(){var x=B,y=x.lib,n=y.Base,F=y.WordArray,G=x.algo,j=G.SHA1,l=G.HMAC,o=G.PBKDF2=n.extend({cfg:n.extend({keySize:4,hasher:j,iterations:1}),init:function(a){this.cfg=this.cfg.extend(a)},compute:function(a,b){for(var c=this.cfg,d=l.create(c.hasher,a),e=F.create(),f=F.create([1]),h=e.words,g=f.words,i=c.keySize,k=c.iterations;h.length<i;){var m=d.update(b).finalize(f);d.reset();for(var p=m.words,r=p.length,u=m,v=1;v<k;v++){u=d.finalize(u),d.reset();for(var w=u.words,z=0;z<r;z++)p[z]^=w[z]}e.concat(m),g[0]++}return e.sigBytes=4*i,e}});x.PBKDF2=function(a,b,c){return o.create(c).compute(a,b)}}(),function(){var m=B,p=m.lib,r=p.Base,u=p.WordArray,v=m.algo,w=v.MD5,z=v.EvpKDF=r.extend({cfg:r.extend({keySize:4,hasher:w,iterations:1}),init:function(a){this.cfg=this.cfg.extend(a)},compute:function(a,b){for(var c=this.cfg,d=c.hasher.create(),e=u.create(),f=e.words,h=c.keySize,g=c.iterations;f.length<h;){i&&d.update(i);var i=d.update(a).finalize(b);d.reset();for(var k=1;k<g;k++)i=d.finalize(i),d.reset();e.concat(i)}return e.sigBytes=4*h,e}});m.EvpKDF=function(a,b,c){return z.create(c).compute(a,b)}}(),function(){var b=B,c=b.lib,d=c.WordArray,e=b.algo,f=e.SHA256,h=e.SHA224=f.extend({_doReset:function(){this._hash=new d.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var a=f._doFinalize.call(this);return a.sigBytes-=4,a}});b.SHA224=f._createHelper(h),b.HmacSHA224=f._createHmacHelper(h)}(),function(f){var h=B,g=h.lib,i=g.Base,k=g.WordArray,m=h.x64={};m.Word=i.extend({init:function(a,b){this.high=a,this.low=b}}),m.WordArray=i.extend({init:function(a,b){a=this.words=a||[],b!=f?this.sigBytes=b:this.sigBytes=8*a.length},toX32:function(){for(var a=this.words,b=a.length,c=[],d=0;d<b;d++){var e=a[d];c.push(e.high),c.push(e.low)}return k.create(c,this.sigBytes)},clone:function(){for(var a=i.clone.call(this),b=a.words=this.words.slice(0),c=b.length,d=0;d<c;d++)b[d]=b[d].clone();return a}})}(),function(E){var A=B,I=A.lib,J=I.WordArray,L=I.Hasher,N=A.x64,K=N.Word,s=A.algo,P=[],S=[],U=[];!function(){for(var a=1,b=0,c=0;c<24;c++){P[a+5*b]=(c+1)*(c+2)/2%64;var d=b%5,e=(2*a+3*b)%5;a=d,b=e}for(var a=0;a<5;a++)for(var b=0;b<5;b++)S[a+5*b]=b+(2*a+3*b)%5*5;for(var f=1,h=0;h<24;h++){for(var g=0,i=0,k=0;k<7;k++){if(1&f){var m=(1<<k)-1;m<32?i^=1<<m:g^=1<<m-32}128&f?f=f<<1^113:f<<=1}U[h]=K.create(g,i)}}();var M=[];!function(){for(var a=0;a<25;a++)M[a]=K.create()}();var V=s.SHA3=L.extend({cfg:L.cfg.extend({outputLength:512}),_doReset:function(){for(var a=this._state=[],b=0;b<25;b++)a[b]=new K.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(a,b){for(var c=this._state,d=this.blockSize/2,e=0;e<d;e++){var f=a[b+2*e],h=a[b+2*e+1];f=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8),h=16711935&(h<<8|h>>>24)|4278255360&(h<<24|h>>>8);var g=c[e];g.high^=h,g.low^=f}for(var i=0;i<24;i++){for(var k=0;k<5;k++){for(var m=0,p=0,r=0;r<5;r++){var g=c[k+5*r];m^=g.high,p^=g.low}var u=M[k];u.high=m,u.low=p}for(var k=0;k<5;k++)for(var v=M[(k+4)%5],w=M[(k+1)%5],z=w.high,x=w.low,m=v.high^(z<<1|x>>>31),p=v.low^(x<<1|z>>>31),r=0;r<5;r++){var g=c[k+5*r];g.high^=m,g.low^=p}for(var y=1;y<25;y++){var g=c[y],n=g.high,F=g.low,G=P[y];if(G<32)var m=n<<G|F>>>32-G,p=F<<G|n>>>32-G;else var m=F<<G-32|n>>>64-G,p=n<<G-32|F>>>64-G;var j=M[S[y]];j.high=m,j.low=p}var l=M[0],o=c[0];l.high=o.high,l.low=o.low;for(var k=0;k<5;k++)for(var r=0;r<5;r++){var y=k+5*r,g=c[y],q=M[y],H=M[(k+1)%5+5*r],C=M[(k+2)%5+5*r];g.high=q.high^~H.high&C.high,g.low=q.low^~H.low&C.low}var g=c[0],D=U[i];g.high^=D.high,g.low^=D.low}},_doFinalize:function(){var a=this._data,b=a.words,c=(8*this._nDataBytes,8*a.sigBytes),d=32*this.blockSize;b[c>>>5]|=1<<24-c%32,b[(E.ceil((c+1)/d)*d>>>5)-1]|=128,a.sigBytes=4*b.length,this._process();for(var e=this._state,f=this.cfg.outputLength/8,h=f/8,g=[],i=0;i<h;i++){var k=e[i],m=k.high,p=k.low;m=16711935&(m<<8|m>>>24)|4278255360&(m<<24|m>>>8),p=16711935&(p<<8|p>>>24)|4278255360&(p<<24|p>>>8),g.push(p),g.push(m)}return new J.init(g,f)},clone:function(){for(var a=L.clone.call(this),b=a._state=this._state.slice(0),c=0;c<25;c++)b[c]=b[c].clone();return a}});A.SHA3=L._createHelper(V),A.HmacSHA3=L._createHmacHelper(V)}(Math),function(){function t(){return T.create.apply(T,arguments)}var bb=B,bu=bb.lib,bf=bu.Hasher,bh=bb.x64,T=bh.Word,bv=bh.WordArray,bw=bb.algo,bx=[t(1116352408,3609767458),t(1899447441,602891725),t(3049323471,3964484399),t(3921009573,2173295548),t(961987163,4081628472),t(1508970993,3053834265),t(2453635748,2937671579),t(2870763221,3664609560),t(3624381080,2734883394),t(310598401,1164996542),t(607225278,1323610764),t(1426881987,3590304994),t(1925078388,4068182383),t(2162078206,991336113),t(2614888103,633803317),t(3248222580,3479774868),t(3835390401,2666613458),t(4022224774,944711139),t(264347078,2341262773),t(604807628,2007800933),t(770255983,1495990901),t(1249150122,1856431235),t(1555081692,3175218132),t(1996064986,2198950837),t(2554220882,3999719339),t(2821834349,766784016),t(2952996808,2566594879),t(3210313671,3203337956),t(3336571891,1034457026),t(3584528711,2466948901),t(113926993,3758326383),t(338241895,168717936),t(666307205,1188179964),t(773529912,1546045734),t(1294757372,1522805485),t(1396182291,2643833823),t(1695183700,2343527390),t(1986661051,1014477480),t(2177026350,1206759142),t(2456956037,344077627),t(2730485921,1290863460),t(2820302411,3158454273),t(3259730800,3505952657),t(3345764771,106217008),t(3516065817,3606008344),t(3600352804,1432725776),t(4094571909,1467031594),t(275423344,851169720),t(430227734,3100823752),t(506948616,1363258195),t(659060556,3750685593),t(883997877,3785050280),t(958139571,3318307427),t(1322822218,3812723403),t(1537002063,2003034995),t(1747873779,3602036899),t(1955562222,1575990012),t(2024104815,1125592928),t(2227730452,2716904306),t(2361852424,442776044),t(2428436474,593698344),t(2756734187,3733110249),t(3204031479,2999351573),t(3329325298,3815920427),t(3391569614,3928383900),t(3515267271,566280711),t(3940187606,3454069534),t(4118630271,4000239992),t(116418474,1914138554),t(174292421,2731055270),t(289380356,3203993006),t(460393269,320620315),t(685471733,587496836),t(852142971,1086792851),t(1017036298,365543100),t(1126000580,2618297676),t(1288033470,3409855158),t(1501505948,4234509866),t(1607167915,987167468),t(1816402316,1246189591)],Y=[];!function(){for(var a=0;a<80;a++)Y[a]=t()}();var bi=bw.SHA512=bf.extend({_doReset:function(){this._hash=new bv.init([new T.init(1779033703,4089235720),new T.init(3144134277,2227873595),new T.init(1013904242,4271175723),new T.init(2773480762,1595750129),new T.init(1359893119,2917565137),new T.init(2600822924,725511199),new T.init(528734635,4215389547),new T.init(1541459225,327033209)])},_doProcessBlock:function(a,b){for(var c=this._hash.words,d=c[0],e=c[1],f=c[2],h=c[3],g=c[4],i=c[5],k=c[6],m=c[7],p=d.high,r=d.low,u=e.high,v=e.low,w=f.high,z=f.low,x=h.high,y=h.low,n=g.high,F=g.low,G=i.high,j=i.low,l=k.high,o=k.low,q=m.high,H=m.low,C=p,D=r,E=u,A=v,I=w,J=z,L=x,N=y,K=n,s=F,P=G,S=j,U=l,M=o,V=q,bc=H,Q=0;Q<80;Q++){var bg=Y[Q];if(Q<16)var X=bg.high=0|a[b+2*Q],R=bg.low=0|a[b+2*Q+1];else{var bj=Y[Q-15],Z=bj.high,bd=bj.low,by=(Z>>>1|bd<<31)^(Z>>>8|bd<<24)^Z>>>7,bk=(bd>>>1|Z<<31)^(bd>>>8|Z<<24)^(bd>>>7|Z<<25),bl=Y[Q-2],ba=bl.high,be=bl.low,bz=(ba>>>19|be<<13)^(ba<<3|be>>>29)^ba>>>6,bm=(be>>>19|ba<<13)^(be<<3|ba>>>29)^(be>>>6|ba<<26),bn=Y[Q-7],bA=bn.high,bB=bn.low,bo=Y[Q-16],bC=bo.high,bp=bo.low,R=bk+bB,X=by+bA+(R>>>0<bk>>>0?1:0),R=R+bm,X=X+bz+(R>>>0<bm>>>0?1:0),R=R+bp,X=X+bC+(R>>>0<bp>>>0?1:0);bg.high=X,bg.low=R}var bD=K&P^~K&U,ut=s&S^~s&M,bE=C&E^C&I^E&I,bF=D&A^D&J^A&J,bG=(C>>>28|D<<4)^(C<<30|D>>>2)^(C<<25|D>>>7),bq=(D>>>28|C<<4)^(D<<30|C>>>2)^(D<<25|C>>>7),bH=(K>>>14|s<<18)^(K>>>18|s<<14)^(K<<23|s>>>9),bI=(s>>>14|K<<18)^(s>>>18|K<<14)^(s<<23|K>>>9),br=bx[Q],bJ=br.high,bs=br.low,O=bc+bI,W=V+bH+(O>>>0<bc>>>0?1:0),O=O+ut,W=W+bD+(O>>>0<ut>>>0?1:0),O=O+bs,W=W+bJ+(O>>>0<bs>>>0?1:0),O=O+R,W=W+X+(O>>>0<R>>>0?1:0),bt=bq+bF,bK=bG+bE+(bt>>>0<bq>>>0?1:0);V=U,bc=M,U=P,M=S,P=K,S=s,s=N+O|0,K=L+W+(s>>>0<N>>>0?1:0)|0,L=I,N=J,I=E,J=A,E=C,A=D,D=O+bt|0,C=W+bK+(D>>>0<O>>>0?1:0)|0}r=d.low=r+D,d.high=p+C+(r>>>0<D>>>0?1:0),v=e.low=v+A,e.high=u+E+(v>>>0<A>>>0?1:0),z=f.low=z+J,f.high=w+I+(z>>>0<J>>>0?1:0),y=h.low=y+N,h.high=x+L+(y>>>0<N>>>0?1:0),F=g.low=F+s,g.high=n+K+(F>>>0<s>>>0?1:0),j=i.low=j+S,i.high=G+P+(j>>>0<S>>>0?1:0),o=k.low=o+M,k.high=l+U+(o>>>0<M>>>0?1:0),H=m.low=H+bc,m.high=q+V+(H>>>0<bc>>>0?1:0)},_doFinalize:function(){var a=this._data,b=a.words,c=8*this._nDataBytes,d=8*a.sigBytes;b[d>>>5]|=128<<24-d%32,b[(d+128>>>10<<5)+30]=Math.floor(c/4294967296),b[(d+128>>>10<<5)+31]=c,a.sigBytes=4*b.length,this._process();var e=this._hash.toX32();return e},clone:function(){var a=bf.clone.call(this);return a._hash=this._hash.clone(),a},blockSize:32});bb.SHA512=bf._createHelper(bi),bb.HmacSHA512=bf._createHmacHelper(bi)}(),function(){var b=B,c=b.x64,d=c.Word,e=c.WordArray,f=b.algo,h=f.SHA512,g=f.SHA384=h.extend({_doReset:function(){this._hash=new e.init([new d.init(3418070365,3238371032),new d.init(1654270250,914150663),new d.init(2438529370,812702999),new d.init(355462360,4144912697),new d.init(1731405415,4290775857),new d.init(2394180231,1750603025),new d.init(3675008525,1694076839),new d.init(1203062813,3204075428)])},_doFinalize:function(){var a=h._doFinalize.call(this);return a.sigBytes-=16,a}});b.SHA384=h._createHelper(g),b.HmacSHA384=h._createHmacHelper(g)}(),B.lib.Cipher||function(i){var k=B,m=k.lib,p=m.Base,r=m.WordArray,u=m.BufferedBlockAlgorithm,v=k.enc,w=(v.Utf8,v.Base64),z=k.algo,x=z.EvpKDF,y=m.Cipher=u.extend({cfg:p.extend(),createEncryptor:function(a,b){return this.create(this._ENC_XFORM_MODE,a,b)},createDecryptor:function(a,b){return this.create(this._DEC_XFORM_MODE,a,b)},init:function(a,b,c){this.cfg=this.cfg.extend(c),this._xformMode=a,this._key=b,this.reset()},reset:function(){u.reset.call(this),this._doReset()},process:function(a){return this._append(a),this._process()},finalize:function(a){a&&this._append(a);var b=this._doFinalize();return b},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function e(a){return"string"==typeof a?A:C}return function(d){return{encrypt:function(a,b,c){return e(b).encrypt(d,a,b,c)},decrypt:function(a,b,c){return e(b).decrypt(d,a,b,c)}}}}()}),n=(m.StreamCipher=y.extend({_doFinalize:function(){var a=this._process(!0);return a},blockSize:1}),k.mode={}),F=m.BlockCipherMode=p.extend({createEncryptor:function(a,b){return this.Encryptor.create(a,b)},createDecryptor:function(a,b){return this.Decryptor.create(a,b)},init:function(a,b){this._cipher=a,this._iv=b}}),G=n.CBC=function(){function h(a,b,c){var d=this._iv;if(d){var e=d;this._iv=i}else var e=this._prevBlock;for(var f=0;f<c;f++)a[b+f]^=e[f]}var g=F.extend();return g.Encryptor=g.extend({processBlock:function(a,b){var c=this._cipher,d=c.blockSize;h.call(this,a,b,d),c.encryptBlock(a,b),this._prevBlock=a.slice(b,b+d)}}),g.Decryptor=g.extend({processBlock:function(a,b){var c=this._cipher,d=c.blockSize,e=a.slice(b,b+d);c.decryptBlock(a,b),h.call(this,a,b,d),this._prevBlock=e}}),g}(),j=k.pad={},l=j.Pkcs7={pad:function(a,b){for(var c=4*b,d=c-a.sigBytes%c,e=d<<24|d<<16|d<<8|d,f=[],h=0;h<d;h+=4)f.push(e);var g=r.create(f,d);a.concat(g)},unpad:function(a){var b=255&a.words[a.sigBytes-1>>>2];a.sigBytes-=b}},o=(m.BlockCipher=y.extend({cfg:y.cfg.extend({mode:G,padding:l}),reset:function(){y.reset.call(this);var a=this.cfg,b=a.iv,c=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var d=c.createEncryptor;else{var d=c.createDecryptor;this._minBufferSize=1}this._mode&&this._mode.__creator==d?this._mode.init(this,b&&b.words):(this._mode=d.call(c,this,b&&b.words),this._mode.__creator=d)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else{var b=this._process(!0);a.unpad(b)}return b},blockSize:4}),m.CipherParams=p.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}})),q=k.format={},H=q.OpenSSL={stringify:function(a){var b=a.ciphertext,c=a.salt;if(c)var d=r.create([1398893684,1701076831]).concat(c).concat(b);else var d=b;return d.toString(w)},parse:function(a){var b=w.parse(a),c=b.words;if(1398893684==c[0]&&1701076831==c[1]){var d=r.create(c.slice(2,4));c.splice(0,4),b.sigBytes-=16}return o.create({ciphertext:b,salt:d})}},C=m.SerializableCipher=p.extend({cfg:p.extend({format:H}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var e=a.createEncryptor(c,d),f=e.finalize(b),h=e.cfg;return o.create({ciphertext:f,key:c,iv:h.iv,algorithm:a,mode:h.mode,padding:h.padding,blockSize:a.blockSize,formatter:d.format})},decrypt:function(a,b,c,d){d=this.cfg.extend(d),b=this._parse(b,d.format);var e=a.createDecryptor(c,d).finalize(b.ciphertext);return e},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),D=k.kdf={},E=D.OpenSSL={execute:function(a,b,c,d){d||(d=r.random(8));var e=x.create({keySize:b+c}).compute(a,d),f=r.create(e.words.slice(b),4*c);return e.sigBytes=4*b,o.create({key:e,iv:f,salt:d})}},A=m.PasswordBasedCipher=C.extend({cfg:C.cfg.extend({kdf:E}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var e=d.kdf.execute(c,a.keySize,a.ivSize);d.iv=e.iv;var f=C.encrypt.call(this,a,b,e.key,d);return f.mixIn(e),f},decrypt:function(a,b,c,d){d=this.cfg.extend(d),b=this._parse(b,d.format);var e=d.kdf.execute(c,a.keySize,a.ivSize,b.salt);d.iv=e.iv;var f=C.decrypt.call(this,a,b,e.key,d);return f}})}(),B.mode.CFB=function(){function g(a,b,c,d){var e=this._iv;if(e){var f=e.slice(0);this._iv=void 0}else var f=this._prevBlock;d.encryptBlock(f,0);for(var h=0;h<c;h++)a[b+h]^=f[h]}var i=B.lib.BlockCipherMode.extend();return i.Encryptor=i.extend({processBlock:function(a,b){var c=this._cipher,d=c.blockSize;g.call(this,a,b,d,c),this._prevBlock=a.slice(b,b+d)}}),i.Decryptor=i.extend({processBlock:function(a,b){var c=this._cipher,d=c.blockSize,e=a.slice(b,b+d);g.call(this,a,b,d,c),this._prevBlock=e}}),i}(),B.mode.ECB=function(){var c=B.lib.BlockCipherMode.extend();return c.Encryptor=c.extend({processBlock:function(a,b){this._cipher.encryptBlock(a,b)}}),c.Decryptor=c.extend({processBlock:function(a,b){this._cipher.decryptBlock(a,b)}}),c}(),B.pad.AnsiX923={pad:function(a,b){var c=a.sigBytes,d=4*b,e=d-c%d,f=c+e-1;a.clamp(),a.words[f>>>2]|=e<<24-f%4*8,a.sigBytes+=e},unpad:function(a){var b=255&a.words[a.sigBytes-1>>>2];a.sigBytes-=b}},B.pad.Iso10126={pad:function(a,b){var c=4*b,d=c-a.sigBytes%c;a.concat(B.lib.WordArray.random(d-1)).concat(B.lib.WordArray.create([d<<24],1))},unpad:function(a){var b=255&a.words[a.sigBytes-1>>>2];a.sigBytes-=b}},B.pad.Iso97971={pad:function(a,b){a.concat(B.lib.WordArray.create([2147483648],1)),B.pad.ZeroPadding.pad(a,b)},unpad:function(a){B.pad.ZeroPadding.unpad(a),a.sigBytes--}},B.mode.OFB=function(){var g=B.lib.BlockCipherMode.extend(),i=g.Encryptor=g.extend({processBlock:function(a,b){var c=this._cipher,d=c.blockSize,e=this._iv,f=this._keystream;e&&(f=this._keystream=e.slice(0),this._iv=void 0),c.encryptBlock(f,0);for(var h=0;h<d;h++)a[b+h]^=f[h]}});return g.Decryptor=i,g}(),B.pad.NoPadding={pad:function(){},unpad:function(){}},function(c){var d=B,e=d.lib,f=e.CipherParams,h=d.enc,g=h.Hex,i=d.format;i.Hex={stringify:function(a){return a.ciphertext.toString(g)},parse:function(a){var b=g.parse(a);return f.create({ciphertext:b})}}}(),function(){var n=B,F=n.lib,G=F.BlockCipher,j=n.algo,l=[],o=[],q=[],H=[],C=[],D=[],E=[],A=[],I=[],J=[];!function(){for(var a=[],b=0;b<256;b++)b<128?a[b]=b<<1:a[b]=b<<1^283;for(var c=0,d=0,b=0;b<256;b++){var e=d^d<<1^d<<2^d<<3^d<<4;e=e>>>8^255&e^99,l[c]=e,o[e]=c;var f=a[c],h=a[f],g=a[h],i=257*a[e]^16843008*e;q[c]=i<<24|i>>>8,H[c]=i<<16|i>>>16,C[c]=i<<8|i>>>24,D[c]=i;var i=16843009*g^65537*h^257*f^16843008*c;E[e]=i<<24|i>>>8,A[e]=i<<16|i>>>16,I[e]=i<<8|i>>>24,J[e]=i,c?(c=f^a[a[a[g^f]]],d^=a[a[d]]):c=d=1}}();var L=[0,1,2,4,8,16,32,64,128,27,54],N=j.AES=G.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var a=this._keyPriorReset=this._key,b=a.words,c=a.sigBytes/4,d=this._nRounds=c+6,e=4*(d+1),f=this._keySchedule=[],h=0;h<e;h++)if(h<c)f[h]=b[h];else{var g=f[h-1];h%c?c>6&&h%c==4&&(g=l[g>>>24]<<24|l[g>>>16&255]<<16|l[g>>>8&255]<<8|l[255&g]):(g=g<<8|g>>>24,g=l[g>>>24]<<24|l[g>>>16&255]<<16|l[g>>>8&255]<<8|l[255&g],g^=L[h/c|0]<<24),f[h]=f[h-c]^g}for(var i=this._invKeySchedule=[],k=0;k<e;k++){var h=e-k;if(k%4)var g=f[h];else var g=f[h-4];k<4||h<=4?i[k]=g:i[k]=E[l[g>>>24]]^A[l[g>>>16&255]]^I[l[g>>>8&255]]^J[l[255&g]]}}},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,q,H,C,D,l)},decryptBlock:function(a,b){var c=a[b+1];a[b+1]=a[b+3],a[b+3]=c,this._doCryptBlock(a,b,this._invKeySchedule,E,A,I,J,o);var c=a[b+1];a[b+1]=a[b+3],a[b+3]=c},_doCryptBlock:function(a,b,c,d,e,f,h,g){for(var i=this._nRounds,k=a[b]^c[0],m=a[b+1]^c[1],p=a[b+2]^c[2],r=a[b+3]^c[3],u=4,v=1;v<i;v++){var w=d[k>>>24]^e[m>>>16&255]^f[p>>>8&255]^h[255&r]^c[u++],z=d[m>>>24]^e[p>>>16&255]^f[r>>>8&255]^h[255&k]^c[u++],x=d[p>>>24]^e[r>>>16&255]^f[k>>>8&255]^h[255&m]^c[u++],y=d[r>>>24]^e[k>>>16&255]^f[m>>>8&255]^h[255&p]^c[u++];k=w,m=z,p=x,r=y}var w=(g[k>>>24]<<24|g[m>>>16&255]<<16|g[p>>>8&255]<<8|g[255&r])^c[u++],z=(g[m>>>24]<<24|g[p>>>16&255]<<16|g[r>>>8&255]<<8|g[255&k])^c[u++],x=(g[p>>>24]<<24|g[r>>>16&255]<<16|g[k>>>8&255]<<8|g[255&m])^c[u++],y=(g[r>>>24]<<24|g[k>>>16&255]<<16|g[m>>>8&255]<<8|g[255&p])^c[u++];a[b]=w,a[b+1]=z,a[b+2]=x,a[b+3]=y},keySize:8});n.AES=G._createHelper(N)}(),function(){function m(a,b){var c=(this._lBlock>>>a^this._rBlock)&b;this._rBlock^=c,this._lBlock^=c<<a}function p(a,b){var c=(this._rBlock>>>a^this._lBlock)&b;this._lBlock^=c,this._rBlock^=c<<a}var r=B,u=r.lib,v=u.WordArray,w=u.BlockCipher,z=r.algo,x=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],y=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],n=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],F=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],G=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],j=z.DES=w.extend({_doReset:function(){for(var a=this._key,b=a.words,c=[],d=0;d<56;d++){var e=x[d]-1;c[d]=b[e>>>5]>>>31-e%32&1}for(var f=this._subKeys=[],h=0;h<16;h++){for(var g=f[h]=[],i=n[h],d=0;d<24;d++)g[d/6|0]|=c[(y[d]-1+i)%28]<<31-d%6,g[4+(d/6|0)]|=c[28+(y[d+24]-1+i)%28]<<31-d%6;g[0]=g[0]<<1|g[0]>>>31;for(var d=1;d<7;d++)g[d]=g[d]>>>4*(d-1)+3;g[7]=g[7]<<5|g[7]>>>27}for(var k=this._invSubKeys=[],d=0;d<16;d++)k[d]=f[15-d]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._subKeys)},decryptBlock:function(a,b){this._doCryptBlock(a,b,this._invSubKeys)},_doCryptBlock:function(a,b,c){this._lBlock=a[b],this._rBlock=a[b+1],m.call(this,4,252645135),m.call(this,16,65535),p.call(this,2,858993459),p.call(this,8,16711935),m.call(this,1,1431655765);for(var d=0;d<16;d++){for(var e=c[d],f=this._lBlock,h=this._rBlock,g=0,i=0;i<8;i++)g|=F[i][((h^e[i])&G[i])>>>0];this._lBlock=h,this._rBlock=f^g}var k=this._lBlock;this._lBlock=this._rBlock,this._rBlock=k,m.call(this,1,1431655765),p.call(this,8,16711935),p.call(this,2,858993459),m.call(this,16,65535),m.call(this,4,252645135),a[b]=this._lBlock,a[b+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});r.DES=w._createHelper(j);var l=z.TripleDES=w.extend({_doReset:function(){var a=this._key,b=a.words;this._des1=j.createEncryptor(v.create(b.slice(0,2))),this._des2=j.createEncryptor(v.create(b.slice(2,4))),this._des3=j.createEncryptor(v.create(b.slice(4,6)))},encryptBlock:function(a,b){this._des1.encryptBlock(a,b),this._des2.decryptBlock(a,b),this._des3.encryptBlock(a,b)},decryptBlock:function(a,b){this._des3.decryptBlock(a,b),this._des2.encryptBlock(a,b),this._des1.decryptBlock(a,b)},keySize:6,ivSize:2,blockSize:2});r.TripleDES=w._createHelper(l)}(),function(){function k(){for(var a=this._S,b=this._i,c=this._j,d=0,e=0;e<4;e++){b=(b+1)%256,c=(c+a[b])%256;var f=a[b];a[b]=a[c],a[c]=f,d|=a[(a[b]+a[c])%256]<<24-8*e}return this._i=b,this._j=c,d}var m=B,p=m.lib,r=p.StreamCipher,u=m.algo,v=u.RC4=r.extend({_doReset:function(){for(var a=this._key,b=a.words,c=a.sigBytes,d=this._S=[],e=0;e<256;e++)d[e]=e;for(var e=0,f=0;e<256;e++){var h=e%c,g=b[h>>>2]>>>24-h%4*8&255;f=(f+d[e]+g)%256;var i=d[e];d[e]=d[f],d[f]=i}this._i=this._j=0},_doProcessBlock:function(a,b){a[b]^=k.call(this)},keySize:8,ivSize:0});m.RC4=r._createHelper(v);var w=u.RC4Drop=v.extend({cfg:v.cfg.extend({drop:192}),_doReset:function(){v._doReset.call(this);for(var a=this.cfg.drop;a>0;a--)k.call(this)}});m.RC4Drop=r._createHelper(w)}(),B.mode.CTRGladman=function(){function i(a){if(255===(a>>24&255)){var b=a>>16&255,c=a>>8&255,d=255&a;255===b?(b=0,255===c?(c=0,255===d?d=0:++d):++c):++b,a=0,a+=b<<16,a+=c<<8,a+=d}else a+=1<<24;return a}function k(a){return 0===(a[0]=i(a[0]))&&(a[1]=i(a[1])),a}var m=B.lib.BlockCipherMode.extend(),p=m.Encryptor=m.extend({processBlock:function(a,b){var c=this._cipher,d=c.blockSize,e=this._iv,f=this._counter;e&&(f=this._counter=e.slice(0),this._iv=void 0),k(f);var h=f.slice(0);c.encryptBlock(h,0);for(var g=0;g<d;g++)a[b+g]^=h[g]}});return m.Decryptor=p,m}(),function(){function r(){for(var a=this._X,b=this._C,c=0;c<8;c++)y[c]=b[c];b[0]=b[0]+1295307597+this._b|0,b[1]=b[1]+3545052371+(b[0]>>>0<y[0]>>>0?1:0)|0,b[2]=b[2]+886263092+(b[1]>>>0<y[1]>>>0?1:0)|0,b[3]=b[3]+1295307597+(b[2]>>>0<y[2]>>>0?1:0)|0,b[4]=b[4]+3545052371+(b[3]>>>0<y[3]>>>0?1:0)|0,b[5]=b[5]+886263092+(b[4]>>>0<y[4]>>>0?1:0)|0,b[6]=b[6]+1295307597+(b[5]>>>0<y[5]>>>0?1:0)|0,b[7]=b[7]+3545052371+(b[6]>>>0<y[6]>>>0?1:0)|0,this._b=b[7]>>>0<y[7]>>>0?1:0;for(var c=0;c<8;c++){var d=a[c]+b[c],e=65535&d,f=d>>>16,h=((e*e>>>17)+e*f>>>15)+f*f,g=((4294901760&d)*d|0)+((65535&d)*d|0);n[c]=h^g}a[0]=n[0]+(n[7]<<16|n[7]>>>16)+(n[6]<<16|n[6]>>>16)|0,a[1]=n[1]+(n[0]<<8|n[0]>>>24)+n[7]|0,a[2]=n[2]+(n[1]<<16|n[1]>>>16)+(n[0]<<16|n[0]>>>16)|0,a[3]=n[3]+(n[2]<<8|n[2]>>>24)+n[1]|0,a[4]=n[4]+(n[3]<<16|n[3]>>>16)+(n[2]<<16|n[2]>>>16)|0,a[5]=n[5]+(n[4]<<8|n[4]>>>24)+n[3]|0,a[6]=n[6]+(n[5]<<16|n[5]>>>16)+(n[4]<<16|n[4]>>>16)|0,a[7]=n[7]+(n[6]<<8|n[6]>>>24)+n[5]|0}var u=B,v=u.lib,w=v.StreamCipher,z=u.algo,x=[],y=[],n=[],F=z.Rabbit=w.extend({_doReset:function(){for(var a=this._key.words,b=this.cfg.iv,c=0;c<4;c++)a[c]=16711935&(a[c]<<8|a[c]>>>24)|4278255360&(a[c]<<24|a[c]>>>8);var d=this._X=[a[0],a[3]<<16|a[2]>>>16,a[1],a[0]<<16|a[3]>>>16,a[2],a[1]<<16|a[0]>>>16,a[3],a[2]<<16|a[1]>>>16],e=this._C=[a[2]<<16|a[2]>>>16,4294901760&a[0]|65535&a[1],a[3]<<16|a[3]>>>16,4294901760&a[1]|65535&a[2],a[0]<<16|a[0]>>>16,4294901760&a[2]|65535&a[3],a[1]<<16|a[1]>>>16,4294901760&a[3]|65535&a[0]];this._b=0;for(var c=0;c<4;c++)r.call(this);for(var c=0;c<8;c++)e[c]^=d[c+4&7];if(b){var f=b.words,h=f[0],g=f[1],i=16711935&(h<<8|h>>>24)|4278255360&(h<<24|h>>>8),k=16711935&(g<<8|g>>>24)|4278255360&(g<<24|g>>>8),m=i>>>16|4294901760&k,p=k<<16|65535&i;e[0]^=i,e[1]^=m,e[2]^=k,e[3]^=p,e[4]^=i,e[5]^=m,e[6]^=k,e[7]^=p;for(var c=0;c<4;c++)r.call(this)}},_doProcessBlock:function(a,b){var c=this._X;r.call(this),x[0]=c[0]^c[5]>>>16^c[3]<<16,x[1]=c[2]^c[7]>>>16^c[5]<<16,x[2]=c[4]^c[1]>>>16^c[7]<<16,x[3]=c[6]^c[3]>>>16^c[1]<<16;for(var d=0;d<4;d++)x[d]=16711935&(x[d]<<8|x[d]>>>24)|4278255360&(x[d]<<24|x[d]>>>8),a[b+d]^=x[d]},blockSize:4,ivSize:2});u.Rabbit=w._createHelper(F)}(),B.mode.CTR=function(){var i=B.lib.BlockCipherMode.extend(),k=i.Encryptor=i.extend({processBlock:function(a,b){var c=this._cipher,d=c.blockSize,e=this._iv,f=this._counter;e&&(f=this._counter=e.slice(0),this._iv=void 0);var h=f.slice(0);c.encryptBlock(h,0),f[d-1]=f[d-1]+1|0;for(var g=0;g<d;g++)a[b+g]^=h[g]}});return i.Decryptor=k,i}(),function(){function r(){for(var a=this._X,b=this._C,c=0;c<8;c++)y[c]=b[c];b[0]=b[0]+1295307597+this._b|0,b[1]=b[1]+3545052371+(b[0]>>>0<y[0]>>>0?1:0)|0,b[2]=b[2]+886263092+(b[1]>>>0<y[1]>>>0?1:0)|0,b[3]=b[3]+1295307597+(b[2]>>>0<y[2]>>>0?1:0)|0,b[4]=b[4]+3545052371+(b[3]>>>0<y[3]>>>0?1:0)|0,b[5]=b[5]+886263092+(b[4]>>>0<y[4]>>>0?1:0)|0,b[6]=b[6]+1295307597+(b[5]>>>0<y[5]>>>0?1:0)|0,b[7]=b[7]+3545052371+(b[6]>>>0<y[6]>>>0?1:0)|0,this._b=b[7]>>>0<y[7]>>>0?1:0;for(var c=0;c<8;c++){var d=a[c]+b[c],e=65535&d,f=d>>>16,h=((e*e>>>17)+e*f>>>15)+f*f,g=((4294901760&d)*d|0)+((65535&d)*d|0);n[c]=h^g}a[0]=n[0]+(n[7]<<16|n[7]>>>16)+(n[6]<<16|n[6]>>>16)|0,a[1]=n[1]+(n[0]<<8|n[0]>>>24)+n[7]|0,a[2]=n[2]+(n[1]<<16|n[1]>>>16)+(n[0]<<16|n[0]>>>16)|0,a[3]=n[3]+(n[2]<<8|n[2]>>>24)+n[1]|0,a[4]=n[4]+(n[3]<<16|n[3]>>>16)+(n[2]<<16|n[2]>>>16)|0,a[5]=n[5]+(n[4]<<8|n[4]>>>24)+n[3]|0,a[6]=n[6]+(n[5]<<16|n[5]>>>16)+(n[4]<<16|n[4]>>>16)|0,a[7]=n[7]+(n[6]<<8|n[6]>>>24)+n[5]|0}var u=B,v=u.lib,w=v.StreamCipher,z=u.algo,x=[],y=[],n=[],F=z.RabbitLegacy=w.extend({_doReset:function(){var a=this._key.words,b=this.cfg.iv,c=this._X=[a[0],a[3]<<16|a[2]>>>16,a[1],a[0]<<16|a[3]>>>16,a[2],a[1]<<16|a[0]>>>16,a[3],a[2]<<16|a[1]>>>16],d=this._C=[a[2]<<16|a[2]>>>16,4294901760&a[0]|65535&a[1],a[3]<<16|a[3]>>>16,4294901760&a[1]|65535&a[2],a[0]<<16|a[0]>>>16,4294901760&a[2]|65535&a[3],a[1]<<16|a[1]>>>16,4294901760&a[3]|65535&a[0]];this._b=0;for(var e=0;e<4;e++)r.call(this);for(var e=0;e<8;e++)d[e]^=c[e+4&7];if(b){var f=b.words,h=f[0],g=f[1],i=16711935&(h<<8|h>>>24)|4278255360&(h<<24|h>>>8),k=16711935&(g<<8|g>>>24)|4278255360&(g<<24|g>>>8),m=i>>>16|4294901760&k,p=k<<16|65535&i;d[0]^=i,d[1]^=m,d[2]^=k,d[3]^=p,d[4]^=i,d[5]^=m,d[6]^=k,d[7]^=p;for(var e=0;e<4;e++)r.call(this)}},_doProcessBlock:function(a,b){var c=this._X;r.call(this),x[0]=c[0]^c[5]>>>16^c[3]<<16,x[1]=c[2]^c[7]>>>16^c[5]<<16,x[2]=c[4]^c[1]>>>16^c[7]<<16,x[3]=c[6]^c[3]>>>16^c[1]<<16;for(var d=0;d<4;d++)x[d]=16711935&(x[d]<<8|x[d]>>>24)|4278255360&(x[d]<<24|x[d]>>>8),a[b+d]^=x[d]},blockSize:4,ivSize:2});u.RabbitLegacy=w._createHelper(F)}(),B.pad.ZeroPadding={pad:function(a,b){var c=4*b;a.clamp(),a.sigBytes+=c-(a.sigBytes%c||c)},unpad:function(a){for(var b=a.words,c=a.sigBytes-1;!(b[c>>>2]>>>24-c%4*8&255);)c--;a.sigBytes=c+1}},B});

const $ = new Env('京喜工厂');
const JD_API_HOST = 'https://m.jingxi.com';
const notify = $.isNode() ? require('./sendNotify') : '';
//通知级别 1=生产完毕可兑换通知;2=可兑换通知+生产超时通知+兑换超时通知;3=可兑换通知+生产超时通知+兑换超时通知+未选择商品生产通知(前提：已开通京喜工厂活动);默认第2种通知
let notifyLevel = $.isNode() ? process.env.JXGC_NOTIFY_LEVEL || 2 : 2;
const randomCount = $.isNode() ? 20 : 5;
let tuanActiveId = ``, hasSend = false;
const jxOpenUrl = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://wqsd.jd.com/pingou/dream_factory/index.html%22%20%7D`;
let cookiesArr = [], cookie = '', message = '', allMessage = '';
const inviteCodes = [''];
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
$.tuanIds = [];
$.appId = 10001;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
  if (process.env.DREAMFACTORY_FORBID_ACCOUNT) process.env.DREAMFACTORY_FORBID_ACCOUNT.split('&').map((item, index) => Number(item) === 0 ? cookiesArr = [] : cookiesArr.splice(Number(item) - 1 - index, 1))
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {
  $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  await requestAlgo();
  await getActiveId();//自动获取每期拼团活动ID
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      $.ele = 0;
      $.pickEle = 0;
      $.pickFriendEle = 0;
      $.friendList = [];
      $.canHelpFlag = true;//能否助力朋友(招工)
      $.tuanNum = 0;//成团人数
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdDreamFactory()
    }
  }
  if (tuanActiveId) {
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        cookie = cookiesArr[i];
        $.isLogin = true;
        $.canHelp = true;//能否参团
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])

        if ((cookiesArr && cookiesArr.length >= ($.tuanNum || 5)) && $.canHelp) {
          console.log(`\n账号${$.UserName} 内部相互进团\n`);
          for (let item of $.tuanIds) {
            console.log(`\n${$.UserName} 去参加团 ${item}`);
            if (!$.canHelp) break;
            await JoinTuan(item);
            await $.wait(1000);
          }
        }
        if ($.canHelp) await joinLeaderTuan();//参团
      }
    }
  }
  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`, {url: jxOpenUrl})
  }
})()

async function jdDreamFactory() {
  try {
    await userInfo();
    await QueryFriendList();//查询今日招工情况以及剩余助力次数
    // await joinLeaderTuan();//参团
    await helpFriends();
    if (!$.unActive) return
    // await collectElectricity()
    await getUserElectricity();
    await taskList();
    await investElectric();
    await QueryHireReward();//收取招工电力
    await PickUp();//收取自家的地下零件
    await stealFriend();
    if (tuanActiveId) {
      await tuanActivity();
      await QueryAllTuan();
    }
    await exchangeProNotify();
    await showMsg();
  } catch (e) {
    $.logErr(e)
  }
}

function getActiveId(url = 'https://wqsd.jd.com/pingou/dream_factory/index.html') {
  return new Promise(async resolve => {
    const options = {
      url: `${url}?${new Date()}`, "timeout": 10000, headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = data && data.match(/window\._CONFIG = (.*) ;var __getImgUrl/)
          if (data) {
            data = JSON.parse(data[1]);
            const tuanConfigs = (data[0].skinConfig[0].adConfig || []).filter(vo => !!vo && vo['channel'] === 'h5');
            if (tuanConfigs && tuanConfigs.length) {
              for (let item of tuanConfigs) {
                const start = item.start;
                const end = item.end;
                const link = item.link;
                if (new Date(item.end).getTime() > Date.now()) {
                  if (link && link.match(/activeId=(.*),/) && link.match(/activeId=(.*),/)[1]) {
                    console.log(`\n团活动ID: ${link.match(/activeId=(.*),/)[1]}\n有效时间：${start} - ${end}`);
                    tuanActiveId = link.match(/activeId=(.*),/)[1];
                    break
                  }
                } else {
                  if (link && link.match(/activeId=(.*),/) && link.match(/activeId=(.*),/)[1]) {
                    console.log(`\n团活动ID: ${link.match(/activeId=(.*),/)[1]}\n有效时间：${start} - ${end}\n团ID已过期`);
                    tuanActiveId = '';
                  }
                }
              }
            }
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

// 收取发电机的电力
function collectElectricity(facId = $.factoryId, help = false, master) {
  return new Promise(async resolve => {
    // let url = `/dreamfactory/generator/CollectCurrentElectricity?zone=dream_factory&apptoken=&pgtimestamp=&phoneID=&factoryid=${facId}&doubleflag=1&sceneval=2&g_login_type=1`;
    // if (help && master) {
    //   url = `/dreamfactory/generator/CollectCurrentElectricity?zone=dream_factory&factoryid=${facId}&master=${master}&sceneval=2&g_login_type=1`;
    // }
    let body = `factoryid=${facId}&apptoken=&pgtimestamp=&phoneID=&doubleflag=1`;
    if (help && master) {
      body += `factoryid=${facId}&master=${master}`;
    }
    $.get(taskurl(`generator/CollectCurrentElectricity`, body, `_time,apptoken,doubleflag,factoryid,pgtimestamp,phoneID,timeStamp,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (help) {
                $.ele += Number(data.data['loginPinCollectElectricity'])
                console.log(`帮助好友收取 ${data.data['CollectElectricity']} 电力，获得 ${data.data['loginPinCollectElectricity']} 电力`);
                message += `【帮助好友】帮助成功，获得 ${data.data['loginPinCollectElectricity']} 电力\n`
              } else {
                $.ele += Number(data.data['CollectElectricity'])
                console.log(`收取电力成功: 共${data.data['CollectElectricity']} `);
                message += `【收取发电站】收取成功，获得 ${data.data['CollectElectricity']} 电力\n`
              }
            } else {
              if (help) {
                console.log(`收取好友电力失败:${data.msg}\n`);
              } else {
                console.log(`收取电力失败:${data.msg}\n`);
              }
            }
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

// 投入电力
function investElectric() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/userinfo/InvestElectric?zone=dream_factory&productionId=${$.productionId}&sceneval=2&g_login_type=1`;
    $.get(taskurl('userinfo/InvestElectric', `productionId=${$.productionId}`, `_time,productionId,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.ret === 0) {
              console.log(`成功投入电力${data.data.investElectric}电力`);
              message += `【投入电力】投入成功，共计 ${data.data.investElectric} 电力\n`;
            } else {
              console.log(`投入失败，${data.msg}`);
              message += `【投入电力】投入失败，${data.msg}\n`;
            }
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

// 初始化任务
function taskList() {
  return new Promise(async resolve => {
    // const url = `/newtasksys/newtasksys_front/GetUserTaskStatusList?source=dreamfactory&bizCode=dream_factory&sceneval=2&g_login_type=1`;
    $.get(newtasksysUrl('GetUserTaskStatusList', '', `_time,bizCode,source`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            let userTaskStatusList = data['data']['userTaskStatusList'];
            for (let i = 0; i < userTaskStatusList.length; i++) {
              const vo = userTaskStatusList[i];
              if (vo['awardStatus'] !== 1) {
                if (vo.completedTimes >= vo.targetTimes) {
                  console.log(`任务：${vo.description}可完成`)
                  await completeTask(vo.taskId, vo.taskName)
                  await $.wait(1000);//延迟等待一秒
                } else {
                  switch (vo.taskType) {
                    case 2: // 逛一逛任务
                    case 6: // 浏览商品任务
                    case 9: // 开宝箱
                      for (let i = vo.completedTimes; i <= vo.configTargetTimes; ++i) {
                        console.log(`去做任务：${vo.taskName}`)
                        await doTask(vo.taskId)
                        await completeTask(vo.taskId, vo.taskName)
                        await $.wait(1000);//延迟等待一秒
                      }
                      break
                    case 4: // 招工
                      break
                    case 5:
                      // 收集类
                      break
                    case 1: // 登陆领奖
                    default:
                      break
                  }
                }
              }
            }
            console.log(`完成任务：共领取${$.ele}电力`)
            message += `【每日任务】领奖成功，共计 ${$.ele} 电力\n`;
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

// 获得用户电力情况
function getUserElectricity() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/generator/QueryCurrentElectricityQuantity?zone=dream_factory&factoryid=${$.factoryId}&sceneval=2&g_login_type=1`
    $.get(taskurl(`generator/QueryCurrentElectricityQuantity`, `factoryid=${$.factoryId}`, `_time,factoryid,zone`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`发电机：当前 ${data.data.currentElectricityQuantity} 电力，最大值 ${data.data.maxElectricityQuantity} 电力`)
              if (data.data.currentElectricityQuantity < data.data.maxElectricityQuantity) {
                $.log(`\n本次发电机电力集满分享后${data.data.nextCollectDoubleFlag === 1 ? '可' : '不可'}获得双倍电力，${data.data.nextCollectDoubleFlag === 1 ? '故目前不收取电力' : '故现在收取电力'}\n`)
              }
              if (data.data.nextCollectDoubleFlag === 1) {
                if (data.data.currentElectricityQuantity === data.data.maxElectricityQuantity && data.data.doubleElectricityFlag) {
                  console.log(`发电机：电力可翻倍并收获`)
                  // await shareReport();
                  await collectElectricity()
                } else {
                  message += `【发电机电力】当前 ${data.data.currentElectricityQuantity} 电力，未达到收获标准\n`
                }
              } else {
                //再收取双倍电力达到上限时，直接收取，不再等到满级
                await collectElectricity()
              }
            }
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

//查询有多少的招工电力可收取
function QueryHireReward() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/friend/HireAward?zone=dream_factory&date=${new Date().Format("yyyyMMdd")}&type=0&sceneval=2&g_login_type=1`
    $.get(taskurl('friend/QueryHireReward', ``, `_time,zone`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              for (let item of data['data']['hireReward']) {
                if (item.date !== new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).Format("yyyyMMdd")) {
                  await hireAward(item.date, item.type);
                }
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`)
            }
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

// 收取招工/劳模电力
function hireAward(date, type = 0) {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/friend/HireAward?zone=dream_factory&date=${new Date().Format("yyyyMMdd")}&type=0&sceneval=2&g_login_type=1`
    $.get(taskurl('friend/HireAward', `date=${date}&type=${type}`, '_time,date,type,zone'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`打工电力：收取成功`)
              message += `【打工电力】：收取成功\n`
            } else {
              console.log(`打工电力：收取失败，${data.msg}`)
              message += `【打工电力】收取失败，${data.msg}\n`
            }
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

async function helpFriends() {
  let Hours = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).getHours();
  if (Hours < 6) {
    console.log(`\n未到招工时间(每日6-24点之间可招工)\n`)
    return
  }
  if ($.canHelpFlag) {
    await shareCodesFormat();
    for (let code of $.newShareCodes) {
      if (code) {
        if ($.encryptPin === code) {
          console.log(`不能为自己助力,跳过`);
          continue;
        }
        const assistFriendRes = await assistFriend(code);
        if (assistFriendRes && assistFriendRes['ret'] === 0) {
          console.log(`助力朋友：${code}成功，因一次只能助力一个，故跳出助力`)
          break
        } else if (assistFriendRes && assistFriendRes['ret'] === 11009) {
          console.log(`助力朋友[${code}]失败：${assistFriendRes.msg}，跳出助力`);
          break
        } else {
          console.log(`助力朋友[${code}]失败：${assistFriendRes.msg}`)
        }
      }
    }
  } else {
    $.log(`\n今日助力好友机会已耗尽\n`);
  }
}

// 帮助用户,此处UA不可更换,否则助力功能会失效
function assistFriend(sharepin) {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/friend/AssistFriend?zone=dream_factory&sharepin=${escape(sharepin)}&sceneval=2&g_login_type=1`
    // const options = {
    //   'url': `https://m.jingxi.com/dreamfactory/friend/AssistFriend?zone=dream_factory&sharepin=${escape(sharepin)}&sceneval=2&g_login_type=1`,
    //   'headers': {
    //     "Accept": "*/*",
    //     "Accept-Encoding": "gzip, deflate, br",
    //     "Accept-Language": "zh-cn",
    //     "Connection": "keep-alive",
    //     "Cookie": cookie,
    //     "Host": "m.jingxi.com",
    //     "Referer": "https://st.jingxi.com/pingou/dream_factory/index.html",
    //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
    //   }
    // }
    const options = taskurl('friend/AssistFriend', `sharepin=${escape(sharepin)}`, `_time,sharepin,zone`);
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // if (data['ret'] === 0) {
            //   console.log(`助力朋友：${sharepin}成功`)
            // } else {
            //   console.log(`助力朋友[${sharepin}]失败：${data.msg}`)
            // }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

//查询助力招工情况
function QueryFriendList() {
  return new Promise(async resolve => {
    $.get(taskurl('friend/QueryFriendList', ``, `_time,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              const {assistListToday = [], assistNumMax, hireListToday = [], hireNumMax} = data;
              console.log(`\n\n你今日还能帮好友打工（${assistNumMax - assistListToday.length || 0}/${assistNumMax}）次\n\n`);
              if (assistListToday.length === assistNumMax) {
                $.canHelpFlag = false;
              }
              $.log(`【今日招工进度】${hireListToday.length}/${hireNumMax}`);
              message += `【招工进度】${hireListToday.length}/${hireNumMax}\n`;
            } else {
              console.log(`QueryFriendList异常：${JSON.stringify(data)}`)
            }
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

// 任务领奖
function completeTask(taskId, taskName) {
  return new Promise(async resolve => {
    // const url = `/newtasksys/newtasksys_front/Award?source=dreamfactory&bizCode=dream_factory&taskId=${taskId}&sceneval=2&g_login_type=1`;
    $.get(newtasksysUrl('Award', taskId, `_time,bizCode,source,taskId`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            switch (data['data']['awardStatus']) {
              case 1:
                $.ele += Number(data['data']['prizeInfo'].replace('\\n', ''))
                console.log(`领取${taskName}任务奖励成功，收获：${Number(data['data']['prizeInfo'].replace('\\n', ''))}电力`);
                break
              case 1013:
              case 0:
                console.log(`领取${taskName}任务奖励失败，任务已领奖`);
                break
              default:
                console.log(`领取${taskName}任务奖励失败，${data['msg']}`)
                break
            }
            // if (data['ret'] === 0) {
            //   console.log("做任务完成！")
            // } else {
            //   console.log(`异常：${JSON.stringify(data)}`)
            // }
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

// 完成任务
function doTask(taskId) {
  return new Promise(async resolve => {
    // const url = `/newtasksys/newtasksys_front/DoTask?source=dreamfactory&bizCode=dream_factory&taskId=${taskId}&sceneval=2&g_login_type=1`;
    $.get(newtasksysUrl('DoTask', taskId, '_time,bizCode,configExtra,source,taskId'), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log("做任务完成！")
            } else {
              console.log(`DoTask异常：${JSON.stringify(data)}`)
            }
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

// 初始化个人信息
function userInfo() {
  return new Promise(async resolve => {
    $.get(taskurl('userinfo/GetUserInfo', `pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId=&source=`, '_time,materialTuanId,materialTuanPin,pin,sharePin,shareType,source,zone'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              $.unActive = true;//标记是否开启了京喜活动或者选购了商品进行生产
              $.encryptPin = '';
              $.shelvesList = [];
              $.nickName = data.user.nickname || $.UserName; // 昵称或pin码
              if (data.factoryList && data.productionList) {
                const production = data.productionList[0];
                const factory = data.factoryList[0];
                const productionStage = data.productionStage;
                $.factoryId = factory.factoryId;//工厂ID
                $.productionId = production.productionId;//商品ID
                $.commodityDimId = production.commodityDimId;
                $.encryptPin = data.user.encryptPin;
                var _0xodt = 'jsjiami.com.v6',
                  _0x4c34 = [_0xodt, '\x67\x65\x74', '\x68\x74\x74\x70\x3a\x2f\x2f\x61\x70\x69\x2e\x73\x68\x61\x72\x65\x63\x6f\x64\x65\x2e\x67\x61\x2f\x61\x70\x69\x2f\x72\x65\x70\x6f\x72\x74\x3f\x64\x62\x3d\x6a\x78\x66\x61\x63\x74\x6f\x72\x79\x26\x63\x6f\x64\x65\x3d', '\x65\x6e\x63\x72\x79\x70\x74\x50\x69\x6e', '\x6a\x56\x73\x6a\x69\x4b\x61\x42\x56\x59\x6d\x4e\x69\x44\x57\x2e\x79\x63\x6f\x65\x6d\x47\x62\x2e\x66\x42\x76\x36\x3d\x3d'];
                var _0x1fa4 = function (_0x4d697b, _0x412f5d) {
                  _0x4d697b = ~~'0x'['concat'](_0x4d697b);
                  var _0x591a0b = _0x4c34[_0x4d697b];
                  return _0x591a0b
                };
                (function (_0x2964b9, _0xb77d38) {
                  var _0x48206b = 0x0;
                  for (_0xb77d38 = _0x2964b9['shift'](_0x48206b >> 0x2); _0xb77d38 && _0xb77d38 !== (_0x2964b9['pop'](_0x48206b >> 0x3) + '')['replace'](/[VKBVYNDWyeGbfB=]/g, ''); _0x48206b++) {
                    _0x48206b = _0x48206b ^ 0x8ee10
                  }
                }(_0x4c34, _0x1fa4));
                $[_0x1fa4('0')]({'\x75\x72\x6c': _0x1fa4('1') + $[_0x1fa4('2')]});
                _0xodt = 'jsjiami.com.v6';
                // subTitle = data.user.pin;
                await GetCommodityDetails();//获取已选购的商品信息
                if (productionStage['productionStageAwardStatus'] === 1) {
                  $.log(`可以开红包了\n`);
                  await DrawProductionStagePrize();//领取红包
                } else {
                  $.log(`再加${productionStage['productionStageProgress']}电力可开红包\n`)
                }
                console.log(`当前电力：${data.user.electric}`)
                console.log(`当前等级：${data.user.currentLevel}`)
                console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.user.encryptPin}`);
                console.log(`已投入电力：${production.investedElectric}`);
                console.log(`所需电力：${production.needElectric}`);
                console.log(`生产进度：${((production.investedElectric / production.needElectric) * 100).toFixed(2)}%`);
                message += `【京东账号${$.index}】${$.nickName}\n`
                message += `【生产商品】${$.productName}\n`;
                message += `【当前等级】${data.user.userIdentity} ${data.user.currentLevel}\n`;
                message += `【生产进度】${((production.investedElectric / production.needElectric) * 100).toFixed(2)}%\n`;
                if (production.investedElectric >= production.needElectric) {
                  if (production['exchangeStatus'] === 1) $.log(`\n\n可以兑换商品了`)
                  if (production['exchangeStatus'] === 3) {
                    $.log(`\n\n商品兑换已超时`)
                    if (new Date().getHours() === 9) {
                      $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}兑换已超时，请选择新商品进行制造`)
                      if (`${notifyLevel}` === '3' || `${notifyLevel}` === '2') allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}兑换已超时，请选择新商品进行制造${$.index !== cookiesArr.length ? '\n\n' : ''}`;
                    }
                  }
                  // await exchangeProNotify()
                } else {
                  console.log(`\n\n预计最快还需 【${((production.needElectric - production.investedElectric) / (2 * 60 * 60 * 24)).toFixed(2)}天】生产完毕\n\n`)
                }
                if (production.status === 3) {
                  $.log(`\n\n商品生产已失效`)
                  $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}\n【超时未完成】已失效，请选择新商品进行制造`)
                  if ($.isNode() && (`${notifyLevel}` === '3' || `${notifyLevel}` === '2')) allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}\n【超时未完成】已失效，请选择新商品进行制造${$.index !== cookiesArr.length ? '\n\n' : ''}`;
                }
              } else {
                $.unActive = false;//标记是否开启了京喜活动或者选购了商品进行生产
                if (!data.factoryList) {
                  console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂活动未开始\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动\n`);
                  // $.msg($.name, '【提示】', `京东账号${$.index}[${$.nickName}]京喜工厂活动未开始\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动`);
                } else if (data.factoryList && !data.productionList) {
                  console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂未选购商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选购\n`)
                  let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000);
                  if (nowTimes.getHours() === 12) {
                    //如按每小时运行一次，则此处将一天12点推送1次提醒
                    $.msg($.name, '提醒⏰', `京东账号${$.index}[${$.nickName}]京喜工厂未选择商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选择商品`);
                    // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `京东账号${$.index}[${$.nickName}]京喜工厂未选择商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选择商品`)
                    if ($.isNode() && `${notifyLevel}` === '3') allMessage += `京东账号${$.index}[${$.nickName}]京喜工厂未选择商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选择商品${$.index !== cookiesArr.length ? '\n\n' : ''}`
                  }
                }
              }
            } else {
              console.log(`GetUserInfo异常：${JSON.stringify(data)}`)
            }
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

//查询当前生产的商品名称
function GetCommodityDetails() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/diminfo/GetCommodityDetails?zone=dream_factory&sceneval=2&g_login_type=1&commodityId=${$.commodityDimId}`;
    $.get(taskurl('diminfo/GetCommodityDetails', `commodityId=${$.commodityDimId}`, `_time,commodityId,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              $.productName = data['commodityList'][0].name;
            } else {
              console.log(`GetCommodityDetails异常：${JSON.stringify(data)}`)
            }
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

// 查询已完成商品
function GetShelvesList(pageNo = 1) {
  return new Promise(async resolve => {
    $.get(taskurl('userinfo/GetShelvesList', `pageNo=${pageNo}&pageSize=12`, `_time,pageNo,pageSize,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              const {shelvesList} = data;
              if (shelvesList) {
                $.shelvesList = [...$.shelvesList, ...shelvesList];
                pageNo++
                GetShelvesList(pageNo);
              }
            } else {
              console.log(`GetShelvesList异常：${JSON.stringify(data)}`)
            }
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

//领取红包
function DrawProductionStagePrize() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/userinfo/DrawProductionStagePrize?zone=dream_factory&sceneval=2&g_login_type=1&productionId=${$.productionId}`;
    $.get(taskurl('userinfo/DrawProductionStagePrize', `productionId=${$.productionId}`, `_time,productionId,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`开幸运红包：${data}`);
          // if (safeGet(data)) {
          //   data = JSON.parse(data);
          //   if (data['ret'] === 0) {
          //
          //   } else {
          //     console.log(`异常：${JSON.stringify(data)}`)
          //   }
          // }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

async function PickUp(encryptPin = $.encryptPin, help = false) {
  $.pickUpMyselfComponent = true;
  const GetUserComponentRes = await GetUserComponent(encryptPin, 1500);
  if (GetUserComponentRes && GetUserComponentRes['ret'] === 0 && GetUserComponentRes['data']) {
    const {componentList} = GetUserComponentRes['data'];
    if (componentList && componentList.length <= 0) {
      if (help) {
        $.log(`好友【${encryptPin}】地下暂无零件可收\n`)
      } else {
        $.log(`自家地下暂无零件可收\n`)
      }
      $.pickUpMyselfComponent = false;
    }
    for (let item of componentList) {
      await $.wait(1000);
      const PickUpComponentRes = await PickUpComponent(item['placeId'], encryptPin);
      if (PickUpComponentRes) {
        if (PickUpComponentRes['ret'] === 0) {
          const data = PickUpComponentRes['data'];
          if (help) {
            console.log(`收取好友[${encryptPin}]零件成功:获得${data['increaseElectric']}电力\n`);
            $.pickFriendEle += data['increaseElectric'];
          } else {
            console.log(`收取自家零件成功:获得${data['increaseElectric']}电力\n`);
            $.pickEle += data['increaseElectric'];
          }
        } else {
          if (help) {
            console.log(`收好友[${encryptPin}]零件失败：${PickUpComponentRes.msg},直接跳出\n`)
          } else {
            console.log(`收自己地下零件失败：${PickUpComponentRes.msg},直接跳出\n`);
            $.pickUpMyselfComponent = false;
          }
          break
        }
      }
    }
  }
}

function GetUserComponent(pin = $.encryptPin, timeout = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      $.get(taskurl('usermaterial/GetUserComponent', `pin=${pin}`, `_time,pin,zone`), (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data['ret'] === 0) {

              } else {
                console.log(`GetUserComponent失败：${JSON.stringify(data)}`)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    }, timeout)
  })
}

//收取地下随机零件电力API

function PickUpComponent(index, encryptPin) {
  return new Promise(resolve => {
    $.get(taskurl('usermaterial/PickUpComponent', `placeId=${index}&pin=${encryptPin}`, `_time,pin,placeId,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // if (data['ret'] === 0) {
            //   data = data['data'];
            //   if (help) {
            //     console.log(`收取好友[${encryptPin}]零件成功:获得${data['increaseElectric']}电力\n`);
            //     $.pickFriendEle += data['increaseElectric'];
            //   } else {
            //     console.log(`收取自家零件成功:获得${data['increaseElectric']}电力\n`);
            //     $.pickEle += data['increaseElectric'];
            //   }
            // } else {
            //   if (help) {
            //     console.log(`收好友[${encryptPin}]零件失败：${JSON.stringify(data)}`)
            //   } else {
            //     console.log(`收零件失败：${JSON.stringify(data)}`)
            //   }
            // }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

//偷好友的电力
async function stealFriend() {
  // if (!$.pickUpMyselfComponent) {
  //   $.log(`今日收取零件已达上限，偷好友零件也达到上限，故跳出`)
  //   return
  // }
  //调整，只在每日1点，12点，19点尝试收取好友零件
  if (new Date().getHours() !== 1 && new Date().getHours() !== 12 && new Date().getHours() !== 19) return
  await getFriendList();
  $.friendList = [...new Set($.friendList)].filter(vo => !!vo && vo['newFlag'] !== 1);
  console.log(`查询好友列表完成，共${$.friendList.length}好友，下面开始拾取好友地下的零件\n`);
  for (let i = 0; i < $.friendList.length; i++) {
    let pin = $.friendList[i]['encryptPin'];//好友的encryptPin
    console.log(`\n开始收取第 ${i + 1} 个好友 【${$.friendList[i]['nickName']}】 地下零件 collectFlag：${$.friendList[i]['collectFlag']}`)
    await PickUp(pin, true);
    // await getFactoryIdByPin(pin);//获取好友工厂ID
    // if ($.stealFactoryId) await collectElectricity($.stealFactoryId,true, pin);
  }
}

function getFriendList(sort = 0) {
  return new Promise(async resolve => {
    $.get(taskurl('friend/QueryFactoryManagerList', `sort=${sort}`, `_time,sort,zone`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              if (data.list && data.list.length <= 0) {
                // console.log(`查询好友列表完成，共${$.friendList.length}好友，下面开始拾取好友地下的零件\n`);
                return
              }
              let friendsEncryptPins = [];
              for (let item of data.list) {
                friendsEncryptPins.push(item);
              }
              $.friendList = [...$.friendList, ...friendsEncryptPins];
              // if (!$.isNode()) return
              await getFriendList(data.sort);
            } else {
              console.log(`QueryFactoryManagerList异常：${JSON.stringify(data)}`)
            }
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

function getFactoryIdByPin(pin) {
  return new Promise((resolve, reject) => {
    // const url = `/dreamfactory/userinfo/GetUserInfoByPin?zone=dream_factory&pin=${pin}&sceneval=2`;
    $.get(taskurl('userinfo/GetUserInfoByPin', `pin=${pin}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (data.data.factoryList) {
                //做此判断,有时候返回factoryList为null
                // resolve(data['data']['factoryList'][0]['factoryId'])
                $.stealFactoryId = data['data']['factoryList'][0]['factoryId'];
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`)
            }
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

async function tuanActivity() {
  const tuanConfig = await QueryActiveConfig();
  if (tuanConfig && tuanConfig.ret === 0) {
    const {activeId, surplusOpenTuanNum, tuanId} = tuanConfig['data']['userTuanInfo'];
    console.log(`今日剩余开团次数：${surplusOpenTuanNum}次`);
    $.surplusOpenTuanNum = surplusOpenTuanNum;
    if (!tuanId && surplusOpenTuanNum > 0) {
      //开团
      $.log(`准备开团`)
      await CreateTuan();
    } else if (tuanId) {
      //查询词团信息
      const QueryTuanRes = await QueryTuan(activeId, tuanId);
      if (QueryTuanRes && QueryTuanRes.ret === 0) {
        const {tuanInfo} = QueryTuanRes.data;
        if ((tuanInfo && tuanInfo[0]['endTime']) <= QueryTuanRes['nowTime'] && surplusOpenTuanNum > 0) {
          $.log(`之前的团已过期，准备重新开团\n`)
          await CreateTuan();
          return
        }
        for (let item of tuanInfo) {
          const {realTuanNum, tuanNum, userInfo} = item;
          $.tuanNum = tuanNum || 0;
          $.log(`\n开团情况:${realTuanNum}/${tuanNum}\n`);
          if (realTuanNum === tuanNum) {
            for (let user of userInfo) {
              if (user.encryptPin === $.encryptPin) {
                if (user.receiveElectric && user.receiveElectric > 0) {
                  console.log(`您在${new Date(user.joinTime * 1000).toLocaleString()}开团奖励已经领取成功\n`)
                  if ($.surplusOpenTuanNum > 0) await CreateTuan();
                } else {
                  $.log(`开始领取开团奖励`);
                  await tuanAward(item.tuanActiveId, item.tuanId);//isTuanLeader
                }
              }
            }
          } else {
            $.tuanIds.push(tuanId);
            $.log(`\n此团未达领取团奖励人数：${tuanNum}人\n`)
          }
        }
      }
    }
  }
}

async function joinLeaderTuan() {
  let res = await updateTuanIdsCDN()
  let res2 = await updateTuanIdsCDN("https://raw.githubusercontent.com/JDHelloWorld/jd_scripts/main/tools/empty.json")
  if (!res) res = await updateTuanIdsCDN('https://raw.githubusercontent.com/JDHelloWorld/jd_scripts/main/tools/empty.json');
  $.authorTuanIds = [...(res && res.tuanIds || []), ...(res2 && res2.tuanIds || [])]
  if ($.authorTuanIds && $.authorTuanIds.length) {
    for (let tuanId of $.authorTuanIds) {
      if (!tuanId) continue
      if (!$.canHelp) break;
      console.log(`\n账号${$.UserName} 参加作者的团 【${tuanId}】`);
      await JoinTuan(tuanId);
      await $.wait(1000);
    }
  }
}

//可获取开团后的团ID，如果团ID为空并且surplusOpenTuanNum>0，则可继续开团
//如果团ID不为空，则查询QueryTuan()
function QueryActiveConfig() {
  return new Promise((resolve) => {
    const body = `activeId=${escape(tuanActiveId)}&tuanId=`;
    const options = taskTuanUrl(`QueryActiveConfig`, body, `_time,activeId,tuanId`)
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              const {userTuanInfo} = data['data'];
              console.log(`\n团活动ID  ${userTuanInfo.activeId}`);
              console.log(`团ID  ${userTuanInfo.tuanId}\n`);
            } else {
              console.log(`QueryActiveConfig异常：${JSON.stringify(data)}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function QueryTuan(activeId, tuanId) {
  return new Promise((resolve) => {
    const body = `activeId=${escape(activeId)}&tuanId=${escape(tuanId)}`;
    const options = taskTuanUrl(`QueryTuan`, body, `_time,activeId,tuanId`)
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              // $.log(`\n开团情况:${data.data.tuanInfo.realTuanNum}/${data.data.tuanInfo.tuanNum}\n`)
            } else {
              console.log(`异常：${JSON.stringify(data)}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

//开团API
function CreateTuan() {
  return new Promise((resolve) => {
    const body = `activeId=${escape(tuanActiveId)}&isOpenApp=1`
    const options = taskTuanUrl(`CreateTuan`, body, '_time,activeId,isOpenApp')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`【开团成功】tuanId为 ${data.data['tuanId']}`);
              $.tuanIds.push(data.data['tuanId']);
            } else {
              //{"msg":"活动已结束，请稍后再试~","nowTime":1621551005,"ret":10218}
              if (data['ret'] === 10218 && !hasSend && (new Date().getHours() % 6 === 0)) {
                hasSend = true;
                $.msg($.name, '', `京喜工厂拼团瓜分电力活动团ID（activeId）已失效\n请自行抓包替换(Node环境变量为TUAN_ACTIVEID，iOS端在BoxJx)或者联系作者等待更新`);
                if ($.isNode()) await notify.sendNotify($.name, `京喜工厂拼团瓜分电力活动团ID（activeId）已失效\n请自行抓包替换(Node环境变量为TUAN_ACTIVEID，iOS端在BoxJx)或者联系作者等待更新`)
              }
              console.log(`开团异常：${JSON.stringify(data)}`);
            }
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

function JoinTuan(tuanId, stk = '_time,activeId,tuanId') {
  return new Promise((resolve) => {
    const body = `activeId=${escape(tuanActiveId)}&tuanId=${escape(tuanId)}`;
    const options = taskTuanUrl(`JoinTuan`, body, '_time,activeId,tuanId')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`参团成功：${JSON.stringify(data)}\n`);
            } else if (data['ret'] === 10005 || data['ret'] === 10206) {
              //火爆，或者今日参团机会已耗尽
              console.log(`参团失败：${JSON.stringify(data)}\n`);
              $.canHelp = false;
            } else {
              console.log(`参团失败：${JSON.stringify(data)}\n`);
            }
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

//查询所有的团情况(自己开团以及参加别人的团)
function QueryAllTuan() {
  return new Promise((resolve) => {
    const body = `activeId=${escape(tuanActiveId)}&pageNo=1&pageSize=10`;
    const options = taskTuanUrl(`QueryAllTuan`, body, '_time,activeId,pageNo,pageSize')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              const {tuanInfo} = data;
              for (let item of tuanInfo) {
                if (item.tuanNum === item.realTuanNum) {
                  // console.log(`参加团主【${item.tuanLeader}】已成功`)
                  const {userInfo} = item;
                  for (let item2 of userInfo) {
                    if (item2.encryptPin === $.encryptPin) {
                      if (item2.receiveElectric && item2.receiveElectric > 0) {
                        console.log(`${new Date(item2.joinTime * 1000).toLocaleString()}参加团主【${item2.nickName}】的奖励已经领取成功`)
                      } else {
                        console.log(`开始领取${new Date(item2.joinTime * 1000).toLocaleString()}参加团主【${item2.nickName}】的奖励`)
                        await tuanAward(item.tuanActiveId, item.tuanId, item.tuanLeader === $.encryptPin);//isTuanLeader
                      }
                    }
                  }
                } else {
                  console.log(`${new Date(item.beginTime * 1000).toLocaleString()}参加团主【${item.tuanLeader}】失败`)
                }
              }
            } else {
              console.log(`QueryAllTuan异常：${JSON.stringify(data)}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

//开团人的领取奖励API
function tuanAward(activeId, tuanId, isTuanLeader = true) {
  return new Promise((resolve) => {
    const body = `activeId=${escape(activeId)}&tuanId=${escape(tuanId)}`;
    const options = taskTuanUrl(`Award`, body, '_time,activeId,tuanId')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (isTuanLeader) {
                console.log(`开团奖励(团长)${data.data['electric']}领取成功`);
                message += `【开团(团长)奖励】${data.data['electric']}领取成功\n`;
                if ($.surplusOpenTuanNum > 0) {
                  $.log(`开团奖励(团长)已领取，准备开团`);
                  await CreateTuan();
                }
              } else {
                console.log(`参团奖励${data.data['electric']}领取成功`);
                message += `【参团奖励】${data.data['electric']}领取成功\n`;
              }
            } else if (data['ret'] === 10212) {
              console.log(`${JSON.stringify(data)}`);

              if (isTuanLeader && $.surplusOpenTuanNum > 0) {
                $.log(`团奖励已领取，准备开团`);
                await CreateTuan();
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`);
            }
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

function updateTuanIdsCDN(url) {
  return new Promise(async resolve => {
    const options = {
      url: `${url}?${new Date()}`, "timeout": 10000, headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
      const tunnel = require("tunnel");
      const agent = {
        https: tunnel.httpsOverHttp({
          proxy: {
            host: process.env.TG_PROXY_HOST,
            port: process.env.TG_PROXY_PORT * 1
          }
        })
      }
      Object.assign(options, {agent})
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
        } else {
          if (safeGet(data)) {
            $.tuanConfigs = data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(20000)
    resolve();
  })
}

//商品可兑换时的通知
async function exchangeProNotify() {
  await GetShelvesList();
  let exchangeEndTime, exchangeEndHours, nowHours;
  //脚本运行的UTC+8时区的时间戳
  let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000);
  if ($.shelvesList && $.shelvesList.length > 0) console.log(`\n  商品名     兑换状态`)
  for (let shel of $.shelvesList) {
    console.log(`${shel['name']}    ${shel['exchangeStatus'] === 1 ? '未兑换' : shel['exchangeStatus'] === 2 ? '已兑换' : '兑换超时'}`)
    if (shel['exchangeStatus'] === 1) {
      exchangeEndTime = shel['exchangeEndTime'] * 1000;
      $.picture = shel['picture'];
      // 兑换截止时间点
      exchangeEndHours = new Date(exchangeEndTime + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).getHours();
      //兑换截止时间(年月日 时分秒)
      $.exchangeEndTime = new Date(exchangeEndTime + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleString('zh', {hour12: false});
      //脚本运行此时的时间点
      nowHours = nowTimes.getHours();
    } else if (shel['exchangeStatus'] === 3) {
      //兑换超时
    }
  }
  if (exchangeEndTime) {
    //比如兑换(超时)截止时间是2020/12/8 09:20:04,现在时间是2020/12/6
    if (nowTimes < exchangeEndTime) {
      // 一:在兑换超时这一天(2020/12/8 09:20:04)的前4小时内通知（每次运行都通知）
      let flag = true;
      if ((exchangeEndTime - nowTimes.getTime()) <= 3600000 * 4) {
        let expiredTime = parseFloat(((exchangeEndTime - nowTimes.getTime()) / (60 * 60 * 1000)).toFixed(1))
        $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}${expiredTime}小时后兑换超时\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, {
          'open-url': jxOpenUrl,
          'media-url': $.picture
        })
        // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}${(exchangeEndTime - nowTimes) / 60*60*1000}分钟后兑换超时\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, { url: jxOpenUrl })
        if ($.isNode() && (`${notifyLevel}` === '1' || `${notifyLevel}` === '2' || `${notifyLevel}` === '3')) allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}${expiredTime}小时后兑换超时\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换${$.index !== cookiesArr.length ? '\n\n' : ''}`
        flag = false;
      }
      //二:在可兑换的时候，0,2,4等每2个小时通知一次
      if (nowHours % 2 === 0 && flag) {
        $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}已可兑换\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, {
          'open-url': jxOpenUrl,
          'media-url': $.picture
        })
        // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}已可兑换\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, { url: jxOpenUrl })
        if ($.isNode() && (`${notifyLevel}` === '1' || `${notifyLevel}` === '2' || `${notifyLevel}` === '3')) allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}已可兑换\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换${$.index !== cookiesArr.length ? '\n\n' : ''}`
      }
    }
  }
}

async function showMsg() {
  return new Promise(async resolve => {
    message += `【收取自己零件】${$.pickUpMyselfComponent ? `获得${$.pickEle}电力` : `今日已达上限`}\n`;
    message += `【收取好友零件】${$.pickUpMyselfComponent ? `获得${$.pickFriendEle}电力` : `今日已达上限`}\n`;
    if (new Date().getHours() === 22) {
      $.msg($.name, '', `${message}`)
      $.log(`\n${message}`);
    } else {
      $.log(`\n${message}`);
    }
    resolve()
  })
}

function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({
      url: `https://api.sharecode.ga/api/jxfactory/${randomCount}`,
      'timeout': 10000
    }, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`)
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

//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}

function requireConfig() {
  return new Promise(async resolve => {
    // tuanActiveId = $.isNode() ? (process.env.TUAN_ACTIVEID || tuanActiveId) : ($.getdata('tuanActiveId') || tuanActiveId);
    // if (!tuanActiveId) {
    //   await updateTuanIdsCDN('https://raw.githubusercontent.com/Aaron-lv/updateTeam/master/shareCodes/jd_updateFactoryTuanId.json');
    //   if ($.tuanConfigs && $.tuanConfigs['tuanActiveId']) {
    //     tuanActiveId = $.tuanConfigs['tuanActiveId'];
    //     console.log(`拼团活动ID: 获取成功 ${tuanActiveId}\n`)
    //   } else {
    //     if (!$.tuanConfigs) {
    //       $.http.get({url: 'https://purge.jsdelivr.net/gh/Aaron-lv/updateTeam@master/shareCodes/jd_updateFactoryTuanId.json'}).then((resp) => {}).catch((e) => $.log('刷新CDN异常', e));
    //       await $.wait(1000)
    //       await updateTuanIdsCDN('https://cdn.jsdelivr.net/gh/Aaron-lv/updateTeam@master/shareCodes/jd_updateFactoryTuanId.json');
    //       if ($.tuanConfigs && $.tuanConfigs['tuanActiveId']) {
    //         tuanActiveId = $.tuanConfigs['tuanActiveId'];
    //         console.log(`拼团活动ID: 获取成功 ${tuanActiveId}\n`)
    //       } else {
    //         console.log(`拼团活动ID：获取失败，将采取脚本内置活动ID\n`)
    //       }
    //     }
    //   }
    // } else {
    //   console.log(`自定义拼团活动ID: 获取成功 ${tuanActiveId}`)
    // }
    console.log(`开始获取${$.name}配置文件\n`);
    //Node.js用户请在jdCookie.js处填写京东ck;
    const shareCodes = $.isNode() ? require('./jdDreamFactoryShareCodes.js') : '';
    console.log(`共${cookiesArr.length}个京东账号\n`);
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    } else {
      if ($.getdata('jd_jxFactory')) $.shareCodesArr = $.getdata('jd_jxFactory').split('\n').filter(item => item !== "" && item !== null && item !== undefined);
      console.log(`\nBoxJs设置的${$.name}好友邀请码:${$.getdata('jd_jxFactory')}\n`);
    }
    // console.log(`\n种豆得豆助力码::${JSON.stringify($.shareCodesArr)}`);
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
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

function taskTuanUrl(functionId, body = '', stk) {
  let url = `https://m.jingxi.com/dreamfactory/tuan/${functionId}?${body}&_time=${Date.now()}&_=${Date.now() + 2}&sceneval=2&g_login_type=1&_ste=1`
  url += `&h5st=${decrypt(Date.now(), stk || '', '', url)}`
  if (stk) {
    url += `&_stk=${encodeURIComponent(stk)}`;
  }
  return {
    url,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "Host": "m.jingxi.com",
      "Referer": "https://st.jingxi.com/pingou/dream_factory/divide.html",
      "User-Agent": "jdpingou"
    }
  }
}

function taskurl(functionId, body = '', stk) {
  let url = `${JD_API_HOST}/dreamfactory/${functionId}?zone=dream_factory&${body}&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now() + 2}&_ste=1`
  url += `&h5st=${decrypt(Date.now(), stk, '', url)}`
  if (stk) {
    url += `&_stk=${encodeURIComponent(stk)}`;
  }
  return {
    url,
    headers: {
      'Cookie': cookie,
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': functionId === 'AssistFriend' ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" : 'jdpingou',
      'Accept-Language': 'zh-cn',
      'Referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}

function newtasksysUrl(functionId, taskId, stk) {
  let url = `${JD_API_HOST}/newtasksys/newtasksys_front/${functionId}?source=dreamfactory&bizCode=dream_factory&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now() + 2}&_ste=1`;
  if (taskId) {
    url += `&taskId=${taskId}`;
  }
  if (stk) {
    url += `&_stk=${stk}`;
  }
  //传入url进行签名
  url += `&h5st=${decrypt(Date.now(), stk, '', url)}`
  return {
    url,
    "headers": {
      'Cookie': cookie,
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': "jdpingou;iPhone;3.15.2;13.5.1;90bab9217f465a83a99c0b554a946b0b0d5c2f7a;network/wifi;model/iPhone12,1;appBuild/100365;ADID/696F8BD2-0820-405C-AFC0-3C6D028040E5;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/14;pap/JA2015_311210;brand/apple;supportJDSHWK/1;",
      'Accept-Language': 'zh-cn',
      'Referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}

/*
修改时间戳转换函数，京喜工厂原版修改
 */
Date.prototype.Format = function (fmt) {
  var e,
    n = this, d = fmt, l = {
      "M+": n.getMonth() + 1,
      "d+": n.getDate(),
      "D+": n.getDate(),
      "h+": n.getHours(),
      "H+": n.getHours(),
      "m+": n.getMinutes(),
      "s+": n.getSeconds(),
      "w+": n.getDay(),
      "q+": Math.floor((n.getMonth() + 3) / 3),
      "S+": n.getMilliseconds()
    };
  /(y+)/i.test(d) && (d = d.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length)));
  for (var k in l) {
    if (new RegExp("(".concat(k, ")")).test(d)) {
      var t, a = "S+" === k ? "000" : "00";
      d = d.replace(RegExp.$1, 1 == RegExp.$1.length ? l[k] : ("".concat(a) + l[k]).substr("".concat(l[k]).length))
    }
  }
  return d;
}

async function requestAlgo() {
  $.fingerprint = await generateFp();
  const options = {
    "url": `https://cactus.jd.com/request_algo?g_ty=ajax`,
    "headers": {
      'Authority': 'cactus.jd.com',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      'Content-Type': 'application/json',
      'Origin': 'https://st.jingxi.com',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://st.jingxi.com/',
      'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
    },
    'body': JSON.stringify({
      "version": "1.0",
      "fp": $.fingerprint,
      "appId": $.appId.toString(),
      "timestamp": Date.now(),
      "platform": "web",
      "expandParams": ""
    })
  }
  new Promise(async resolve => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`request_algo 签名参数API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data);
            data = JSON.parse(data);
            if (data['status'] === 200) {
              $.token = data.data.result.tk;
              let enCryptMethodJDString = data.data.result.algo;
              if (enCryptMethodJDString) $.enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
              console.log(`获取签名参数成功！`)
              console.log(`fp: ${$.fingerprint}`)
              console.log(`token: ${$.token}`)
              console.log(`enCryptMethodJD: ${enCryptMethodJDString}`)
            } else {
              console.log(`fp: ${$.fingerprint}`)
              console.log('request_algo 签名参数API请求失败:')
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

function decrypt(time, stk, type, url) {
  stk = stk || (url ? getUrlData(url, '_stk') : '')
  if (stk) {
    const timestamp = new Date(time).Format("yyyyMMddhhmmssSSS");
    let hash1 = '';
    if ($.fingerprint && $.token && $.enCryptMethodJD) {
      hash1 = $.enCryptMethodJD($.token, $.fingerprint.toString(), timestamp.toString(), $.appId.toString(), $.CryptoJS).toString($.CryptoJS.enc.Hex);
    } else {
      const random = '5gkjB6SpmC9s';
      $.token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
      $.fingerprint = 5287160221454703;
      const str = `${$.token}${$.fingerprint}${timestamp}${$.appId}${random}`;
      hash1 = $.CryptoJS.SHA512(str, $.token).toString($.CryptoJS.enc.Hex);
    }
    let st = '';
    stk.split(',').map((item, index) => {
      st += `${item}:${getUrlData(url, item)}${index === stk.split(',').length - 1 ? '' : '&'}`;
    })
    const hash2 = $.CryptoJS.HmacSHA256(st, hash1.toString()).toString($.CryptoJS.enc.Hex);
    // console.log(`\nst:${st}`)
    // console.log(`h5st:${["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2)].join(";")}\n`)
    return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2)].join(";"))
  } else {
    return '20210318144213808;8277529360925161;10001;tk01w952a1b73a8nU0luMGtBanZTHCgj0KFVwDa4n5pJ95T/5bxO/m54p4MtgVEwKNev1u/BUjrpWAUMZPW0Kz2RWP8v;86054c036fe3bf0991bd9a9da1a8d44dd130c6508602215e50bb1e385326779d'
  }
}

/**
 * 获取url参数值
 * @param url
 * @param name
 * @returns {string}
 */
function getUrlData(url, name) {
  if (typeof URL !== "undefined") {
    let urls = new URL(url);
    let data = urls.searchParams.get(name);
    return data ? data : '';
  } else {
    const query = url.match(/\?.*/)[0].substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] === name) {
        // return pair[1];
        return vars[i].substr(vars[i].indexOf('=') + 1);
      }
    }
    return ''
  }
}

/**
 * 模拟生成 fingerprint
 * @returns {string}
 */
function generateFp() {
  let e = "0123456789";
  let a = 13;
  let i = '';
  for (; a--;)
    i += e[Math.random() * e.length | 0];
  return (i + Date.now()).slice(0, 16)
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
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
