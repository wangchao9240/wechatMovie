'use strict';
var Category = require('../models/category');
var _ = require('lodash');

// admin page
exports.new = function*(next) {
  yield this.render('pages/category_admin', {
    title: 'imooc 后台分类录入页',
    category: {}
  })
};

// admin post movie
exports.save = function*(next) {
  var _category = this.request.body;
  if(_category.id) {
    var updateCate;
    var category = yield Category.findOne({_id: _category.id}).exec();
    updateCate = _.assignIn(category, _category);
    yield updateCate.save()
    res.redirect('/admin/category/list')
  } else {
    var category = new Category(_category);

    yield category.save()
    res.redirect('/admin/category/list');
  }
};

// categorylist page
exports.list = function*(next) {
  var categories = yield Category
    .find({})
    .sort('meta.updateAt')
    .exec()
  yield this.render('pages/categorylist', {
    title: 'imooc 分类列表页',
    categories: categories
  })
}

// categoryupadte page
exports.update = function*(next) {
  var id = this.params.id;
  if (id) {
    var category = yield Category.findOne({_id: id}).exec();
    yield this.render('pages/category_admin', {
      title: 'imooc 分类更新页',
      category: category
    })
  }
}

// category delete movie
exports.del = function*(next) {
  var id = this.query.id;
  if (id) {
    try {
      yield Category.remove({_id: id})
    }
    catch (err) {
      if (err) {
        this.body = {success: 0}
      }
    }
    this.body = {success: 1}
  }
};