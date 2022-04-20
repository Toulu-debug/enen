/**
 * 测试使用人数
 * cron: 20 2 * * *
 */

const axios = require('axios')

axios.get(`https://api.jdsharecode.xyz/api/userNum?date=${new Date().getDate()}`)
  .then(res => {
    console.log(res.data)
  })
  .catch(err => {
    console.log(err)
  })