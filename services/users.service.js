const jwt = require('jsonwebtoken');
/**
 * Set expired for 1 hour
 * or you can simply use `1h`
 */
const EXPIRE_JWT = 60 * 60;

module.exports = {
  name: 'users',
  // JWT Setting for sign & decode token
  settings: {
    JWT_SECRET: 'WAHYOO_SECRET_KEY_38b7e0a838102dbe2dab00dd5a1df26c'
  },
  actions: {
    /**
     * Dummy login jwt secret
     * // FIXME: change the login with real user from database
     * @return {JWT Token}
     */
    login: {
      handler(ctx) {
        return jwt.sign(
          {
            username: 'my_username',
            email: 'email'
          },
          this.settings.JWT_SECRET,
          { expiresIn: EXPIRE_JWT }
        );
      }
    },
    /**
     * Check authorization request header
     * @return {Object user}
     * @param {string} token
     */
    resolveToken: {
      params: {
        token: 'string'
      },
      handler(ctx) {
        // FIXME: You can double check user from database with decoded token
        return new this.Promise((resolve, reject) => {
          return jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err, decoded) => {
            if (err) return reject(err);
            return resolve(decoded);
          });
        });
      }
    }
  }
};
