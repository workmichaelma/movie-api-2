module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // "* * */6 * * *": async () => {
  //   try {
  //     console.log("Cronjob - movie");
  //     strapi.api.cronjob.services.cronjob.movie();
  //   } catch (err) {
  //     console.log(err, "Failed to cronjob movie");
  //   }
  // },
  // "*/2 * * * *": async () => {
  //   try {
  //     console.log("Cronjob - drama");
  //     strapi.api.cronjob.services.cronjob.drama();
  //   } catch (err) {
  //     console.log(err, "Failed to cronjob drama");
  //   }
  // },
  // movie: {
  //   task: async ({ _strapi }) => {
  //     try {
  //       console.log("Cronjob - drama", new Date());
  //       strapi.api.cronjob.services.cronjob.movie();
  //     } catch (err) {
  //       console.log(err, "Failed to cronjob movie");
  //     }
  //   },
  //   options: {
  //     rule: "* * */6 * * *",
  //   },
  // },
  // drama: {
  //   task: async ({ _strapi }) => {
  //     try {
  //       console.log("Cronjob - drama", new Date());
  //       strapi.api.cronjob.services.cronjob.drama();
  //     } catch (err) {
  //       console.log(err, "Failed to cronjob drama");
  //     }
  //   },
  //   options: {
  //     rule: "*/1 * * * * *",
  //   },
  // },
  drama: {
    task: async ({ strapi }) => {
      try {
        console.log("Cronjob - drama", new Date());
        strapi.api.cronjob.services.cronjob.drama();
      } catch (err) {
        console.log(err, "Failed to cronjob drama");
      }
    },
    options: {
      rule: "*/1 * * * *",
    },
  },
};
