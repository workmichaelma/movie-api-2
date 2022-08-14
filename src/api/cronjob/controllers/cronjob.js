"use strict";

/**
 * A set of functions called "actions" for `cronjob`
 */

module.exports = {
  cronMovies: async (ctx, next) => {
    const data = await strapi.service("api::cronjob.cronjob").movie();

    try {
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  cronTvShows: async (ctx, next) => {
    const data = await strapi.service("api::cronjob.cronjob").tvshow();
    try {
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  fetchMovies: async (ctx, next) => {
    const data = await strapi.service("api::cronjob.movie").api();

    try {
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  fetchTvShows: async (ctx, next) => {
    const data = await strapi.service("api::cronjob.tvshow").api();
    try {
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
};
