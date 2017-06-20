#!/usr/bin/env node
// shell

'use strict'
// 解析终端输入信息
var program = require('commander');
var webActions = require('./server/action/webActions');
var spiderService = require('./server/service/spiderService');
var spiderPort = 4000;

program
    .version('1.0.1')
    .option('-p, --port <port>','watch port')

program
    .command('start')
    .action(function(){
        var projectPort = program.port
        // 启动路由控制器
        webActions(projectPort);

        // 启动爬虫服务
        spiderService.spiderServer(spiderPort);
    })

program.parse(process.argv);