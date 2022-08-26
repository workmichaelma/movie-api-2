"use strict";
const cheerio = require("cheerio");
const axios = require("axios");
const {
  isArray,
  isEmpty,
  map,
  get,
  flatten,
  isString,
  replace,
  isObject,
  groupBy,
  orderBy,
  sortBy,
  compact,
  toNumber,
} = require("lodash");

const headers = {
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "User-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    "sec-ch-ua-platform": "macOS",
  },
};

const isURL = (url) => {
  try {
    const _url = new URL(url);
    return !!get(_url, "origin");
  } catch (err) {
    console.log(err);
    return false;
  }
};

const addHttpsToUrl = (url) => {
  try {
    if (isURL(url)) {
      const reg = new RegExp(/^(\/\/)/g);
      if (reg.test(url)) {
        return `https:${url}`;
      }
      return url;
    }
    return url;
  } catch (err) {
    console.log(err);
    return url;
  }
};
/**
 * cronjob service.
 */

const db = {
  find: {
    movie: async ({ id, title }) => {
      try {
        const dbResult = await strapi.db.query("api::movie.movie").findOne({
          where: {
            $or: [
              {
                id,
              },
              { title },
            ],
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    tvshow: async ({ id, title }) => {
      try {
        const dbResult = await strapi.db.query("api::tvshow.tvshow").findOne({
          where: {
            $or: [
              {
                id,
              },
              { title },
            ],
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    drama: async ({ id, title }) => {
      try {
        const dbResult = await strapi.db.query("api::drama.drama").findOne({
          where: {
            $or: [
              {
                id,
              },
              { title },
            ],
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return [];
      }
    },
  },
  update: {
    movie: async ({ id, feeds }) => {
      try {
        const dbResult = await strapi.db.query("api::movie.movie").update({
          where: {
            id,
          },
          data: {
            feeds,
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return {};
      }
    },
    drama: async ({ id, feeds }) => {
      try {
        const dbResult = await strapi.db.query("api::drama.drama").update({
          where: {
            id,
          },
          data: {
            feeds,
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return {};
      }
    },
    tvshow: async ({ id, feeds }) => {
      try {
        const dbResult = await strapi.db.query("api::tvshow.tvshow").update({
          where: {
            id,
          },
          data: {
            feeds,
          },
        });
        return dbResult;
      } catch (err) {
        console.log(err);
        return {};
      }
    },
  },
};
const _ = {
  fetchHTML: async ({ source }) => {
    try {
      const _source = decodeURIComponent(source);
      if (_source) {
        console.log(`fetching...${_source}`);
        const { data } = await axios.get(_source, headers);
        return data;
      }
      return null;
    } catch (err) {
      console.log(err, `fetchHTML: source{ ${_source} }`);
      return null;
    }
  },
  evalStringToJson: ({ str }) => {
    try {
      let __JSON__ = null;
      let data = replace(str, `<script type="text/javascript">`, "");
      data = replace(data, `</script>`, "");
      data = replace(data, "new Vue(", "__JSON__ = ").slice(0, -2);
      eval(data);
      if (__JSON__ && Object.keys(__JSON__).indexOf("data") > -1) {
        return __JSON__.data();
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  fetchDramaFromSource: async ({ source }) => {
    try {
      const html = await _.fetchHTML({ source });
      if (html) {
        const $ = cheerio.load(html);
        const script = $("#single.dtsingle > script:not([src])");
        if (script && isObject(script)) {
          const str = script.html();
          if (isString(str)) {
            return _.parseSeriesFeedsFromJson({
              json: _.evalStringToJson({ str }),
            });
          }
        }
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  parseSeriesFeedsFromJson: ({ json }) => {
    try {
      if (json && isObject(json)) {
        const { videourls } = json;
        if (isArray(videourls) && !isEmpty(videourls)) {
          const url = flatten(videourls);
          const groupedUrl = groupBy(url, (u) => {
            const { name = "" } = u || {};
            return !isNaN(name) ? toNumber(name) : name;
          });
          return orderBy(
            map(groupedUrl, (urls, episode) => {
              return {
                episode: !isNaN(episode) ? toNumber(episode) : episode,
                feeds: compact(
                  map(urls, (obj) => {
                    // return `https://www.movieffm.net/jwplayer/?source=${encodeURIComponent(
                    //   obj.url
                    // )}&type=hls`;
                    const url = get(obj, "url", "");
                    return addHttpsToUrl(url);
                  })
                ),
              };
            }),
            ["episode"],
            ["asc"]
          );
        }
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  fetchMovieFromSource: async ({ source }) => {
    try {
      const html = await _.fetchHTML({ source });
      if (html) {
        const $ = cheerio.load(html);
        const sourcesDoc = $(".source-box").not("#source-player-trailer");
        const sources = sourcesDoc
          .map((i, el) => {
            const source = $(el);
            const url = source.find("iframe").attr("src");
            if (isURL(url)) {
              const fullpath = new URL(url) || {};
              if (fullpath.search) {
                const source = new URLSearchParams(fullpath.search).get(
                  "source"
                );
                return addHttpsToUrl(source);
              }
            }
          })
          .get();
        return compact(sources);
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};

module.exports = () => ({
  fetch: async ({ source, title, id, type }) => {
    try {
      let _source = source;
      let dbResult = null;
      if (!_source) {
        if (type === "movies") {
          dbResult = await db.find.movie({ title, id });
        } else if (type === "tvshows") {
          dbResult = await db.find.tvshow({ title, id });
        } else if (type === "dramas") {
          dbResult = await db.find.drama({ title, id });
        }
        if (dbResult) {
          if (
            dbResult.feeds &&
            !isEmpty(dbResult.feeds) &&
            isArray(dbResult.feeds)
          ) {
            return dbResult.feeds;
          }
          if (dbResult.source) {
            _source = dbResult.source;
          }
        }
      }
      if (_source) {
        if (type === "dramas" || type === "tvshows") {
          const dramaFeeds = await _.fetchDramaFromSource({
            source: _source,
          });
          if (isObject(dramaFeeds) && !isEmpty(dramaFeeds)) {
            if (dbResult) {
              let result = null;
              if (type === "dramas") {
                result = await db.update.drama({
                  id: dbResult.id,
                  feeds: dramaFeeds,
                });
              } else if (type === "tvshows") {
                result = await db.update.tvshow({
                  id: dbResult.id,
                  feeds: dramaFeeds,
                });
              }
              return get(result, "feeds", dramaFeeds);
            }
            return dramaFeeds;
          }
        }
        if (type === "movies") {
          const movieFeeds = await _.fetchMovieFromSource({
            source: _source,
          });
          if (isArray(movieFeeds) && !isEmpty(movieFeeds)) {
            if (dbResult) {
              const result = await db.update.movie({
                id: dbResult.id,
                feeds: movieFeeds,
              });
              return get(result, "feeds", movieFeeds);
            }
            return movieFeeds;
          }
        }
      }
      return null;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
});
