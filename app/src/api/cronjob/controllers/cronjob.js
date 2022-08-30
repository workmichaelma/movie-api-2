"use strict";

/**
 * A set of functions called "actions" for `cronjob`
 */

module.exports = {
  cronMovies: async (ctx, next) => {
    const {
      request: { query },
    } = ctx;
    const { isPart = null } = query;
    const part1 = ["hk", "tw", "jp"];
    const part2 = ["netflix", "kr"];
    const part3 = ["cn"];
    const part4 = ["us"];
    const regions =
      isPart === "1"
        ? part1
        : isPart === "2"
        ? part2
        : isPart === "3"
        ? part3
        : isPart === "4"
        ? part4
        : [...part1, ...part2, ...part3, ...part4];
    const data = await strapi.service("api::cronjob.cronjob").movie(regions);
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
  cronDramas: async (ctx, next) => {
    const {
      request: { query },
    } = ctx;
    const { isPart = null } = query;
    const part1 = ["hk", "korea"];
    const part2 = ["en", "us"];
    const part3 = ["jp", "tw"];
    const part4 = ["china"];
    const regions =
      isPart === "1"
        ? part1
        : isPart === "2"
        ? part2
        : isPart === "3"
        ? part3
        : isPart === "4"
        ? part4
        : [...part1, ...part2, ...part3, ...part4];
    const data = await strapi.service("api::cronjob.cronjob").drama(regions);
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
  fetchDramas: async (ctx, next) => {
    const data = await strapi.service("api::cronjob.drama").api();
    try {
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  fetchFeed: async (ctx, next) => {
    const {
      request: { query },
    } = ctx;
    let data = null;
    const { source = "", id = "", title = "", type } = query;
    if (type) {
      data = await strapi
        .service("api::cronjob.feed")
        .fetch({ source, id, title, type });
    }
    try {
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
};
