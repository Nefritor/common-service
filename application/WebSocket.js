import WSExpress from 'express-ws';

import {SERVICES_DIR} from './Constants.js';

export const getBroadcaster = (wss) =>
    (data, selector) => {
        wss.clients.forEach((client) => {
            if (!selector || selector(client)) {
                client.send(JSON.stringify(data));
            }
        });
    };

export const openWebSocket = (app, config) => {
    app.ws(config.url, (ws, req) => {
        config.onOpen(ws, req);
        ws.on('message', (msg) => {
            config.onMessage(ws, JSON.parse(msg));
        });
        ws.on('close', (code) => {
            config.onClose(ws, code);
        });
    });
};

export const setWebSockets = async (app, server, services) => {
    for (const service of services) {
        if (service.web_socket) {
            for (const webSocketName of service.web_socket) {
                const { configs } = await import(`../${SERVICES_DIR}/${service.name}/${webSocketName}/ws.js`);
                Object.entries(configs).forEach(([key, configs]) => {
                    if (!app.ws) {
                        WSExpress(app, server);
                    }
                    openWebSocket(app, {
                        url: [key, configs.params].join(''),
                        ...configs
                    });
                });
            }
        }
    }
};
