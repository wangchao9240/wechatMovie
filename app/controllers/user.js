var User = require('../models/user');

// signup page
exports.showSignup = function*(next) {
  yield this.render('pages/signup', {
    title: 'imooc 用户注册页'
  })
}

// signin page
exports.showSignin = function*(next) {
  yield this.render('pages/signin', {
    title: 'imooc 用户登录页'
  })
}

// sign up
exports.signup = function*(next) {
    var _user = this.request.body;
    var hasUser = yield User.findOne({name: _user.name}).exec()
    if (hasUser) this.redirect('/signin');
    else {
      var user = new User(_user);
      var cbUser = yield user.save();
      this.session.user = cbUser;
      this.redirect('/');
    }
  
}

// sign in
exports.signin = function*(next) {
  var _user = this.request.body;
  var name = _user.name;
  var password = _user.password;

  var user = yield User.findOne({name: name}).exec()
  if (!user) this.redirect('/signup')
  if (user) {
    var isMatch = yield user.comparePassword(password);
    if (isMatch) {
      this.session.user = user;
      this.redirect('/');
    } else {
      console.log('Password is not matched');
      this.redirect('/signin')
    }
  }
};

// logout
exports.logout = function*(next) {
  delete this.session.user
  this.redirect('/')
}

// userlist page
exports.list = function*(next) {
  var users = yield User
    .find({})
    .sort('meta.updateAt')
    .exec()
  yield this.render('pages/userlist', {
    title: 'imooc 用户列表页',
    users: users
  })
}

// midware for user
exports.signinRequired = function*(next) {
  var user = this.session.user;
  if (!user) {
    this.redirect('/signin')
  } else {
    yield next
  }
}

exports.adminRequired = function*(next) {
  var user = this.session.user;
  if (user.role > 10) {
    yield next
  } else {
    this.redirect('/');
  }
}