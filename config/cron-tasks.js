module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  "* */20 * * * *": ({ strapi }) => {
    strapi.api["cronjob"].services["cronjob"].movie();
  },
  "* */20 * * * *": ({ strapi }) => {
    strapi.api["cronjob"].services["cronjob"].drama();
  },
};
