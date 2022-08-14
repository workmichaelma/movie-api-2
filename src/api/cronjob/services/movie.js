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
const filterTags = ["驚悚片", "恐怖片", "情色片", "寫真集", "寫真片"];
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
  getUrl: ({ region, cats, page }) => {
    return `https://www.movieffm.net/movies/page/${page}/?genres&region=${encodeURIComponent(
      region
    )}&cats=${cats}`;
  },
  fetchHTML: async ({ cats, region, page }) => {
    try {
      const url = _.getUrl({ cats, region, page });
      if (url) {
        console.log(`fetching...${url}`);
        const { data } = await axios.get(url, headers);
        return data;
      }
      return null;
    } catch (err) {
      console.log(err, `fetchHTML: page{${page}}, region{${region}}`);
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
      const html = await _.fetchHTML({ region, cats, page });
      const movies = _.parseMovieHTML({ region, cats, data: html });
      const filteredMovies = _.filterMovies({ movies });
      if (
        filteredMovies &&
        isArray(filteredMovies) &&
        !isEmpty(filteredMovies)
      ) {
        return _.fetchMovieRecursive({
          region,
          page: page + 1,
          cats,
          _movies: [..._movies, ...filteredMovies],
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
        tags.push({
          type: "movie",
          name: cats,
        });
      }
      const _region = region ? region : cats ? cats : "";
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
        region: _region,
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
  filterMovies: ({ movies }) => {
    return reject(movies, (m) => {
      const { tags } = m;
      const tagString = map(tags, "name");
      return !isEmpty(intersection(filterTags, tagString));
    });
  },
};

module.exports = () => ({
  cron: async () => {
    try {
      const hk = await _.fetchMovieRecursive({
        region: "香港",
        page: 1,
        _movies: [],
      });
      const korea = await _.fetchMovieRecursive({
        region: "韓國",
        page: 1,
        _movies: [],
      });
      const us = await _.fetchMovieRecursive({
        region: "歐美",
        page: 1,
        _movies: [],
      });
      const jp = await _.fetchMovieRecursive({
        region: "日本",
        page: 1,
        _movies: [],
      });
      const china = await _.fetchMovieRecursive({
        region: "大陸",
        page: 1,
        _movies: [],
      });
      const tw = await _.fetchMovieRecursive({
        region: "台灣",
        page: 1,
        _movies: [],
      });
      const netflix = await _.fetchMovieRecursive({
        cats: "netflix",
        page: 1,
        _movies: [],
      });
      return [...hk, ...korea, ...us, ...jp, ...china, ...tw, ...netflix];
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  api: async () => {
    try {
      const hk = await _.fetchMovieRecursive({
        region: "香港",
        page: 1,
        _movies: [],
      });
      const netflix = await _.fetchMovieRecursive({
        cats: "netflix",
        page: 1,
        _movies: [],
      });
      return [...hk, ...netflix];
    } catch (err) {
      console.log(err);
      return [];
    }
  },
});
