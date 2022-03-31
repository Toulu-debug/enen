const axios = require('axios')

axios.get('https://api.jdsharecode.xyz/api/userNum').then(_ => {
  console.log('ok')
}).catch(e => {
  console.log(e)
})