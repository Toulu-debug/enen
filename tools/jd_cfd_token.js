/*
 http-request
 ^https:\/\/m\.jingxi\.com\/jxbfd\/user\/CashOut.*
 */
let url = $request.url

if (url.indexOf('user/CashOut') > -1) {
  console.log('--------------')
  console.log(`strPgUUNum: ${getQueryString('strPgUUNum')}`)
  console.log(`strPgtimestamp: ${getQueryString('strPgtimestamp')}`)
  console.log(`strPhoneID: ${getQueryString('strPhoneID')}`)
  console.log('--------------')
}

function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = url.split('?')[1].match(reg);
  if (r != null) return unescape(r[2]);
  return '';
}
