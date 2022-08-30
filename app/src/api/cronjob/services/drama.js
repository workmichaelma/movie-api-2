"use strict";
const cheerio = require("cheerio");
const axios = require("axios");
const {
  isArray,
  isEmpty,
  get,
  reject,
  find,
  map,
  includes,
  intersection,
} = require("lodash");

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
/**
 * cronjob service.
 */
const _ = {
  getUrl: ({ region, page }) => {
    return `https://www.movieffm.net/drama/page/${page}/?genres&region=${encodeURIComponent(
      region
    )}&tvtype`;
  },
  fetchHTML: async ({ region, page }) => {
    try {
      const url = _.getUrl({ region, page });
      if (url) {
        console.log(`fetching...${url}`);
        const { data } = await axios.get(url, headers);
        return data;
      }
      return null;
    } catch (err) {
      const msg = `fetchHTML: page{${page}}, region{${region}}`;
      if (process?.env?.NODE_ENV === "production") {
        if (err?.response?.status === 404) {
          console.log(`${msg}, 404`);
        } else {
          console.log(err, msg);
        }
      } else {
        console.log(err, msg);
      }
      return null;
    }
  },
  fetchDramaRecursive: async ({ region = "", page = 1, _dramas = [] }) => {
    try {
      const html = await _.fetchHTML({ region, page });
      const dramas = _.parseDramaHTML({ region, data: html });
      if (dramas && isArray(dramas) && !isEmpty(dramas)) {
        return _.fetchDramaRecursive({
          region,
          page: page + 1,
          _dramas: [..._dramas, ...dramas],
        });
      }
      return _dramas;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  parseDramaHTML: ({ region, data }) => {
    try {
      if (data) {
        const $ = cheerio.load(data);
        const contents = $("#archive-content .item");
        return contents
          .map((i, el) => {
            const item = $(el);
            let drama = null;
            if (item) {
              drama = _.parseDrama({ region, item });
            }
            return drama;
          })
          .get();
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  parseDrama: ({ region, item }) => {
    try {
      const source = item.find(".poster > a").attr("href");
      const drama = {
        type: "drama",
        poster: item.find(".poster > img").attr("src"),
        source,
        title: parseName(item.find("h3 > a").text()),
        year: item.find(".dtinfo .metadata > span").text().slice(0, 4),
        region,
      };

      if (drama.poster && drama.title) {
        return drama;
      }
      return null;
    } catch (err) {
      console.log({ err });
      return null;
    }
  },
};

module.exports = () => ({
  cron: async (regions) => {
    try {
      let items = [];
      if (includes(regions, "hk")) {
        const hk = await _.fetchDramaRecursive({
          region: "香港",
          page: 1,
          _dramas: [],
        });
        items = [...items, ...hk];
      }
      if (includes(regions, "korea")) {
        const korea = await _.fetchDramaRecursive({
          region: "韓國",
          page: 1,
          _dramas: [],
        });
        items = [...items, ...korea];
      }
      if (includes(regions, "en")) {
        const en = await _.fetchDramaRecursive({
          region: "英國",
          page: 1,
          _dramas: [],
        });
        items = [...items, ...en];
      }
      if (includes(regions, "us")) {
        const us = await _.fetchDramaRecursive({
          region: "美國",
          page: 1,
          _dramas: [],
        });
        items = [...items, ...us];
      }
      if (includes(regions, "jp")) {
        const jp = await _.fetchDramaRecursive({
          region: "日本",
          page: 1,
          _dramas: [],
        });
        items = [...items, ...jp];
      }
      if (includes(regions, "china")) {
        const china = await _.fetchDramaRecursive({
          region: "大陸",
          page: 1,
          _dramas: [],
        });
        items = [...items, ...china];
      }
      if (includes(regions, "tw")) {
        const tw = await _.fetchDramaRecursive({
          region: "台灣",
          page: 1,
          _dramas: [],
        });
        items = [...items, ...tw];
      }
      return items;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  api: async () => {
    try {
      const hk = await _.fetchDramaRecursive({
        region: "香港",
        page: 1,
        _dramas: [],
      });
      const china = await _.fetchDramaRecursive({
        region: "大陸",
        page: 1,
        _dramas: [],
      });
      return [...hk, ...china];
    } catch (err) {
      console.log(err);
      return [];
    }
  },
});
