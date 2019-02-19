const { call: multipartform } = require('../lib/aliases');
// INFO about routes

// EXAMPLE REST methods =============
// 'GET posts': 'posts.list'
// 'GET posts/:id': 'posts.get',
// 'POST posts': 'posts.create',
// 'PUT posts/:id': 'posts.update',
// 'DELETE posts/:id': 'posts.remove'
// REST methods ======================

module.exports = {
  // Restful API for posts
  'REST posts': 'posts',
  'REST categories': 'categories',
  'POST login': 'users.login',
  'POST upload': (req, res) => multipartform(req, res, 'categories.upload')
};
