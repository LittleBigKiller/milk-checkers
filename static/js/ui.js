class Ui {
    constructor() {
        this.username = ''
        this.clicks()
    }
    clicks() {
        $('#login-dialog-confirm').on('click', this.loginHandler)
        $('#login-dialog-reset').on('click', this.resetHandler)
    }

    loginHandler(e) {
        ui.username = $('#login-dialog-input').val()
        console.log(ui.username)
        net.login()
        console.log('LMAO')
        //this.removeEventListener('click', ui.loginHandler)
    }

    resetHandler() {
        net.flushUserTable()
        console.log('LMAO')
    }

    updateHeader(res) {
        switch(res) {
            case 'USER_ADDED':
                $('#header').html(res + '<br>Witaj <b>' + ui.username + '</b>!')
            break
            case 'NAME_TAKEN':
                $('#header').html(res + '<br>Nazwa <b>' + ui.username + '</b> jest zajęta')
            break
            case 'GAME_FULL':
                $('#header').html(res + '<br>W grze jest już dwóch graczy')
            break
            default:
                $('#header').html(res + '<br>Co to za response? ¯\\_(ツ)_/¯')
            break
        }
    }

}