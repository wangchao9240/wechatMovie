'use strict';

// test
var Movie = require('../app/api/movie');

var help = '亲爱的，欢迎关注科幻电影世界\n' + 
    '回复 1 ~ 3，测试文字回复\n' +
    '回复 4 测试图文回复\n' + 
    '回复 首页 ，进入电影首页\n' +
    '回复 电影名字，查询电影信息\n' +
    '回复 语音消息，查询电影信息\n' +
    '也可以点击 <a href="http://e4ec32e9.ngrok.io/wechat/movie">语音查电影</a>';

exports.reply = function* (next) {
  var message = this.wexin;
  if (message.MsgType == 'event') {
    switch (message.Event) {
      case 'subscribe':
        this.body = help;
        break;
      case 'unsubscribe':
        console.log('无情取关');
        this.body = '';
        break;
      case 'LOCATION':
        this.body = '您上报的位置是： ' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
        break;
      case 'CLICK':
        var news = [];
        if (message.EventKey == 'movie_hot') {
          var movies = yield Movie.findHotMovies(-1, 10);
          movies.forEach(function(movie) {
            news.push({
              title: movie.title,
              description: movie.title,
              picUrl: movie.poster,
              url: 'http://e4ec32e9.ngrok.io/wechat/jump/' + movie._id
            })
          })
        } else if (message.EventKey == 'movie_cold') {
          var movies = yield Movie.findHotMovies(1, 10);
          movies.forEach(function(movie) {
            news.push({
              title: movie.title,
              description: movie.title,
              picUrl: movie.poster,
              url: 'http://e4ec32e9.ngrok.io/wechat/jump/' + movie._id
            })
          })
        } else if (message.EventKey == 'movie_crime') {
          var cate = yield Movie.findMoviesByCate('犯罪');
          cate.movies.forEach(function(movie) {
            news.push({
              title: movie.title,
              description: movie.title,
              picUrl: movie.poster,
              url: 'http://e4ec32e9.ngrok.io/wechat/jump/' + movie._id
            })
          })
        } else if (message.EventKey == 'movie_cartoon') {
          var cate = yield Movie.findMoviesByCate('动画');
          cate.movies.forEach(function(movie) {
            news.push({
              title: movie.title,
              description: movie.title,
              picUrl: movie.poster,
              url: 'http://e4ec32e9.ngrok.io/wechat/jump/' + movie._id
            })
          })
        } else if (message.EventKey == 'help') {
          news = help;
        }
        this.body = news;
        break;
      default:
        this.body = '哇！你这个举动触发了一个事件诶...';
        console.log('触发了一个事件哦')
        break;
    }

  } else if (message.MsgType == 'voice') {
    var voiceText = message.Recognition;
    var movies = yield Movie.searchByName(voiceText);
    if (movies.length == 0 || !movies) {
      console.log('从豆瓣里取数据~~！')
      movies = yield Movie.searchByDouban(voiceText);
    }
    if (movies && movies.length > 0) {
      var reply = [];
      movies = movies.slice(0,10);
      movies.forEach(function(movie) {
        reply.push({
          title: movie.title,
          description: movie.title,
          picUrl: movie.poster,
          url: 'http://e4ec32e9.ngrok.io/wechat/jump/' + movie._id
        })
      })
    } else {
      var reply = '没有查询到与' + content + '匹配的电影，要不要换一个名字试试？'
    }
    this.body = reply;
  } else if (message.MsgType == 'text') {
    var content = message.Content;

    switch (content) {
      case '1':
        var reply = '天下第一吃大米';
        break;

      case '2':
        var reply = '天下第二吃豆腐';
        break;

      case '3':
        var reply = '天下第三吃仙丹';
        break;

      case '4':
        var reply = [
          {
            title: '技术改变世界',
            description: '只是个描述而已',
            picUrl: 'http://d.hiphotos.baidu.com/zhidao/pic/item/faf2b2119313b07e494086920cd7912396dd8caf.jpg',
            url: 'http://github.com'
          },
          {
            title: 'Nodejs 开发微信',
            description: '爽到爆',
            picUrl: 'http://imgsrc.baidu.com/forum/pic/item/d833c895d143ad4b3ab4727a82025aafa50f06f5.jpg',
            url: 'http://www.baidu.com'
          }
        ];
        break;

      default:
        var movies = yield Movie.searchByName(content);
        if (movies.length == 0 || !movies) {
          console.log('从豆瓣里取数据~~！')
          movies = yield Movie.searchByDouban(content);
        }
        if (movies && movies.length > 0) {
          var reply = [];
          movies = movies.slice(0,10);
          movies.forEach(function(movie) {
            reply.push({
              title: movie.title,
              description: movie.title,
              picUrl: movie.poster,
              url: 'http://e4ec32e9.ngrok.io/wechat/jump/' + movie._id
            })
          })
        } else {
          var reply = '没有查询到与' + content + '匹配的电影，要不要换一个名字试试？'
        }
    }

    this.body = reply;
  }
  yield next
}