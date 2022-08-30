module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  "0 12 * * *": async () => {
    try {
      console.log("Cronjob - movie - PART 1: ", new Date());
      strapi.api.cronjob.services.cronjob.movie(["hk", "tw", "jp"]);
    } catch (err) {
      console.log(err, "Failed to cronjob movie - PART 1");
    }
  },
  "15 12 * * *": async () => {
    try {
      console.log("Cronjob - movie - PART 2: ", new Date());
      strapi.api.cronjob.services.cronjob.movie(["netflix", "kr"]);
    } catch (err) {
      console.log(err, "Failed to cronjob movie - PART 2");
    }
  },
  "30 12 * * *": async () => {
    try {
      console.log("Cronjob - movie - PART 3: ", new Date());
      strapi.api.cronjob.services.cronjob.movie(["cn"]);
    } catch (err) {
      console.log(err, "Failed to cronjob movie - PART 3");
    }
  },
  "45 12 * * *": async () => {
    try {
      console.log("Cronjob - movie - PART 4: ", new Date());
      strapi.api.cronjob.services.cronjob.movie(["us"]);
    } catch (err) {
      console.log(err, "Failed to cronjob movie - PART 4");
    }
  },
  "0 13 * * *": () => {
    try {
      console.log("Cronjob - drama - PART 1: ", new Date());
      strapi.api.cronjob.services.cronjob.drama(["hk", "korea"]);
    } catch (err) {
      console.log(err, "Failed to cronjob drama - PART 1");
    }
  },
  "15 13 * * *": () => {
    try {
      console.log("Cronjob - drama - PART 2: ", new Date());
      strapi.api.cronjob.services.cronjob.drama(["en", "us"]);
    } catch (err) {
      console.log(err, "Failed to cronjob drama - PART 2");
    }
  },
  "30 13 * * *": () => {
    try {
      console.log("Cronjob - drama - PART 3: ", new Date());
      strapi.api.cronjob.services.cronjob.drama(["jp", "tw"]);
    } catch (err) {
      console.log(err, "Failed to cronjob drama - PART 3");
    }
  },
  "45 13 * * *": () => {
    try {
      console.log("Cronjob - drama - PART 4: ", new Date());
      strapi.api.cronjob.services.cronjob.drama(["china"]);
    } catch (err) {
      console.log(err, "Failed to cronjob drama - PART 4");
    }
  },
  "0 14 * * *": () => {
    try {
      console.log("Cronjob - tvshow: ", new Date());
      strapi.api.cronjob.services.cronjob.tvshow();
    } catch (err) {
      console.log(err, "Failed to cronjob tvshow");
    }
  },
};
