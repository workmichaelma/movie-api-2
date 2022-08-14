module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  movie: {
    task: async ({ _strapi }) => {
      _strapi.api["cronjob"].services["cronjob"].movie();
    },
    options: {
      rule: "* */20 * * * *",
    },
  },
  drama: {
    task: async ({ _strapi }) => {
      _strapi.api["cronjob"].services["cronjob"].drama();
    },
    options: {
      rule: "* */20 * * * *",
    },
  },
};
