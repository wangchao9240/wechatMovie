'use strict';

var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

// detail page
exports.detail = function*(next) {
  var id = this.params.id;
  yield Movie.update({_id: id}, {$inc: {pv:1}}).exec()

  var movie = yield Movie.findOne({_id: id}).exec();
  var comments = yield Comment
    .find({movie: id})
    .populate('from', 'name')
    .populate('reply.from reply.to', 'name')
    .exec()

  yield this.render('pages/detail', {
    title: movie.title,
    movie: movie,
    comments: comments
  })
}

// admin page
exports.new = function*(next) {
  var categories = yield Category
    .find({})
    .sort('meta.updateAt')
    .exec()
  yield this.render('pages/admin', {
    title: 'imooc 后台录入页',
    movie: {},
    categories: categories
  })
};

// admin update
exports.update = function*(next) {
  var id = this.params.id;

  if (id) {
    var categories = yield Category
      .find({})
      .sort('meta.updateAt')
      .exec()
    var movie = yield Movie.findOne({_id: id}).exec()
    yield this.render('pages/admin', {
      title: 'imooc电影更新页',
      movie: movie,
      categories: categories
    })
  }
}

var util = require('../../libs/util');

// save poster
exports.savePoster = function*(next) {
  var posterData = this.request.body.files.uploadPoster;
  var filePath = posterData.path;
  var name = posterData.name;

  if (name) {
    var data = yield util.readFileAsync(filePath)
    var timestamp = Date.now();
    var type = posterData.type.split('/')[1];
    var poster = timestamp + '.' + type;
    var newPath = path.join(__dirname, '../../', 'public/upload/' + poster)
    yield util.writeFileAsync(newPath, data);
    this.poster = poster;
  }
  yield next
}

// admin post movie
exports.save = function*(next) {
  var movieObj = this.request.body.fields || {};
  var _movie;
  console.log('movieObj------>', movieObj);
  if (this.poster) {
    movieObj.poster = this.poster;
  }

  if (movieObj._id) {
    var movie = yield Movie.findOne({_id: movieObj._id}).exec()
    _movie = _.assignIn(movie, movieObj);
    var cbMovie = yield _movie.save();
    var category = yield Category.findOne({_id: movie.category}).exec()
    category.movies.push(cbMovie._id)
    var cbCategory = yield category.save();
    this.redirect('/movie/' + cbMovie._id);
  } else {
    _movie = new Movie(movieObj);
    var categoryId = _movie.category;
    var categoryName = movieObj.categoryName;
    var cbMovie = yield _movie.save();
    if (categoryId) {
      var category = yield Category.findOne({_id: categoryId}).exec();
      category.movies.push(cbMovie._id)
      yield category.save();
      this.redirect('/movie/' + cbMovie._id);
    } else if (categoryName) {
      var category = new Category({
        name: categoryName,
        movies: [cbMovie._id]
      })
      var cbCategory = yield category.save();
      cbMovie.category = cbCategory._id;
      yield cbMovie.save()
      this.redirect('/movie/' + cbMovie._id);
    }
  }
};

// list page
exports.list = function*(next) {
  var movies = yield Movie
    .find({})
    .populate('category', 'name')
    .exec();
  yield this.render('pages/list', {
    title: 'imooc 列表页',
    movies: movies
  })
}

// list delete movie
exports.del = function*(next) {
  var id = this.query.id;
  if (id) {
    try {
      yield Movie.remove({_id: id})
    } 
    catch (err) {
      console.log('有错')
      if (err) {
        this.body = {success: 0}
      }
    }
    console.log('没错误')
    this.body = {success: 1};
  }
};