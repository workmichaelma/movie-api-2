"use strict";
const cheerio = require("cheerio");
const axios = require("axios");
const { isArray, isEmpty, map, get, flatten } = require("lodash");

const headers = {
  headers: {
    "User-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36",
  },
};
const parseDate = (date) => {
  try {
    return moment(date).unix() * 1000;
  } catch {
    return date;
  }
};
const parseName = (name) => {
  if (name.indexOf("/") > -1) {
    return name.split("/")[0];
  }
  return name;
};
const seasonsStringToNumber = [
  "",
  "共一季",
  "共二季",
  "共三季",
  "共四季",
  "共五季",
  "共六季",
  "共七季",
  "共八季",
  "共九季",
  "共十季",
  "共十一季",
  "共十二季",
  "共十三季",
  "共十四季",
  "共十五季",
  "共十六季",
  "共十七季",
  "共十八季",
  "共十九季",
  "共二十季",
];
/**
 * cronjob service.
 */
const _ = {
  getTvShowsUrl: ({ region, page }) => {
    return `https://www.movieffm.net/tvshows/page/${page}/?genres&region=${encodeURIComponent(
      region
    )}&dtyear&cats&orderby&tvtype`;
  },
  fetchTvShows: async ({ region }) => {
    const tvShows = await _.fetchTvsRecursive({
      region,
      page: 1,
      _tvs: [],
    });

    console.log({ tvShows });

    return _.getSeriesFromTvShows({ tvShows });
  },
  fetchHTML: async ({ url, region = "", page = "", title = "" }) => {
    try {
      if (url) {
        console.log(`fetching...${url}`);
        const { data } = await axios.get(url, headers);
        return data;
      }
      return null;
    } catch (err) {
      console.log(
        err,
        `fetchHTML: page{${page}}, type{${region}}, title${title}`
      );
      return null;
    }
  },
  fetchTvsRecursive: async ({ region, page, _tvs = [] }) => {
    try {
      const url = _.getTvShowsUrl({ region, page });
      const html = await _.fetchHTML({ url, region, page });
      const tvs = _.parseTvHTML({ region, data: html });
      if (tvs && isArray(tvs) && !isEmpty(tvs)) {
        return _.fetchTvsRecursive({
          region,
          page: page + 1,
          _tvs: [..._tvs, ...tvs],
        });
      }
      return _tvs;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  parseTvHTML: ({ region, data }) => {
    try {
      if (data) {
        const $ = cheerio.load(data);
        const contents = $("#archive-content .item");
        return contents
          .map((i, el) => {
            const item = $(el);
            let tv = null;
            if (item) {
              tv = _.parseTv({ region, item });
            }
            return tv;
          })
          .get();
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  parseTv: ({ region, item }) => {
    try {
      const source = item.find(".poster > a").attr("href");
      const tags = item
        .find(".dtinfo > .genres > .mta a")
        .map((a, tag) => {
          return {
            type: "tvshow",
            name: cheerio.load(tag).text(),
          };
        })
        .get();
      const tvshow = {
        type: "tvshow",
        poster: item.find(".poster > img").attr("src"),
        season: item.find(".poster .update").text(),
        source,
        title: parseName(item.find("h3 > a").text()),
        date: parseDate(item.find(".data > span").text()),
        year: item.find(".data > span").text().slice(0, 4),
        tags,
        region,
      };

      if (tvshow.poster && tvshow.title) {
        return tvshow;
      }
      return null;
    } catch (err) {
      console.log({ err });
      return null;
    }
  },
  parseSeriesHTML: ({ tvshow, data }) => {
    try {
      if (data) {
        const $ = cheerio.load(data);
        const contents = $("#seasons .se-c");
        return contents
          .map((i, el) => {
            const item = $(el);
            let series = null;
            if (item) {
              series = _.parseSeries({ tvshow, item });
            }
            return series;
          })
          .get();
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  parseSeries: ({ tvshow, item }) => {
    try {
      const source = item.find("a").attr("href");
      const season = item.find(".se-t").text();
      if (source && season) {
        return {
          ...tvshow,
          season,
          source,
        };
      }
      return null;
    } catch (err) {
      console.log({ err });
      return null;
    }
  },
  getSeriesFromTvShows: async ({ tvShows }) => {
    try {
      const tvSeriesCalls = await map(tvShows, async (tvshow) => {
        return _.fetchTvSeries({ tvshow });
      });
      const tvSeries = await Promise.all(tvSeriesCalls);

      return flatten(tvSeries);
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  fetchTvSeries: async ({ tvshow }) => {
    try {
      const { source, title } = tvshow;
      const html = await _.fetchHTML({ url: source, title });

      return _.parseSeriesHTML({ tvshow, data: html });
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};

module.exports = () => ({
  cron: async () => {
    try {
      // const hk = await _.fetchTvShows({
      //   region: "香港",
      // });
      // const jp = await _.fetchTvShows({
      //   region: "日本",
      // });
      const cn = await _.fetchTvShows({
        region: "大陸",
      });
      return cn;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  api: async () => {
    try {
      // const hk = await _.fetchTvShows({
      //   region: "香港",
      // });
      // const jp = await _.fetchTvShows({
      //   region: "日本",
      // });
      const cn = await _.fetchTvShows({
        region: "大陸",
      });
      return cn;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
});
