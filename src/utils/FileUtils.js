const fs = window.require('fs').promises
// const path = require('path')

export const mapArr=(arr)=>{
    return arr.reduce((map,item)=>{
        map[item.id]=item
        return map
    },{})
}

export const objToArr=(obj)=>{
    return Object.keys(obj).map(key=>obj[key])
}

export const readFile = (path) => {
    return fs.readFile(path, 'utf-8')
}
//测试
// const testFilePath=path.join(__dirname,'rename.md')
// log(testFilePath)
// readFile(testFilePath)
// .then((data)=>{
//     log(data)
// })

export const writeFile = (path, content) => {
    return fs.writeFile(path, content, 'utf-8')
}

// const testWritePath=path.join(__dirname,'test.md')
// writeFile(testWritePath,'## 二级标题')
// .then(()=>{
//     log('写入成功！')
// })

export const renameFile = (path, newPath) => {
    return fs.rename(path, newPath)
}

// const newPath=path.join(__dirname,'rename.md')
// renameFile(testFilePath,newPath).then(()=>{
//     log('重命名成功')
// })

export const deleteFile = (path) => {
    return fs.unlink(path)
}

// deleteFile(testFilePath).then(()=>{
//     log('删除成功')
// })







