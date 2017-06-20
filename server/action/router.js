/**
 * Created by wenqi.chen on 2017/6/15.
 */
'use strict'
const express = require('express')
const router = express.Router()

const movieService = require('../service/movieService')
const spiderService = require('../service/spiderService')

// 路由中间件(每次路由请求都会触发)
router.use( (req, res, next) => {
    // 请求回调设置
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')

    console.log('Time: ',new Date());
    console.log('Client IP: ', getClientIp(req));
    next();
})

/**
 * 路由: /fetchMovie
 * 类型: get
 * 功能: 启动爬虫脚本
 */
router.get('/fetchMovie',(req,res) => {
    spiderService.fetchStart()
})

/**
 * 路由: /
 * 类型: get
 * 功能: 跳转login路由
 */
router.get('/', (req, res) => {
    res.redirect('login')
})

/**
 * 路由: /login
 * 类型: get
 * 功能: 后台渲染login页面，然后返回前端
 */
router.get('/login',(req,res) => {
    movieService.renderLoginPage(req,res)
})

/**
 * 路由: /list
 * 类型: get
 * 功能: 后台渲染list页面(默认显示第一页内容)，然后返回前端
 */
router.get('/list',(req,res) => {
    movieService.getFileList(req,res)
})

/**
 * 路由: /list/:page
 * 类型: get
 * 功能: 后台渲染list页面(根据传递的page参数获取数据)，然后返回前端
 */
router.get('/list/:page',(req,res) => {
    movieService.getFileList(req,res)
})

/**
 * 路由: /loginUser
 * 类型: post
 * 功能: 用户登录，成功:跳转list页; 失败:刷新页面
 */
router.post('/loginUser',(req,res) => {
    movieService.userLogin(req,res)
})

/**
 * 路由: /search
 * 类型: get
 * 功能: 后台渲染search页面，然后返回前端
 */
router.get('/search',(req,res) => {
    movieService.renderSearchPage(req,res)
})

/**
 * 路由: /searchFileByName
 * 类型: post
 * 功能: 根据传递的文件名，通过模糊查询后返回符合条件的数据
 */
router.post('/searchFileByName',(req,res) => {
    movieService.searchFileByName(req,res)
})

/**
 * 获取访问客户端IP地址
 * @param req
 * @returns {*|any|string}
 */
let getClientIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

module.exports = router