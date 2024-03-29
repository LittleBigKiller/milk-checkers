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
    }

    resetHandler() {
        net.flushUserTable()
    }

    updateHeader(res) {
        switch (res) {
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
            $('#await-dialog').css('display', 'none')
            $('#lock-container').css('display', 'none')
            $('#turn-dialog').css('display', 'none')
            clearInterval(this.challengeInterval)

            game.init()
        }
    }

    resolveWin(msg) {
        game.gameFinished = true
        $('#turn-dialog').css('display', 'none')
        $('#win-dialog').removeAttr('style')
        $('#lock-container').removeAttr('style')

        $('#win-dialog-header').html(msg)
    }

    turnLock(lock) {
        if (lock || game.gameFinished) {
            $('#lock-container').removeAttr('style')
            if (!game.gameFinished)
                $('#turn-dialog').removeAttr('style')
        } else {
            $('#lock-container').css('display', 'none')
            $('#turn-dialog').css('display', 'none')
        }
    }
}