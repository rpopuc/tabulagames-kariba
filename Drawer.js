class Drawer {

    constructor(game, canvas) {
        this.canvas = canvas;
        this.game = game;
        this.ctx = this.canvas.getContext("2d");
        this.cardWidth = 112 / 2;
        this.cardHeight = 212 / 2;
        this.space = 20 / 2;

        this.canvas.addEventListener("mousedown", event => {
            if (event.button === 1) {
                const selectedCards = this.game.selectedCards.map((selected, index) => {
                    return selected ? index : -1
                }).filter(index => index >= 0)
                this.game.actionPlayCard(selectedCards)
                this.draw()
                return;
            }

            var area = {
                x: 50,
                y: (this.cardHeight * (4 + this.game.currentPlayer)) + (this.space * (this.game.currentPlayer * 2))
            }
            // Obtém as coordenadas x e y do clique do mouse
            var x = event.clientX;
            var y = event.clientY;

            // Calcula qual das cartas foi clicada
            var clickedCard = Math.floor((x - area.x) / (this.cardWidth + this.space));

            // Verifica se o clique foi dentro do intervalo de y das cartas
            if (y > area.y && y < area.y + this.cardHeight) {
                if (x > area.x + clickedCard * (this.cardWidth + this.space) && x < area.x + (clickedCard + 1) * (this.cardWidth + this.space) - this.space) {
                    this.game.selectedCards[clickedCard] = !this.game.selectedCards[clickedCard]
                    this.draw()
                }
            }
        });
    }

    draw() {
        this.clearCanvas()
        this.drawBoard()
        this.drawStacks()
        this.drawDeck()
        this.drawPlayerCards(0, 50, (this.cardHeight * 4))
        this.drawPlayerCards(1, 50, (this.cardHeight * 5 ) + (this.space * 2))
        this.drawCurrentPlayer()
        this.drawEndGame()
    }

    drawEndGame() {
        if (this.game.status !== 'END') {
            return;
        }
        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText("GAME END: " + this.game.winner.join(' and '), this.space * 2, ((this.cardHeight + this.space) * 3));
    }

    drawCurrentPlayer() {
        let x = 10
        let y = (this.cardHeight * (4 + this.game.currentPlayer)) + (this.space * (this.game.currentPlayer * 2)) + (this.cardHeight / 2 - 10)
        this.ctx.beginPath();

        // Move o cursor para o ponto inicial do triângulo
        this.ctx.moveTo(x, y);

        // Desenha a primeira linha do triângulo para a direita
        this.ctx.lineTo(x + 10, y + 10); // 10, 10

        // Desenha a segunda linha do triângulo para baixo
        this.ctx.lineTo(x, y + 20);

        // Fecha o caminho para preencher o triângulo
        this.ctx.closePath();

        // Preenche o triângulo com a cor preta
        this.ctx.fillStyle = "black";
        this.ctx.fill();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlayerCards(playerIndex, x, y) {
        this.game.players[playerIndex].forEach((value, index) => {
            let card = {
                x: x + (index * (this.cardWidth + this.space)),
                value, y,
                border: (playerIndex === this.game.currentPlayer && this.game.selectedCards[index]) ? 'red' : 'black'
            }
            this.drawCard(card)
        })

        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.game.collectedCards[playerIndex], x + ((this.cardWidth + this.space) * 6), y + (this.cardHeight / 2));
    }

    drawBoard() {
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;

        this.canvas.width = 9 * (this.cardWidth + this.space);
        this.canvas.height = 1000;

        for (var i = 0; i < 8; i++) {
            this.ctx.beginPath();
            this.ctx.rect(i*(this.cardWidth+this.space), 0, this.cardWidth, this.cardHeight);
            this.ctx.stroke();
        }
    }

    drawCard(card) {
        this.ctx.beginPath();
        this.ctx.moveTo(card.x + 20, card.y); // move o ponto de início da curva para o canto superior esquerdo da carta
        this.ctx.lineTo(card.x + this.cardWidth - 20, card.y); // desenha uma linha reta até o canto superior direito da carta
        this.ctx.arcTo(card.x + this.cardWidth, card.y, card.x + this.cardWidth, card.y + 20, 20); // desenha a curva para o canto superior direito da carta
        this.ctx.lineTo(card.x + this.cardWidth, card.y + this.cardHeight - 20); // desenha uma linha reta até o canto inferior direito da carta
        this.ctx.arcTo(card.x + this.cardWidth, card.y + this.cardHeight, card.x + this.cardWidth - 20, card.y + this.cardHeight, 20); // desenha a curva para o canto inferior direito da carta
        this.ctx.lineTo(card.x + 20, card.y + this.cardHeight); // desenha uma linha reta até o canto inferior esquerdo da carta
        this.ctx.arcTo(card.x, card.y + this.cardHeight, card.x, card.y + this.cardHeight - 20, 20); // desenha a curva para o canto inferior esquerdo da carta
        this.ctx.lineTo(card.x, card.y + 20); // desenha uma linha reta até o canto superior esquerdo da carta
        this.ctx.arcTo(card.x, card.y, card.x + 20, card.y, 20); // desenha a curva para o canto superior esquerdo da carta
        this.ctx.fillStyle = "gray";
        this.ctx.fill();
        this.ctx.strokeStyle = card.border ? card.border : 'black';
        this.ctx.stroke();

        this.ctx.fillStyle = "black";
        // this.ctx.font = this.space + "px Arial";
        // this.ctx.textAlign = "center";
        // this.ctx.fillText(card.value, card.x + this.cardWidth - 20, card.y + this.space);

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = parseInt( this.cardHeight / 2.5 ) + "px bold Arial";
        this.ctx.fillText(card.value, card.x + this.cardWidth / 2, card.y + this.cardHeight / 2);
    }

    drawDeck() {
        this.drawCard({
            x: (8 * (this.cardWidth + this.space)) + this.space,
            y: 0,
            value: this.game.deck.length,
        })
    }

    drawStacks() {
        for (var i = 1; i <= 8; i++) {
            for (var j = 0; j < this.game.table[i]; j++) {
                var value = i;
                var card = {x: 0, y: 0, value}
                this.ctx.beginPath();
                card.x = (i - 1)  * (this.cardWidth + this.space)
                card.y = j * this.space

                this.drawCard(card)
            }
        }
    }
}