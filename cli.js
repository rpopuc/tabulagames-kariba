const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

void async function main() {

    const game = new Game(2);
    const viewer = new GameViewer(game);

    game.setup();
    viewer.show();
    while (game.status !== 'END') {
        const response = await askQuestion("Cards?\n");
        const cards = response.split('').map(value => parseInt(value));
        game.actionPlayCard(cards);
        viewer.show();
    }
}()
