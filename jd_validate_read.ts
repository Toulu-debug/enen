import {readFile} from 'fs'

readFile('./validate.txt', 'utf-8', (err, data: any) => {
  if (err) {
    console.log(err)
    if (err.message === "ENOENT: no such file or directory, open './validate.txt'") {
      console.log('找不到validate.txt')
    }
  }
  data = data.split('\n')
  data.pop()
  data.forEach((item: string, index: number) => {
    console.log(++index, item)
  })
})
