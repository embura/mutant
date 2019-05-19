const express = require('express');
const bodyParser = require('body-parser');
const routeSetup = require('./routes');
const Users = require('./resources/users');
const app = express();

const setupApp = async (resources = new Users()) => {
    app.use(bodyParser.json());
    app.use('/', routeSetup(resources));
    return app;
};
  
module.exports = {
    setupApp
};