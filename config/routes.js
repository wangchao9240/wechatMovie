'use strict'
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Game = require('../app/controllers/game');
var Wechat = require('../app/controllers/wechat');
var Category = require('../app/controllers/category');
var koaBody = require('koa-body')
module.exports = function(router) {

  // index page
  router.get('/', Index.index);

  // wechat
  router.get('/wechat/movie', Game.guess);
  router.get('/wechat/movie/:id', Game.find);
  router.get('/wechat/jump/:id', Game.jump);
  router.get('/wx', Wechat.hear);
  router.post('/wx', Wechat.hear);

  // sign up
  router.post('/user/signup', User.signup)
  // sign in
  router.post('/user/signin', User.signin)
  // signin page
  router.get('/signin', User.showSignin)
  // signup page
  router.get('/signup', User.showSignup)
   // logout
  router.get('/logout', User.logout)
  // userlist page
  router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

  // detail page
  router.get('/movie/:id', Movie.detail);
  // admin page
  router.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
  // admin update
  router.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
  // admin post movie
  router.post('/admin/movie', User.signinRequired, User.adminRequired, koaBody({multipart: true}), Movie.savePoster, Movie.save)
  // list page
  router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
  // list delete movie
  router.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

  // // comment
  router.post('/user/comment', User.signinRequired, Comment.save);

  // category
  router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
  router.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
  router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
  router.get('/admin/category/update/:id', User.signinRequired, User.adminRequired, Category.update);
  router.delete('/admin/category/list', User.signinRequired, User.adminRequired, Category.del);

  // results
  router.get('/results', Index.search);
}