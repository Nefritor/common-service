import minimist from 'minimist';
import {readFile} from 'node:fs/promises';
import {createApplication} from './application/Express.js';

const { secured = false } = minimist(process.argv.splice(2));

const appConfig = {
    name: 'Common Service',
    port: 8443
};

if (secured) {
    appConfig.ssl = {
        key: await readFile('./ssl/privatekey.pem'),
        cert: await readFile('./ssl/certificate.pem')
    };
}

createApplication(appConfig);

