module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  "* * */6 * * *": async () => {
    try {
      strapi.api.cronjob.services.cronjob.movie();
    } catch (err) {
      console.log(err, "Failed to cronjob movie");
    }
  },
  "* * */5 * * *": async () => {
    try {
      strapi.api.cronjob.services.cronjob.drama();
    } catch (err) {
      console.log(err, "Failed to cronjob drama");
    }
  },
};
