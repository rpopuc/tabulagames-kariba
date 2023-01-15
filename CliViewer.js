class GameViewer {

    constructor(game) {
        this.game = game;
    }

    show() {
        console.log('');
        this.showDeck();
        this.showTable();
        this.showPlayers();
        this.showWinner();
        console.log('');
    }

    showWinner() {
        if (this.game.status !== 'END') {
            return
        }

        console.log('Winner: ' + this.game.winner.join(' and '))
    }

    showPlayers() {
        const indexes = '⁰¹²³⁴⁵⁶⁷';
        for (let playerIndex = 0; playerIndex < this.game.players.length; playerIndex++) {
            let line = []
            let isCurrentPlayer = (playerIndex === this.game.currentPlayer) ? '*' : ' '
            let playerScore = this.game.collectedCards[playerIndex]
            line.push(`[${playerIndex}${isCurrentPlayer}]`)
            this.game.players[playerIndex].forEach((value, index) => {
                line.push(indexes[index] + value)
            })
            line.push(`- [${playerScore}]`)
            console.log(line.join(' '))
        }
    }

    showDeck() {
        console.log('Cards: ' + this.game.deck.length + ' ' + this.game.status)
    }

    showTable() {
        let line = []
        for (let index = 1; index <= 8; index++) {
            const value = this.game.table[index];
            line.push(`[${index}:${value}]`);
        }
        console.log(line.join(' '))
    }
}
