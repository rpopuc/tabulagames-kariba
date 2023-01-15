class Game {

    constructor(numberOfPlayers) {
        this.table = [];
        this.deck = [];
        this.players = [];
        this.numberOfPlayers = numberOfPlayers;
        this.currentPlayer = 0;
        this.collectedCards = [];
        this.status = 'WAITING_SETUP';
        this.winner = []
        this.selectedCards = []
    }

    setup() {
        if (this.status !== 'WAITING_SETUP') {
            return;
        }

        this.setupDeck();
        this.setupPlayers();
        this.shuffleDeck();
        this.distributeInitialCards();
        this.setupTable();
        this.setupCurrentPlayer();
        this.status = 'WAITING_PLAYER';
    }

    setupPlayers() {
        for (let i = 1; i <= this.numberOfPlayers; i++) {
            this.players.push([]);
            this.collectedCards.push(0);
        }
    }

    setupCurrentPlayer() {
        this.currentPlayer = 0;
    }

    setupDeck() {
        // Cria o baralho com as 64 cartas
        let deck = [];
        for (let i = 1; i <= 8; i++) {
            deck = deck.concat(Array(8).fill(i));
        }

        this.deck = deck;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    distributeInitialCards() {
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.distributeCards(i, 5);
        }
    }

    setupTable() {
        this.table = [];
        for (let i = 1; i <= 8; i++) {
            this.table[i] = 0;
        }
    }

    distributeCards(playerId, numberOfCards) {
        for (let j = 0; j < numberOfCards; j++) {
            if (this.deck.length === 0) {
                return;
            }
            this.players[playerId].push(this.deck.shift());
        }
    }

    actionPlayCard(cards) {
        if (this.status !== 'WAITING_PLAYER') {
            throw new Error('Invalid action PlayCard for status: ' + this.status);
        }

        if (cards.length === 0) {
            throw new Error('No cards are informed to play');
        }

        const cardValue = this.players[this.currentPlayer][cards[0]];
        this.putCardsOnTable(this.currentPlayer, cards);
        this.collectCards(this.currentPlayer, cardValue);
        this.refillPlayersHand(this.currentPlayer);
        this.verifyGameEnd();
        this.changeCurrentPlayer();
    }

    changeCurrentPlayer() {
        this.currentPlayer = (this.currentPlayer + 1 ) % this.numberOfPlayers;
        this.selectedCards = new Array(this.players[this.currentPlayer].length).fill(false)
    }

    verifyGameEnd() {
        if (this.players[this.currentPlayer].length !== 0) {
            return;
        }

        this.status = 'END';
        console.log('GAME END')
        let scores = {}
        for (let i = 0; i < this.players.length; i++) {
            const points = this.collectedCards[i]
            if (!scores[points]) {
                scores[points] = [i]
            } else {
                scores[points].push(i);
            }
        }

        const maxScore = Math.max(...Object.keys(scores))
        this.winner = scores[maxScore];
    }

    refillPlayersHand(playerIndex) {
        this.distributeCards(
            playerIndex,
            Math.max(0, 5 - this.players[playerIndex].length)
        );
    }

    collectCards(playerIndex, card) {
        if (this.table[card] < 3) {
            return;
        }

        if (card === 1 && this.table[8] > 0) {
            this.collectedCards[playerIndex] += this.table[8];
            this.table[8] = 0;
            return;
        }

        // Itera sobre as filas inferiores à carta jogada e coleta as cartas
        for (let i = card - 1; i > 0; i--) {
            if (this.table[i] === 0) {
                continue;
            }

            this.collectedCards[playerIndex] += this.table[i];
            this.table[i] = 0;
            break;
        }
    }

    putCardsOnTable(playerIndex, cards) {
        this.players[playerIndex] = this.players[playerIndex].filter((card, index) => {
            if (!cards.includes(index)) {
                return true;
            }

            this.table[card]++;
            return false;
        })
    }
}

