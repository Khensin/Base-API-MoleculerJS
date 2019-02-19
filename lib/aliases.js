const multiparty = require('multiparty');
const _ = require('lodash');

module.exports = {
  call: async (req, res, action) => {
    const form = new multiparty.Form();
    const params = await new Promise(resolve => {
      form.parse(req, (_err, fields, files) => {
        const combined = _.chain(fields)
          .assign(files)
          .mapValues(f => _.head(f))
          .value();
        resolve(combined);
      });
    });
    return req.$ctx.broker.call(action, params);
  }
};
