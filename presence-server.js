// simple presence server using ws
const WebSocket = require('ws');
const port = process.env.PORT || 4000;
const wss = new WebSocket.Server({ port });

let count = 0;

function broadcastCount() {
  const msg = JSON.stringify({ type: 'presence', count });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

wss.on('connection', (ws) => {
  count++;
  broadcastCount();

  // send current count immediately
  ws.send(JSON.stringify({ type: 'presence', count }));

  ws.on('close', () => {
    count = Math.max(0, count - 1);
    broadcastCount();
  });
});

console.log(`presence-server running on port ${port}`);
