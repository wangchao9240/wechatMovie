'use strict';

var Koa = require('koa');
var fs = require('fs');


var mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/wechatmovie');
// 初始化数据库模型
var Category = require('./app/models/category');
var Comment = require('./app/models/comment');
var Movie = require('./app/models/movie');
var User = require('./app/models/user');




// 初始化菜单
var menu = require('./wx/menu');
var wx = require('./wx/index');
var wechatApi = wx.getWechat();

wechatApi.getMenu()
  .then(function(res) {
    if (JSON.stringify(menu) != JSON.stringify(res.menu)) {
      console.log('删除了一个菜单')
      wechatApi.deleteMenu()
      .then(function() {
        console.log('重新创建了一个菜单');
        return wechatApi.createMenu(menu)
      })
      .then(function(res) {
        console.log(res)
      })
    }
  })

var app = new Koa();
var Router = require('koa-router');
var router = new Router();
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var views = require('koa-views');
var moment = require('moment');


app.use(views(__dirname + '/app/views', {
  extension: 'pug',
  locals: {
    moment: moment
  }
}))

app.keys = ['imooc'];
app.use(session(app));
app.use(bodyParser());
app.use(function*(next) {
  var user = this.session.user;
  if (user && user._id) {
    this.session.user = yield User.findOne({_id: user._id}).exec();
    this.state.user = this.session.user;
  } else {
    this.state.user = null;
  }
  yield next
})

require('./config/routes')(router);

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3001);
console.log('Listening: 3001');