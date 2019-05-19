const log = require('./src/log');
const { setupApp } = require('./src/app');
const config = require('config');

setupApp()
  .then(app => {
    app.listen(config.get('port'), () => {
       log.info(`[setupApp] app running on port ${config.get('port')}`);
    });
  }).catch(error => {
    log.error('[setupApp] error: ',error);
    process.exit(1); // eslint-disable-line
  });