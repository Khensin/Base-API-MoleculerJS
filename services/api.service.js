const ApiGateway = require('moleculer-web');
const aliases = require('../config/routes');

module.exports = {
  name: 'api',
  mixins: [ApiGateway],

  // More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
  settings: {
    port: process.env.PORT || 3000,

    routes: [
      {
        path: '/api',
        whitelist: [
          // Access to any actions in all services under "/api" URL
          '**'
        ],
        aliases
      }
    ],

    // Serve assets from "public" folder
    assets: {
      folder: 'public'
    },
    // Parse body content
    bodyParsers: {
      json: {
        strict: false
      },
      urlencoded: {
        extended: false
      }
    }
  },
  started() {
    this.logger.info(`WWW server started on port ${this.settings.port}`);
  }
};
