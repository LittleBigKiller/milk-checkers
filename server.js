var http = require('http')
var qs = require('querystring')
var fs = require('fs')
var PORT = 5500

var activeUsers = []
var pawnTable = [
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
]
var winner = -1

function array_compare(a1, a2) {
    if (a1.length != a2.length) {
        return false;
    }
    for (var i in a1) {
        if (a1[i] instanceof Array && a2[i] instanceof Array) {
            if (!array_compare(a1[i], a2[i])) {
                return false;
            }
        }
        else if (a1[i] != a2[i]) {
            return false;
        }
    }
    return true;
}

function findWinner() {
    let p0Pawns = 0
    let p1Pawns = 0

    for (let i in pawnTable) {
        for (let j in pawnTable[i]) {
            if (pawnTable[i][j] == 1) {
                p1Pawns += 1
            } else if (pawnTable[i][j] == 2) {
                p0Pawns += 1
            }
        }
    }

    if (p0Pawns == 0) {
        winner = 1
    } else if (p1Pawns == 0) {
        winner = 0
    } else {
        winner = -1
    }
}



var server = http.createServer(function (req, res) {
    console.log(req.method + ' ' + req.url)
    switch (req.method) {
        case 'GET':
            getResponse(req, res)
            break
        case 'POST':
            res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
            postResponse(req, res)
            break
    }
})

server.listen(PORT, function () {
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
            res.writeHead(200, { 'Content-type': 'text/javascript; charset=utf-8' })
            res.write(data)
            res.end()
        })
    } else if (req.url.indexOf('.css') != -1) {
        fs.readFile(__dirname + '/static/' + decodeURI(req.url), function (error, data) {
            res.writeHead(200, { 'Content-type': 'text/css; charset=utf-8' })
            res.write(data)
            res.end()
        })
    } else if (req.url.indexOf('.png') != -1) {
        fs.readFile(__dirname + '/static/' + decodeURI(req.url), function (error, data) {
            res.writeHead(200, { 'Content-type': 'image/png; charset=utf-8' })
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

            fs.readdir(__dirname + '/static/mp3/' + albumNames[0], function (err, trackNames) {
                if (err) return console.error(err)

                resData.trackNames = trackNames

                resData.trackSizes = []
                for (let i in trackNames) {
                    resData.trackSizes.push(fs.statSync(__dirname + '/static/mp3/' + albumNames[0] + '/' + trackNames[i]).size)
                }
                res.end(JSON.stringify(resData))
            })
        } else if (reqData.action == 'LOGIN') {
            let resData = { id: -1 }
            if (activeUsers.length == 2) {
                resData.header = 'GAME_FULL'
            } else if (activeUsers.includes(reqData.username)) {
                resData.header = 'NAME_TAKEN'
            } else {
                resData.id = activeUsers.length
                activeUsers.push(reqData.username)
                resData.header = 'USER_ADDED'
                pawnTable = [
                    [2, 0, 2, 0, 2, 0, 2, 0],
                    [0, 2, 0, 2, 0, 2, 0, 2],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 0, 1, 0, 1, 0, 1, 0],
                    [0, 1, 0, 1, 0, 1, 0, 1],
                ]
            }
            console.log(resData)
            res.end(JSON.stringify(resData))

        } else if (reqData.action == 'DBG_FLUSHTABLE') {
            console.log('DBG_FLUSHTABLE')
            activeUsers = []
            pawnTable = [
                [2, 0, 2, 0, 2, 0, 2, 0],
                [0, 2, 0, 2, 0, 2, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 1, 0, 1],
            ]
            winner = -1
            res.end('DBG: Table flushed')

        } else if (reqData.action == 'WAIT-FOR-CHALLENGE') {
            console.log('WAIT-FOR-CHALLENGE')
            res.end('' + activeUsers.length)

        } else if (reqData.action == 'CHECK-WIN') {
            console.log('CHECK-WIN')
            res.end(JSON.stringify(winner))

        } else if (reqData.action == 'CHECK-TABLE-STATE') {
            console.log('CHECK-TABLE-STATE')
            res.end(JSON.stringify(pawnTable))

        } else if (reqData.action == 'PUSH-MOVE') {
            console.log('PUSH-MOVE')
            let table = JSON.parse(reqData.table)
            /* if (!array_compare(table, pawnTable)) {
                pawnTable = table
            } */
            pawnTable = table
            findWinner()
            res.end('Move Accepted')

        } else {
            console.error('Invalid request -- ' + reqData.action)
        }
    })
}