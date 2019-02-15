const categoriesController = require('../controllers/categories.controller');

module.exports = {
  name: 'categories',
  mixins: [categoriesController]
};
