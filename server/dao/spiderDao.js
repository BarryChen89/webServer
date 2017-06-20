/**
 * Created by wenqi.chen on 2017/6/19.
 */

'use strict'

const fs = require('fs')
let dbPath = 'movie.json'

/**
 * 存储下载地址
 */
let saveMovie = (movieInfo) => {
    let movieData = '{"movies":'+ JSON.stringify(movieInfo) +'}'
    fs.writeFile(dbPath, movieData, (err) => {
        if (err) throw err;
        console.log('File write completed !')
    });
}

module.exports = {
    'saveMovie' : saveMovie
}