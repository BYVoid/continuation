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

MemberExpression.prototype.transform = function (place) {
  place = this.object.transform(place);
  place = this.property.transform(place);
  return place;
};
