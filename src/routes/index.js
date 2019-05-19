const { Router }  = require('express');
const router = Router();
const log = require('../log');

const routeSetup = UsersResource => {
  router.get('/users', async (req, res) => {
    const users = await UsersResource.getUsers();
    log.debug('[RouterSetup] /users %j:', users);
    res.json(users);
  });
  return router;
};

module.exports = routeSetup;