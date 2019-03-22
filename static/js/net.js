class Net {
    constructor() {

    }

    login() {
        console.error(ui.username)
        $.ajax({
            data: {
                action: 'LOGIN',
                username: ui.username,
            },
            type: 'POST',
            success: function (data) {
                console.warn(data)
                ui.updateHeader(data)
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
}