var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone", "bacon", "eventstreams"], function(Backbone, Bacon) {
  var ComboboxListCollection, _ref;
  return ComboboxListCollection = (function(_super) {
    __extends(ComboboxListCollection, _super);

    function ComboboxListCollection() {
      _ref = ComboboxListCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ComboboxListCollection.prototype.initialize = function() {
      return this.collectionStream = this.asEventStream("add remove reset change").map(this).toProperty();
    };

    ComboboxListCollection.prototype.getCollectionStream = function() {
      return this.collectionStream;
    };

    return ComboboxListCollection;

  })(Backbone.Collection);
});
