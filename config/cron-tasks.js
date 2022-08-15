module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  movie: {
    task: async ({ _strapi }) => {
      console.log("cron - movie", new Date());
      _strapi.api["cronjob"].services["cronjob"].movie();
    },
    options: {
      rule: "0 */5 * * * *",
    },
  },
  drama: {
    task: async ({ _strapi }) => {
      console.log("cron - drama", new Date());
      _strapi.api["cronjob"].services["cronjob"].drama();
    },
    options: {
      rule: "0 */5 * * * *",
    },
  },
};
