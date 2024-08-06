import express from 'express';
import cors from 'cors';
import http from 'http';
import {networkInterfaces} from 'os';

const PORT = 3333;

const app = express();

app.use(express.json());
app.use(cors());

http.createServer(app).listen(PORT, () => {
    console.log();
    console.log(`Telegram bot started on ${PORT}`);
});

app.get('/', (req, res) => {

});

console.log(networkInterfaces());

/*axios({
    method: 'post',
    url: 'https://api.telegram.org/6033588326:AAGVUVWd6up8swbjKWqCbnx6HS3eDjySZVA/setWebhook',
    data: {
        url: `${window.location.hostname}:${PORT}`
    }
}).then((res) => {
    console.log(res.data)
});*/
