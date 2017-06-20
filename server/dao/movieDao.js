/**
 * Created by wenqi.chen on 2017/6/19.
 */
'use strict'

const fs = require('fs')

const dbPath = 'movie.json'
const everyPage = 12

let getFileFormPage = (page) => {
    // 同步获取数据
    let jsonData = fs.readFileSync(dbPath,'utf8')
    // 转成json类型
    let movieData = JSON.parse(jsonData)
    let movieLen = movieData.movies.length
    // 每页显示10个，得出分页数
    let pageNum = Math.ceil(movieLen / everyPage)

    // 返回新对象
    let result = {}
    result.movies = []
    result.totalPages = pageNum
    result.curPage = page

    // 循环上限，超过电影总数，显示电影总数
    let limit = (movieLen<everyPage*page)?movieLen:everyPage*page
    // 获取指定页码的文件
    for(let i=everyPage*(page-1); i < limit ; i++){
        result.movies.push(movieData.movies[i])
    }
    return result
}

let getFileByName = (name) => {
    // 同步获取数据
    let jsonData = fs.readFileSync(dbPath,'utf8')
    // 转成json类型
    let movieList = JSON.parse(jsonData)['movies']
    let reg = new RegExp(name,'g')
    let newList = movieList.filter(function(_t){
        if(reg.test(_t.name)){
            return _t
        }
    })

    let movieLen = newList.length
    // 每页显示10个，得出分页数
    let pageNum = Math.ceil(movieLen / everyPage)
    // 返回新对象
    let result = {}
    result.movies = newList
    result.searchWord = name
    result.totalPages = pageNum
    result.curPage = 1
    return result
}

module.exports = {
    'getFileFormPage' : getFileFormPage,
    'getFileByName' : getFileByName

}