/*
闪购盲盒互助码
 */

let SgmhShareCodes = [
]

if (process.env.SGMHSHARECODES) {
  if (process.env.SGMHSHARECODES.indexOf('&') > -1) {
    console.log(`您的闪购盲盒互助码选择的是用&隔开\n`)
    SgmhShareCodes = process.env.SGMHSHARECODES.split('&');
  } else if (process.env.SGMHSHARECODES.indexOf('\n') > -1) {
    console.log(`您的闪购盲盒互助码选择的是用换行隔开\n`)
    SgmhShareCodes = process.env.SGMHSHARECODES.split('\n');
  } else {
    SgmhShareCodes = process.env.SGMHSHARECODES.split();
  }
} else {
  console.log(`由于您环境变量(SGMHSHARECODES)里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < SgmhShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['PetShareCode' + index] = SgmhShareCodes[i];
}