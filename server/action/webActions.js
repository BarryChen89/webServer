/**
 * Created by wenqi.chen on 2017/6/15.
 */
'use strict'
/**
 * Created by wenqi.chen on 2017/6/15.
 */
const express = require('express')
const app = express()
const bodyParser = require('body-parser') // 获取post请求内容
const cors = require('cors') // handle 跨域请求
const opn = require('opn')
const ejs = require('ejs')
const router = require('./router')

module.exports = function(port){
    app.use(bodyParser.json()) // 解析post请求传参
    app.use(bodyParser.urlencoded( { extended: false }))
    app.use(cors()) // 设置跨域支持
    app.set('views', './public/views') // 设置模板根目录
    app.set('view engine', 'ejs') // 设置模板解析
    app.use('/public',express.static('./public')) // 设置静态资源请求根目录
    app.use('/',router) // 设置路由

    app.listen(port,(err) => {
        if(err){
            console.log(err)
            return
        }
        console.log('WebServer start at port:',port)
        opn('http://localhost:' + port);
    })

    // express 封装http模块方法
    // app.listen = function listen() {
    //     var server = http.createServer(this);
    //     return server.listen.apply(server, arguments);
    // };
}