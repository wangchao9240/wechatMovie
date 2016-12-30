'use strict';
var Comment = require('../models/comment');

exports.save = function*(next) {
  var _comment = this.request.body;
  var movieId = _comment.movie;

  if (_comment.cid) {
    var comment = yield Comment.findOne({_id: _comment.cid}).exec();
    var reply = {
      from: _comment.from,
      to: _comment.tid,
      content: _comment.content
    }
    comment.reply.push(reply);
    yield comment.save()
    this.body = {success: 1}
  } else {
    var comment = new Comment({
      movie: _comment.movie,
      from: _comment.from,
      content: _comment.content,
    });
    yield comment.save()
    this.body = {success: 1}
  }

}