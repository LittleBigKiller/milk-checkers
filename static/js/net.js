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
}