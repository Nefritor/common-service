import https from 'https';
import http from 'http';
import WSExpress from 'express-ws';

import {getApplication} from './App.js';
import {getServices, setServices, logServicesInfo} from './Service.js';
import {getBroadcaster, openWebSocket} from './WebSocket.js';

export const createApplication = async ({name, port, ssl}) => {
    const app = getApplication();

    const services = await getServices({log: true});

    if (services.length) {
        logServicesInfo(services);

        const server = ssl
            ? https.createServer(ssl, app).listen(port, () => {
                console.log(`Application "${name}" started on ${port} (secured)`);
            })
            : http.createServer(app).listen(port, () => {
                console.log(`Application "${name}" started on ${port} (unsecured)`);
            });

        const wss = WSExpress(app, server).getWss();

        const broadcast = getBroadcaster(wss);

        setServices(app, services);

        return [
            wss,
            broadcast,
            (config) => openWebSocket(app, config)
        ];
    } else {
        console.warn(`Application "${name}" does not started. There is no known services exist.`)
    }
}


