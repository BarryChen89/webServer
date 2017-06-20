/**
 * Created by wenqi.chen on 2017/6/19.
 */
'use strict'
const movieDao = require('../dao/movieDao')

let renderLoginPage = (req,res) => {
    res.render('login', { title: '欢迎登录' })
}

let getFileList  = (req,res) => {
    // let idx = req.params.page || 1
    // let newData = movieDao.getFileFormPage(idx)
    // res.render('list', newData)
    res.redirect('/public/views/list.html')
}

let userLogin = (req,res) => {
    let body = req.body
    if(body.userName == "cwq" && body.userPwd == "123456"){
        res.redirect('list')
    }else{
        res.render('login', { title: 'login in' })
    }
}

let renderSearchPage = (req,res) => {
    res.render('search',{ title : '搜索电影'})
}

let searchFileByName = (req,res) => {
    let body = req.body
    let fileData = movieDao.getFileByName(body.movieName)
    res.send(fileData)
}
module.exports = {
    'renderLoginPage' : renderLoginPage,
    'getFileList' : getFileList,
    'userLogin' : userLogin,
    'renderSearchPage' : renderSearchPage,
    'searchFileByName' : searchFileByName
}