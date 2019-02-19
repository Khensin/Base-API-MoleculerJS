const { Post: model } = require('../db/models');
const SequelizeResource = require('../lib/sequelize.resource');

module.exports = {
  settings: {
    // model is required
    model,
    // Whitelist fields and params
    fields: ['title', 'body', 'categoryId'],
    // Validate the fields
    entityValidator: {
      title: {
        type: 'string',
        min: 5,
        required: true
      },
      categoryId: {
        type: 'number',
        retuired: true
      },
      body: {
        type: 'string',
        required: true
      }
    }
  },
  mixins: [SequelizeResource]
};
