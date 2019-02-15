const _ = require('lodash');
const { ValidationError, MoleculerError } = require('moleculer').Errors;
const { ResourceNotFoundError } = require('./errors');

module.exports = {
  /**
   * Default settings
   */
  settings: {
    model: null,
    fields: [],
    entityValidator: null
  },
  /**
   * Public methods which can be accessible by routes
   */
  actions: {
    /**
     * @method {GET /api/<service_name>}
     * @return {Array}
     */
    list: async ctx => {
      const { service } = ctx;
      const data = await service.settings.model.findAll();
      return service.sendResponse(data);
    },

    /**
     * @method {GET /api/<service_name>/:id}
     * @return {Object}
     */
    get: async ctx => {
      // service belongs to this service
      const { service } = ctx;

      const { id } = ctx.params;
      const data = await service.settings.model.findByPk(id);
      if (data == null) return service.sendError(ctx, new ResourceNotFoundError());
      return service.sendResponse(data);
    },

    /**
     * @method {POST /api/<service_name>}
     * @return {Object}
     */
    create: {
      async handler(ctx) {
        const { params, service } = ctx;

        return (
          service
            .validateEntity(params)
            // Apply idField
            .then(entity => service.settings.model.create(entity))
            .then(data => service.sendResponse(data))
        );
      }
    },

    /**
     * @method {PUT /api/<service_name>/:id}
     * @return {Object}
     */
    update: {
      async handler(ctx) {
        const { params, service } = ctx;

        const { id } = params;
        let entity;
        return service
          .validateEntity(params)
          .then(params => {
            entity = params;
            return service.settings.model.findByPk(id);
          })
          .then(data => {
            if (data == null) throw new ResourceNotFoundError();
            return data;
          })
          .then(data => data.update(entity))
          .catch(err => service.sendError(ctx, err));
      }
    },

    /**
     * @method {DELETE /api/<service_name>/:id}
     * @return {no content}
     */
    remove: {
      async handler(ctx) {
        const { params, service } = ctx;

        const { id } = params;
        return service.Promise.resolve()
          .then(() => service.settings.model.findByPk(id))
          .then(data => {
            if (data == null) throw new ResourceNotFoundError();
            return data;
          })
          .then(data => data.destroy())
          .then(() => service.sendResponse(undefined, 'Success', 204))
          .catch(err => service.sendError(ctx, err));
      }
    }
  },

  /**
   * Private methods
   */
  methods: {
    /**
     * Throw an error
     * @param {Context} ctx
     * @param {instance of object} error
     * @return {Promise}
     */
    sendError(ctx, error) {
      return ctx.service.Promise.reject(error);
    },

    sendResponse(data, message = 'Success', code = 200) {
      return {
        code,
        message,
        data
      };
    },

    /**
     * Validate an entity by validator.
     *
     * @param {any} entity
     * @returns {Promise}
     */
    validateEntity(entity) {
      // Pick whitelist fields
      entity = _.pick(entity, this.settings.fields);
      if (!_.isFunction(this.settings.entityValidator)) {
        return Promise.resolve(entity);
      }

      const entities = Array.isArray(entity) ? entity : [entity];
      return Promise.all(
        entities.map(entity => this.settings.entityValidator.call(this, entity))
      ).then(() => entity);
    }
  },

  /**
   * Service created lifecycle event handler
   */
  created() {
    // Checking model setting must be defined
    if (this.settings.model == null) {
      this.logger.error(`model inside "${this.name}" is null!`);
      throw new MoleculerError('Internal server error!', 501, 'ERR_SERVER');
    }

    // Transform entity validation schema to checker function
    if (
      this.broker.validator &&
      _.isObject(this.settings.entityValidator) &&
      !_.isFunction(this.settings.entityValidator)
    ) {
      const check = this.broker.validator.compile(this.settings.entityValidator);
      this.settings.entityValidator = entity => {
        const res = check(entity);
        if (res === true) return Promise.resolve();
        return Promise.reject(new ValidationError('Entity validation error!', null, res));
      };
    }
  }
};
