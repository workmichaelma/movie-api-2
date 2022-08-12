"use strict";

/**
 * A set of functions called "actions" for `cronjob`
 */

module.exports = {
  fetchMovies: async (ctx, next) => {
    const data = await strapi.service("api::cronjob.movie").init();
    try {
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  fetchTvShows: async (ctx, next) => {
    const data = await strapi.service("api::cronjob.tvshow").init();
    try {
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
};
