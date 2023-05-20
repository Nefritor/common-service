import express from 'express';
import cors from 'cors';

export const getApplication = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    return app;
}

export const setAppRoutes = (app, routes) => {
    routes.forEach((route) => {
        switch (route.type) {
            case 'get':
                app.get(route.url, processRequest(route.callback));
                break;
            case 'post':
                app.post(route.url, processRequest(route.callback));
                break;
            default:
                throw new Error(`Invalid route type: ${route.type}`);
        }
    })
}

const processRequest = (callback) => {
    return (req, res) => {
        res.header("Content-Type", "application/json; charset=utf-8")
        callback({
            data: req.body,
            send: (data) => {
                return res.end(JSON.stringify(data), 'utf-8');
            },
            sendStatus: (statusCode, statusMessage) => {
                if (!statusMessage) {
                    return res.sendStatus(statusCode);
                }
                return res.status(statusCode).send(statusMessage);
            }
        })
    }
}
