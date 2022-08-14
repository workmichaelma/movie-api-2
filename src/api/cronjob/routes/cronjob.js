module.exports = {
  routes: [
    {
      method: "GET",
      path: "/cronjob/cron/movies",
      handler: "cronjob.cronMovies",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/cronjob/cron/tvshows",
      handler: "cronjob.cronTvShows",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/cronjob/cron/dramas",
      handler: "cronjob.cronDramas",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/cronjob/fetch/movies",
      handler: "cronjob.fetchMovies",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/cronjob/fetch/dramas",
      handler: "cronjob.fetchDramas",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/cronjob/fetch/dramas",
      handler: "cronjob.fetchDramas",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
