var TryStatement = module.exports = function(block, handlers, finalizer) {
  this.type = 'TryStatement';
  this.block = block;
  this.handlers = handlers;
  this.finalizer = finalizer;
  this.async = false;
};

TryStatement.prototype.normalize = function (place) {
  this.block.normalize();
  for (var i = 0; i < this.handlers.length; i++) {
    this.handlers[i].normalize();
  }
  if (this.finalizer) {
    this.finalizer.normalize();
  }
  place.push(this);
};

TryStatement.prototype.transform = function (place) {
  place.push(this);
  place = this.block.transform(place);
  return place;
};
