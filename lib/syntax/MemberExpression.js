var MemberExpression = module.exports = function(obj, property, computed) {
  this.type = 'MemberExpression';
  this.object = obj;
  this.property = property;
  if (computed === undefined) {
    computed = true;
  }
  this.computed = computed;
};

MemberExpression.prototype.normalize = function (place) {
  this.object.normalize(place);
  this.property.normalize(place);
};

MemberExpression.prototype.transform = function (place) {
  return place;
};
