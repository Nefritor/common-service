export const getBroadcaster = (wss) =>
    (data, selector) => {
        wss.clients.forEach((client) => {
            if (!selector || selector(client)) {
                client.send(JSON.stringify(data));
            }
        })
    }

export const openWebSocket = (app, config) => {
    app.ws(config.url, (ws, req) => {
        config.onOpen(ws, req);
        ws.on('message', (msg) => {
            config.onMessage(ws, JSON.parse(msg));
        });
        ws.on('close', (code) => {
            config.onClose(ws, code);
        })
    })
}
