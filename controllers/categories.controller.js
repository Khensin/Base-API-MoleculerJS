const _ = require('lodash');
// const { ValidationError } = require('moleculer').Errors;
// const { ResourceNotFoundError } = require('../lib/errors');
const { Post: model } = require('../db/models');
const SequelizeResource = require('../lib/sequelize.resource');

module.exports = {
  settings: {
    // model is required
    model,
    // Whitelist fields and params
    fields: ['name'],
    // Validate the fields
    entityValidator: {
      name: {
        type: 'string',
        min: 5,
        required: true
      }
    }
  },
  mixins: [SequelizeResource],
  actions: {
    get(ctx) {
      const { service } = ctx;
      return service.sendResponse([
        {
          name: 'Override Dummy Category'
        }
      ]);
    }
  }
};
