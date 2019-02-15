const postController = require('../controllers/posts.controller');

module.exports = {
  name: 'posts',
  mixins: [postController]
};
