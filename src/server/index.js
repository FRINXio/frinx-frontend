const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const odlAPI = require('../api/odl');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(express.static('public'));
app.use('/api/odl', bodyParser.json(), odlAPI);

let server = app.listen(process.env.NODE_PORT || 3001, process.env.NODE_HOST || "localhost", function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Server is listening at http://%s:%s', host, port);
    if (process.send) {
        process.send('online');
    }
});




