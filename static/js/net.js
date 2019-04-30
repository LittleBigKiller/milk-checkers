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
        console.log('awaitChallenge')
        $.ajax({
            data: {
                action: 'WAIT-FOR-CHALLENGE',
            },
            type: 'POST',
            success: function (data) {
                console.log(data)
                ui.resolveChallenge(data)
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.log(xhr)
            },
        })
    }

    checkTableState() {
        console.log('checkTableState')
        $.ajax({
            data: {
                action: 'CHECK-TABLE-STATE',
            },
            type: 'POST',
            success: function (data) {
                console.log(JSON.parse(data))
                game.resolveTableState(JSON.parse(data))
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.log(xhr)
            },
        })
    }

    pushMove(gameTable) {
        console.log('pushMove')
        $.ajax({
            data: {
                action: 'PUSH-MOVE',
                table: JSON.stringify(gameTable),
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
}