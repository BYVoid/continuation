var MemberExpression = module.exports = function (obj, property, computed, loc, range) {
  this.type = 'MemberExpression';
  this.object = obj;
  this.property = property;
  if (computed === undefined) {
    computed = true;
  }
  this.computed = computed;
  this.loc = loc;
  this.range = range;
};

MemberExpression.prototype.normalize = function (place) {
  this.object.normalize(place);
  this.property.normalize(place);
};

MemberExpression.prototype.transform = function (place) {
  this.object.transform(place);
  this.property.transform(place);
  return place;
};
