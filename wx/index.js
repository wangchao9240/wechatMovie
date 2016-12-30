 'use strict';

var path = require('path');
var util =require('../libs/util');
var Wechat = require('../wechat/wechat');
var wechat_file = path.join(__dirname, '../config/wechat.txt');
var wechat_ticket_file = path.join(__dirname, '../config/wechat_ticket.txt');
var config = {
  wechat: {
    appID: 'wxd5c2a9c095266cdd',
    appSecret: '4a5b75a8943e0c4b90a9e73f4fb76a26',
    token: 'wechatmooc9240',
    getAccessToken: function() {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: function(data) {
      data = JSON.stringify(data);
      return util.writeFileAsync(wechat_file, data)
    },
    getTicket: function() {
      return util.readFileAsync(wechat_ticket_file)
    },
    saveTicket: function(data) {
      data = JSON.stringify(data);
      return util.writeFileAsync(wechat_ticket_file, data)
    }
  }
};

exports.wechatOptions = config;

exports.getWechat = function() {
  return new Wechat(config.wechat);
}