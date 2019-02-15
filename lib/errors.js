const { MoleculerClientError } = require('moleculer').Errors;

/**
 * Resouce not found
 * @class ResourceNotFoundError
 * @extends {MoleculerClientError}
 */

class ResourceNotFoundError extends MoleculerClientError {
  /**
   * Creates an instance of ResourceNotFoundError.
   *
   * @param {String?} message
   *
   * @memberof ResourceNotFoundError
   */

  constructor(message = undefined) {
    super(message || 'Resource not found', 404, 'RESOURCE_NOT_FOUND');
  }
}

module.exports = {
  ResourceNotFoundError
};
