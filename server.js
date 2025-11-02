
const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const wss = new WebSocketServer({ server });

const ROWS = 100, COLS = 100, SHADES = 5, DELAY = 100;
const TOTAL = ROWS * COLS;
let counter = Array(TOTAL).fill(0);

function incrementCounter() {
    let i = 0;
    while (i < counter.length) {
        if (counter[i] + 1 < SHADES) {
            counter[i]++;
            break;
        } else {
            counter[i] = 0;
            i++;
        }
    }
}

setInterval(() => {
    incrementCounter();
    const data = JSON.stringify({ counter });
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(data);
        }
    });
}, DELAY);

wss.on('connection', ws => {
    ws.send(JSON.stringify({ counter }));
});
