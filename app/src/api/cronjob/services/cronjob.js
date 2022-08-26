const {
  map,
  uniqWith,
  isEqual,
  flatten,
  forEach,
  includes,
  find,
  get,
  compact,
} = require("lodash");

const db = {
  insert: {
    movies: async ({ movies }) => {
      try {
        const request = await map(movies, async (m) => {
          return db.insert.movie(m);
        });
        return Promise.all(request);
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    movie: async ({
      poster,
      name,
      source,
      title,
      date,
      tags,
      year,
      region,
      hot,
    }) => {
      try {
        const dbResult = await strapi.db.query("api::movie.movie").create({
          data: {
            poster,
            name,
            source,
            title,
            date,
            tags,
            year,
            region,
            hot,
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return {};
      }
    },
    tvshows: async ({ tvshows }) => {
      try {
        const request = await map(tvshows, async (t) => {
          return db.insert.tvshow(t);
        });
        return Promise.all(request);
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    tvshow: async ({
      poster,
      name,
      source,
      title,
      season,
      date,
      tags,
      year,
      region,
    }) => {
      try {
        const dbResult = await strapi.db.query("api::tvshow.tvshow").create({
          data: {
            poster,
            name,
            source,
            title,
            season,
            date,
            tags,
            year,
            region,
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return {};
      }
    },
    dramas: async ({ dramas }) => {
      console.log({ dramas });
      try {
        const request = await map(dramas, async (d) => {
          return db.insert.drama(d);
        });
        return Promise.all(request);
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    drama: async ({ poster, source, title, year, region }) => {
      try {
        const dbResult = await strapi.db.query("api::drama.drama").create({
          data: {
            poster,
            source,
            title,
            year,
            region,
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return {};
      }
    },
    tags: async ({ tags }) => {
      try {
        const request = await map(tags, async (tag) => {
          return db.insert.tag({ tag });
        });
        return Promise.all(request);
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    tag: async ({ tag }) => {
      try {
        const dbResult = await strapi.db.query("api::tag.tag").create({
          data: tag,
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return {};
      }
    },
  },
  find: {
    movies: async ({ movies }) => {
      try {
        const dbResult = await strapi.db.query("api::movie.movie").findMany({
          where: {
            $or: map(movies, (m) => {
              return {
                title: m.title,
              };
            }),
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    tvshows: async ({ tvshows }) => {
      try {
        const dbResult = await strapi.db.query("api::tvshow.tvshow").findMany({
          where: {
            $or: map(tvshows, (t) => {
              return {
                title: t.title,
              };
            }),
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    dramas: async ({ dramas }) => {
      try {
        const dbResult = await strapi.db.query("api::drama.drama").findMany({
          where: {
            $or: map(dramas, (d) => {
              return {
                title: d.title,
              };
            }),
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    tags: async ({ tags }) => {
      try {
        const dbResult = await strapi.db.query("api::tag.tag").findMany({
          where: {
            $or: tags,
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return [];
      }
    },
  },
};

const _ = {
  tagsHandler: async ({ data }) => {
    try {
      const moviesTags = map(data, "tags");
      const uniqTags = uniqWith(flatten(moviesTags), isEqual);

      const dbResult = await db.find.tags({ tags: uniqTags });

      let tagsToInsert = [];
      forEach(uniqTags, (tag) => {
        if (!find(dbResult, { type: tag.type, name: tag.name })) {
          tagsToInsert.push(tag);
        }
      });
      const newTags = await db.insert.tags({ tags: tagsToInsert });
      return [...dbResult, ...newTags];
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  moviesHandler: async ({ movies, dbTags }) => {
    try {
      const dbResult = await db.find.movies({ movies });

      let moviesToInsert = [];
      forEach(movies, (movie) => {
        if (!find(dbResult, { title: movie.title })) {
          const { tags } = movie;
          const tagIds = compact(
            map(tags, (t) => {
              return get(find(dbTags, { name: t.name }), "id");
            })
          );
          moviesToInsert.push({
            ...movie,
            tags: tagIds,
          });
        }
      });

      const newMovies = await db.insert.movies({ movies: moviesToInsert });
      return [...dbResult, newMovies];
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  tvshowsHandler: async ({ tvshows, dbTags }) => {
    try {
      const dbResult = await db.find.tvshows({ tvshows });

      let tvshowsToInsert = [];
      forEach(tvshows, (tvshow) => {
        if (!find(dbResult, { title: tvshow.title, season: tvshow.season })) {
          const { tags } = tvshow;
          const tagIds = compact(
            map(tags, (t) => {
              return get(find(dbTags, { name: t.name }), "id");
            })
          );
          tvshowsToInsert.push({
            ...tvshow,
            tags: tagIds,
          });
        }
      });

      const newTvshows = await db.insert.tvshows({ tvshows: tvshowsToInsert });
      return [...dbResult, ...newTvshows];
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  dramasHandler: async ({ dramas }) => {
    try {
      const dbResult = await db.find.dramas({ dramas });

      let dramasToInsert = [];
      forEach(dramas, (drama) => {
        if (!find(dbResult, { title: drama.title })) {
          dramasToInsert.push(drama);
        }
      });

      const newDramas = await db.insert.dramas({ dramas: dramasToInsert });
      return [...dbResult, ...newDramas];
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};

module.exports = () => ({
  movie: async () => {
    try {
      const data = await strapi.service("api::cronjob.movie").cron();

      const dbTags = await _.tagsHandler({ data });

      return _.moviesHandler({ movies: data, dbTags });
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  tvshow: async () => {
    try {
      const data = await strapi.service("api::cronjob.tvshow").cron();

      const dbTags = await _.tagsHandler({ data });

      return _.tvshowsHandler({ tvshows: data, dbTags });
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  drama: async () => {
    try {
      const data = await strapi.service("api::cronjob.drama").cron();
      return _.dramasHandler({ dramas: data });
    } catch (err) {
      console.log(err);
      return [];
    }
  },
});
