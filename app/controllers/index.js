var Movie = require('../api/movie');

// index page
exports.index = function* (next) {
  var categories = yield Movie.findAll()
  yield this.render('pages/index', {
    title: 'imooc 首页',
    categories: categories
  })
};

// search page
exports.search = function* (next) {
  var cateId = this.query.cate;
  var q = this.query.q;
  var page = parseInt(this.query.p) || 0;
  var count = 2;
  var index = page * count;

  if (cateId) {
    var categories = yield Movie.searchByCategory(cateId);
    var category = categories[0] || {};
    var movies = category.movies;
    var results = movies.slice(index, index + count);
    yield this.render('pages/results', {
      title: 'imooc 结果列表页',
      keyword: category.name,
      currentPage: parseInt(page + 1),
      query: 'cate=' + cateId,
      totalPage: Math.ceil(movies.length / count),
      movies: results
    })
  } else if (q) {
    var movies = yield Movie.searchByName(q);

    var results = movies.slice(index, index + count);
    yield this.render('pages/results', {
      title: 'imooc 结果列表页',
      keyword: q,
      currentPage: parseInt(page + 1),
      query: 'q=' + q,
      totalPage: Math.ceil(movies.length / count),
      movies: results
    })
  }
};

