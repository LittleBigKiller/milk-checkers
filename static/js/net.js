class Net {
    constructor() {

    }

    login() {
        $.ajax({
            data: {
                action: 'LOGIN',
                username: ui.username,
            },
            type: 'POST',
            success: function (data) {
                data = JSON.parse(data)
                let header = data.header
                let playerId = data.id
                ui.updateHeader(header)
                game.setupCamera(playerId)
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.log(xhr)
            },
        })
    }

    flushUserTable() {
        $.ajax({
            data: {
                action: 'DBG_FLUSHTABLE',
            },
            type: 'POST',
            success: function (data) {
                console.log(data)
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.log(xhr)
            },
        })
    }

    awaitChallenge() {
        /* console.log('awaitChallenge') */
        $.ajax({
            data: {
                action: 'WAIT-FOR-CHALLENGE',
            },
            type: 'POST',
            success: function (data) {
                /* console.log(data) */
                ui.resolveChallenge(data)
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.log(xhr)
            },
        })
    }

    checkWin() {
        /* console.log('checkTableState') */
        $.ajax({
            data: {
                action: 'CHECK-WIN',
            },
            type: 'POST',
            success: function (data) {
                if (data != -1) {
                    game.gameFinished = true
                    if (data == game.PID)
                        ui.resolveWin('Wygrałeś!')
                    else {
                        game.gameFinished = true
                        net.checkTableState()
                        ui.resolveWin('Przegrałeś!')
                    }
                } else {
                    net.checkTableState()
                }
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.log(xhr)
            },
        })
    }

    checkTableState() {
        /* console.log('checkTableState') */
        $.ajax({
            data: {
                action: 'CHECK-TABLE-STATE',
                pid: game.PID
            },
            type: 'POST',
            success: function (data) {
                /* console.log(JSON.parse(data)) */
                let read = JSON.parse(data)
                console.warn(read)
                game.resolveTableState(read.table, read.giveMove) // read.giveMove == undefined?
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.log(xhr)
            },
        })
    }

    pushMove(gameTable, move) {
        /* console.log('pushMove') */
        $.ajax({
            data: {
                action: 'PUSH-MOVE',
                table: JSON.stringify(gameTable),
                giveMove: move,
                pid: game.PID
            },
            type: 'POST',
            success: function (data) {
                /* console.log(data) */
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.log(xhr)
            },
        })
    }

    acceptTurn() {
        $.ajax({
            data: {
                action: 'ACCEPT-TURN',
                table: JSON.stringify(gameTable),
                giveMove: move
            },
            type: 'POST',
            success: function (data) {
                /* console.log(data) */
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.log(xhr)
            },
        })
    }
}