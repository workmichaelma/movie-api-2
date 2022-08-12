module.exports = {
  routes: [
    {
      method: "GET",
      path: "/cronjob/movies",
      handler: "cronjob.fetchMovies",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/cronjob/tvshows",
      handler: "cronjob.fetchTvShows",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
