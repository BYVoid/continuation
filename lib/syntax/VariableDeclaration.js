var helpers = require('../helpers');

var VariableDeclaration = module.exports = function(declarations, kind) {
  this.type = 'VariableDeclaration';
  this.declarations = declarations;
  this.kind = kind;
  this.async = false;
};

VariableDeclaration.prototype.normalize = function(place) {
  this.declarations.forEach(function (declaration) {
    declaration.normalize();
  });
  place.push(this);
};

VariableDeclaration.prototype.transform = function(place) {
  var self = this;
  this.declarations.forEach(function (declaration) {
    var newPlace = null;
    if (declaration.init !== null) {
      newPlace = declaration.init.transform();
      if (declaration.init.async) {
        self.async = true;
      }
    }
    place.push(new VariableDeclaration([declaration], self.kind));
    if (newPlace) {
      place = newPlace;
    }
  });
  return place;
};
