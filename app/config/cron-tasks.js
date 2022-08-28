module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  "0 14 * * *": async () => {
    try {
      console.log("Cronjob - movie: ", new Date());
      strapi.api.cronjob.services.cronjob.movie();
    } catch (err) {
      console.log(err, "Failed to cronjob movie");
    }
  },
  "0 13 * * *": () => {
    try {
      console.log("Cronjob - drama: ", new Date());
      strapi.api.cronjob.services.cronjob.drama();
    } catch (err) {
      console.log(err, "Failed to cronjob drama");
    }
  },
  "0 12 * * *": () => {
    try {
      console.log("Cronjob - tvshow: ", new Date());
      strapi.api.cronjob.services.cronjob.tvshow();
    } catch (err) {
      console.log(err, "Failed to cronjob tvshow");
    }
  },
};
