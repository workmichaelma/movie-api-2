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
    "User-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36",
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
    return "";
  } catch (err) {
    console.log(err);
    return "";
  }
};
/**
 * cronjob service.
 */
const _ = {
  fetchHTML: async ({ source }) => {
    try {
      if (source) {
        console.log(`fetching...${source}`);
        const { data } = await axios.get(source, headers);
        return data;
      }
      return null;
    } catch (err) {
      console.log(err, `fetchHTML: source{ ${source} }`);
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
            return toNumber(u.name);
          });
          return orderBy(
            map(groupedUrl, (urls, episode) => {
              return {
                episode: toNumber(episode),
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
  fetch: async ({ source, type }) => {
    try {
      if (type === "drama" || type === "tvshow") {
        return _.fetchDramaFromSource({
          source,
        });
      }
      if (type === "movie") {
        return _.fetchMovieFromSource({
          source,
        });
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  },
});
