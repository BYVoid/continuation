var BlockStatement = require('./BlockStatement');

var Program = module.exports = function(body, comments) {
  this.type = 'Program';
  this.body = body;
  this.comments = comments;
};

Program.prototype.normalize = BlockStatement.prototype.normalize;
