'use strict';
var Movie = require('../models/movie');
var koa_request = require('koa-request');
var co = require('co');
var Category = require('../models/category');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');
// index page
exports.findAll = function*() {
  var categories = yield Category
    .find({})
    .populate({
      path: 'movies',
      select: 'title poster'
    })
    .exec()
  return categories;
};

// search page
exports.searchByCategory = function*(cateId) {
  var categories = yield Category
    .find({
      _id: cateId
    })
    .populate({
      path: 'movies',
      select: 'title poster'
    })
    .exec()
  return categories;
}

exports.searchByName = function*(q) {
  var movies = yield Movie
    .find({
      title: new RegExp(q + '.*', 'i')
    })
    .exec()
  return movies;
};

exports.findHotMovies = function*(hot, count) {
  var movies = yield Movie
    .find({})
    .sort({'pv': hot})
    .limit(count)
    .exec()
  return movies;
};

exports.findMoviesByCate = function*(cate) {
  var category = yield Category
    .findOne({name: cate})
    .populate({
      path: 'movies',
      select: 'title poster _id'
    })
    .limit(10)
    .exec()
  return category;
};

exports.searchById = function*(id) {
  var movie = yield Movie
    .findOne({
      _id: id
    })
    .exec()
  return movie;
};

function updateMovies(movie) {
  var options = {
    url: 'https://api.douban.com/v2/movie/subject/' + movie.doubanId,
    json: true
  };
  request(options)
  .then(function(res) {
    var data = res.body;
    _.assignIn(movie, {
      country: data.countries[0],
      summary: data.summary
    })
    var genres = movie.genres;
    if (genres && genres.length > 0) {
      var cateArray = [];
      genres.forEach(function(genre) {
        cateArray.push(function*() {
          var cate = yield Category.findOne({name: genre}).exec();
          if (cate) {
            cate.movies.push(movie._id)
            yield cate.save()
          } else {
            cate = new Category({
              name: genre,
              movies: [movie._id]
            })
            cate = yield cate.save();
            movie.category = cate._id;
            yield movie.save();
          }
        })
      })
      co(function*() {
        yield cateArray;
      })
    } else {
      movie.save();
    }
  })
}

exports.searchByDouban = function*(q) {
  var options = {
    url: 'https://api.douban.com/v2/movie/search?q='
  };
  options.url += encodeURIComponent(q);
  var response = yield koa_request(options);
  var data = JSON.parse(response.body);
  var subjects = [];
  var movies = [];

  if (data && data.subjects) {
    subjects = data.subjects;
  }
  if (subjects.length > 0) {
    var queryArray = [];
    subjects.forEach(function(item) {
      queryArray.push(function*() {
        var movie = yield Movie.findOne({
          doubanId: item.id
        })

        if (movie) {
          movies.push(movie)
        } else {
          var directors = item.directors || [];
          var director = directors[0] || {};
          movie = new Movie({
            director: director.name || '',
            title: item.title,
            doubanId: item.id,
            poster: item.images.large,
            year: item.year,
            genres: item.genres || []
          })
          movie = yield movie.save();
          movies.push(movie);
        }
      })
    })
    yield queryArray;
    movies.forEach(function(movie) {
      updateMovies(movie);
    })
  }

  return movies
}