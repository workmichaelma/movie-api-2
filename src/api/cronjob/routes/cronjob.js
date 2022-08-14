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
      path: "/cronjob/fetch/movies",
      handler: "cronjob.fetchMovies",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/cronjob/fetch/tvshows",
      handler: "cronjob.fetchTvShows",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
