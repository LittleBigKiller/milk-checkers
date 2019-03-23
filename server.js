var http = require('http')
var qs = require('querystring')
var fs = require('fs')
var PORT = 5500

var activeUsers = []

var server = http.createServer(function(req,res){
    console.log(req.method + ' ' + req.url)
    switch (req.method) {
        case 'GET':
            getResponse(req, res)
            break
        case 'POST':
            res.writeHead(200,{'content-type':'text/html; charset=utf-8'})
            postResponse(req, res)
            break
    } 
})

server.listen(PORT, function(){
    console.log('serwer startuje na porcie ' + PORT)
})

function getResponse(req, res) {
    if (req.url === '/favicon.ico') {
        fs.readFile(__dirname + '/static/img/logo.png', function (error, data) {
            res.writeHead(200, { 'Content-type': 'image/png; charset=utf-8' })
            res.write(data)
            res.end()
        })
    } else if (req.url.indexOf('.js') != -1) {
        fs.readFile(__dirname + '/static/' + decodeURI(req.url), function (error, data) {
            res.writeHead(200, { 'Content-type': 'aplication/javascript; charset=utf-8' })
            res.write(data)
            res.end()
        })
    } else if (req.url.indexOf('.css') != -1) {
        fs.readFile(__dirname + '/static/' + decodeURI(req.url), function (error, data) {
            res.writeHead(200, { 'Content-type': 'text/css; charset=utf-8' })
            res.write(data)
            res.end()
        })
    } else {
        fs.readFile(__dirname + '/static/index.html', function (error, data) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write(data)
            res.end()
        })
    }
}

function postResponse(req, res) {
    var reqData = '';
    var resData = {}

    req.on('data', function (data) {
        reqData += data;
    })

    req.on('end', function () {
        reqData = qs.parse(reqData)
        if (reqData.action == 'FIRST') {
            resData.albumNames = albumNames
            resData.albumId = 0

            fs.readdir(__dirname + '/static/mp3/' + albumNames[0], function(err, trackNames) {
                if (err) return console.error(err)

                resData.trackNames = trackNames

                resData.trackSizes = []
                for (let i in trackNames) {
                    resData.trackSizes.push(fs.statSync(__dirname + '/static/mp3/' + albumNames[0] + '/' + trackNames[i]).size)
                }
                res.end(JSON.stringify(resData))
            })
        } else if (reqData.action == 'LOGIN') {
            let resData = {id: -1}
            if (activeUsers.length == 2) {
                resData.header = 'GAME_FULL'
            } else if (activeUsers.includes(reqData.username)) {
                resData.header = 'NAME_TAKEN'
            } else {
                resData.id = activeUsers.length
                activeUsers.push(reqData.username)
                resData.header = 'USER_ADDED'
            }
            console.log(resData)
            res.end(JSON.stringify(resData))
        } else if (reqData.action == 'DBG_FLUSHTABLE') {
            console.log('DBG_FLUSHTABLE')
            activeUsers = []
            res.end('DBG: Table flushed')
        } else {
            console.error('Invalid request')
        }
    })
}