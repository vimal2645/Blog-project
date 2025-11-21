'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;
    
    const entries = await strapi.entityService.findMany('api::article.article', {
      ...query,
      sort: { publishedAt: 'desc' },
    });

    return entries;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    
    const entry = await strapi.entityService.findOne('api::article.article', id);

    return entry;
  },
}));
