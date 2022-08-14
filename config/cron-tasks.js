module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  "* */5 * * * *": ({ strapi }) => {
    strapi.api["cronjob"].services["cronjob"].movie();
  },
  "* */5 * * * *": ({ strapi }) => {
    strapi.api["cronjob"].services["cronjob"].drama();
  },
};
