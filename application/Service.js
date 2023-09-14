import {readdir, readFile} from 'node:fs/promises';

const SERVICES_DIR = './services';

export const getServices = async () => {
    const services = [];
    for (const serviceName of (await readdir(SERVICES_DIR))) {
        services.push(
            JSON.parse(
                await readFile(
                    `${SERVICES_DIR}/${serviceName}/meta.json`,
                    { encoding: 'utf8' }
                )
            )
        );
    }
    return services;
};

export const logServicesInfo = (services) => {
    console.log(`Found services - ${services.length}`);
    services.forEach((service, index) => {
        const count = `${index + 1}) `;
        const offset = count.replace(/./g, ' ');
        console.log(`${count}${service.name} (v ${service.version})`);
        console.log(`${offset}${service.description}`);
        console.log(`${offset}Схемы: ${service.schemes.join(', ')}`);
    });
    console.log();
};

export const setServices = (app, services) => {
    app.post('/', async (req, res) => {
        res.header("Content-Type", "application/json; charset=utf-8");

        if (!req.body.hasOwnProperty('service')) {
            return res.sendStatus(400);
        }
        if (!req.body.hasOwnProperty('method')) {
            return res.sendStatus(400);
        }
        const serviceData = services.find((service) => service.name === req.body.service);
        if (!serviceData) {
            return res.status(404).send(`Unknown service ${req.body.service}`);
        }
        const [schemeName, methodName] = req.body.method.split('.');
        if (!serviceData.schemes.includes(schemeName)) {
            return res.status(404).send(`Unknown scheme ${schemeName}`);
        }
        const { methods } = await import(`../${SERVICES_DIR}/${serviceData.name}/${schemeName}/router.js`);
        const callback = methods[methodName];
        if (!callback) {
            return res.status(404).send(`Unknown method ${methodName}`);
        }
        const result = await callback(req.body.data);
        console.log(result);
        if (result) {
            res.end(JSON.stringify(result), 'utf-8');
        } else {
            res.sendStatus(200);
        }
    });
};
