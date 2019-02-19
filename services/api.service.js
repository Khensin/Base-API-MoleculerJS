const ApiGateway = require('moleculer-web');

const { UnAuthorizedError } = ApiGateway.Errors;
const _ = require('lodash');
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
        authorization: true,
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
        extended: true
      }
    }
  },

  /**
   * Authorize user if setting in routes set to true
   */
  methods: {
    authorize(ctx, route, req, res) {
      // Get token from header request
      if (req.headers.authorization) {
        const [_type, token] = req.headers.authorization.split(' ');

        return this.Promise.resolve(token)
          .then(token => {
            if (token) {
              // Verify token JWT
              return ctx
                .call('users.resolveToken', { token })
                .then(user => {
                  if (user) {
                    // Reduce user fields, and it will be transfered to other nodes
                    // TODO: Pick default fields to be shared to other nodes
                    ctx.meta.user = _.pick(user, []);
                    ctx.meta.token = token;
                    ctx.meta.userID = user.id;
                  }
                  return user;
                })
                .catch(() => null);
            }
            return null;
          })
          .then(user => {
            if (req.$action.auth === 'required' && !user)
              return this.Promise.reject(new UnAuthorizedError());
            return this.Promise.resolve(user);
          });
      }
      if (req.$action != null && req.$action.auth === 'required')
        return this.Promise.reject(new UnAuthorizedError());
      return this.Promise.resolve();
    }
  },
  started() {
    this.logger.info(`WWW server started on port ${this.settings.port}`);
  }
};
