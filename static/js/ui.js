class Ui {
    constructor() {
        this.username = ''
        this.clicks()
        this.challengeInterval
    }

    clicks() {
        $('#login-dialog-confirm').on('click', this.loginHandler)
        $('#login-dialog-reset').on('click', this.resetHandler)
    }

    loginHandler() {
        ui.username = $('#login-dialog-input').val()
        net.login()
        net.checkTableState()
    }

    resetHandler() {
        net.flushUserTable()
        net.checkTableState()
    }

    updateHeader(res) {
        switch(res) {
            case 'USER_ADDED':
                $('#header').html(res + '<br>Witaj <b>' + ui.username + '</b>!')
                this.awaitChallenge()
            break
            case 'NAME_TAKEN':
                $('#header').html(res + '<br>Nazwa <b>' + ui.username + '</b> jest zajęta')
            break
            case 'GAME_FULL':
                $('#header').html(res + '<br>W grze jest już dwóch graczy')
            break
            default:
                $('#header').html(res + '<br>¯\\_(ツ)_/¯')
            break
        }
    }

    awaitChallenge() {
        $('#login-dialog').css('display', 'none')
        $('#await-dialog').removeAttr('style')
        this.challengeInterval = setInterval(net.awaitChallenge, 500)
    }

    resolveChallenge(numOfPlayers) {
        if (parseInt(numOfPlayers) == 2) {
            $('#lock-container').css('display', 'none')
            clearInterval(this.challengeInterval)

            game.init()
        }
    }

}