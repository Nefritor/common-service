import https from 'https';
import http from 'http';
import WSExpress from 'express-ws';

import {getApplication} from './App.js';
import {getServices, logServicesInfo, setServices} from './Service.js';
import {openWebSocket} from './WebSocket.js';

export const createApplication = async ({ name, port }, ssl) => {
    const app = getApplication();

    const services = await getServices({ log: true });

    if (services.length) {
        logServicesInfo(services);

        const server = ssl
            ? https.createServer(ssl, app).listen(port, () => {
                console.log(`Application "${name}" started on ${port} (secured)`);
            })
            : http.createServer(app).listen(port, () => {
                console.log(`Application "${name}" started on ${port} (unsecured)`);
            });

        setServices(app, services);

        const wss = WSExpress(app, server).getWss();

        return [
            wss,
            (config) => openWebSocket(app, config)
        ];
    } else {
        console.warn(`Application "${name}" does not started. There is no known services exist.`);
    }
};


