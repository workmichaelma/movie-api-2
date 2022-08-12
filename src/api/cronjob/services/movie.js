"use strict";
const cheerio = require("cheerio");
const axios = require("axios");
const { isArray, isEmpty, get } = require("lodash");

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
  getUrl: ({ region, cats, page }) => {
    return `https://www.movieffm.net/movies/page/${page}/?genres&region=${encodeURIComponent(
      region
    )}&cats=${cats}`;
  },
  fetchHTML: async ({ type, cats, region, page }) => {
    try {
      const url = _.getUrl({ cats, region, page });
      if (url) {
        console.log(`fetching...${url}`);
        const { data } = await axios.get(url, headers);
        return data;
      }
      return null;
    } catch (err) {
      console.log(
        err,
        `fetchHTML: page{${page}}, type{${region}}, type{${type}}`
      );
      return null;
    }
  },
  fetchMovieRecursive: async ({
    region = "",
    cats = "",
    page = 1,
    _movies = [],
  }) => {
    try {
      const type = "movies";
      const html = await _.fetchHTML({ type, region, cats, page });
      const movies = _.parseMovieHTML({ region, cats, data: html });
      if (movies && isArray(movies) && !isEmpty(movies)) {
        return _.fetchMovieRecursive({
          region,
          page: page + 1,
          cats,
          _movies: [..._movies, ...movies],
        });
      }
      return _movies;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  parseMovieHTML: ({ region, cats, data }) => {
    try {
      if (data) {
        const $ = cheerio.load(data);
        const contents = $("#archive-content .item");
        return contents
          .map((i, el) => {
            const item = $(el);
            let movie = null;
            if (item) {
              movie = _.parseMovie({ region, cats, item });
            }
            return movie;
          })
          .get();
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  parseMovie: ({ region, cats, item }) => {
    try {
      const source = item.find(".poster > a").attr("href");
      const tags = item
        .find(".dtinfo > .genres > .mta a")
        .map((a, tag) => {
          return {
            type: "movie",
            name: cheerio.load(tag).text(),
          };
        })
        .get();
      if (cats) {
        tags.push(cats);
      }
      const movie = {
        type: "movie",
        poster: item.find(".poster > img").attr("src"),
        name: (source || "")
          .replace(/^(https:\/\/www.movieffm.net\/movies\/)/g, "")
          .replace("/", ""),
        source,
        title: parseName(item.find("h3 > a").text()),
        date: parseDate(item.find(".data > span").text()),
        year: item.find(".data > span").text().slice(0, 4),
        tags,
        region,
        hot: tags.indexOf("熱門電影") > -1 ? 1 : 0,
      };

      if (movie.poster && movie.title) {
        return movie;
      }
      return null;
    } catch (err) {
      console.log({ err });
      return null;
    }
  },
};

module.exports = () => ({
  init: async () => {
    try {
      // const hk = await _.fetchMovieRecursive({
      //   region: "香港",
      //   page: 1,
      //   _movies: [],
      // });
      // const korea = await _.fetchMovieRecursive({
      //   region: "韓國",
      //   page: 1,
      //   _movies: [],
      // });
      // const us = await _.fetchMovieRecursive({
      //   region: "歐美",
      //   page: 1,
      //   _movies: [],
      // });
      // const jp = await _.fetchMovieRecursive({
      //   region: "日本",
      //   page: 1,
      //   _movies: [],
      // });
      // const china = await _.fetchMovieRecursive({
      //   region: "大陸",
      //   page: 1,
      //   _movies: [],
      // });
      // const tw = await _.fetchMovieRecursive({
      //   region: "台灣",
      //   page: 1,
      //   _movies: [],
      // });
      // const netflix = await _.fetchMovieRecursive({
      //   cats: "netflix",
      //   page: 1,
      //   _movies: [],
      // });
      // return [...hk, ...korea, ...us, ...jp, ...china, ...tw, ...netflix];
      const hk = await _.fetchMovieRecursive({
        region: "香港",
        page: 1,
        _movies: [],
      });
      return hk;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
});
