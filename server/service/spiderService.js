/**
 * Created by wenqi.chen on 2017/6/13.
 */

'use strict'
/**
 * 依赖库引入
 */
const http = require('http') // http服务模块
const superagent = require('superagent') // 客户端请求代理模块
const async = require('async')  // 异步模块
const eventproxy = require('eventproxy') // 并发模块
const ep = new eventproxy()
const opn = require('opn') // 打开浏览器
const cheerio = require('cheerio') // 类似jquery

/**
 * 全局变量初始化
 */
const baseUrl = 'http://www.80s.tw/movie/list'
let pageUrls = [] // 分页列表页面地址
let movieUrls = [] // 解析到的电影详情页地址
let movieInfo = [] // 电影下载链接
for(let i=1; i<5; i++){
    pageUrls.push(baseUrl+'/-----p'+i)
}

// 数据存储
const spiderDao = require('../dao/spiderDao')

let num = 0 // 记录并发数

/**
 * 注册爬虫服务
 * @param port
 */
function spiderServer (port){
    function requestPages(){
        // 启动并发请求
        pageUrls.forEach( (url) => {
            superagent
                .get(url)
                .end( (err, res) => {
                    ep.emit('pickPagesUrl', res.text)
                })
        })

        // 并发全部完成后调用 通过第一个参数关联，第二个参数为总请求数
        ep.after('pickPagesUrl',pageUrls.length,(resTxt) => {
            resTxt.map( (_res) => {
                let $ = cheerio.load(_res)
                let _urls = $('.me1 a')
                for(let i=0; i<_urls.length; i+=2){
                    movieUrls.push( 'http://www.80s.tw' + $(_urls[i]).attr('href') )
                }
            })

            // 启动并发获取电影下载链接函数
            requestMovies()
        });
    }

    function requestMovies(){
        // 启动并发请求
        movieUrls.forEach( (url) => {
            num++
            console.log('++当前并发数：',num)
            superagent
                .get(url)
                .end( (err, res) => {
                    num--
                    console.log('--当前并发数：',num)
                    ep.emit('pickDownloadUrl', res.text)
                })
        })

        // 并发全部完成后调用 通过第一个参数关联，第二个参数为总请求数
        ep.after('pickDownloadUrl',movieUrls.length,(resTxt) => {
            resTxt.map( (_res) => {
                let $ = cheerio.load(_res)
                //收集数据
                let downloadUrl = $('#myform .dlbutton1').find('a').attr('href')
                let name = $('#minfo h1').text()
                let img = $('#minfo .img img').attr('src')
                movieInfo.push({
                    'name' : name,
                    'downloadUrl' : downloadUrl,
                    'img':img
                })
            })
            console.log('Completed! Fatch '+ movieInfo.length +' in total.')
            spiderDao.saveMovie(movieInfo);
        });
    }

    console.log('Fatch server start at port:'+port)
    http.createServer(requestPages).listen(port)
}

/**
 * 启动爬虫
 * @param port
 */
function fetchStart (port){
    opn('http://localhost:' + port);
}

module.exports = {
    'fetchStart' : fetchStart,
    'spiderServer' : spiderServer
}