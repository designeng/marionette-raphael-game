define(["backbone", "marionette"], function(Backbone, Marionette) {
  var TableController;
  return TableController = Marionette.Controller.extend({
    _currentSortingObj: {},
    _currentSortingDirection: [],
    initialize: function() {
      this.collection = Marionette.getOption(this, "collection");
      if (!this.collection) {
        this.collection = new Backbone.Collection();
      }
      this.collectionStrategy = Marionette.getOption(this, "collectionStrategy");
      return this.collection = _.extend(this.collection, this.collectionStrategy);
    },
    addItemToCollection: function(item) {
      var attrName, i;
      this.collection.push(item);
      attrName = this._currentSortingObj.name;
      i = this._currentSortingObj.i;
      this.collection.sortByAttr(attrName, this._currentSortingDirection[i]);
      return this.collection.trigger("reset");
    },
    defineSortDirection: function(i, actual) {
      if (actual) {
        return this._currentSortingDirection[i] = -1;
      } else {
        return this._currentSortingDirection[i] = 0;
      }
    },
    sort: function(attrName, i) {
      this._currentSortingObj.name = attrName;
      this._currentSortingObj.i = i;
      this._currentSortingDirection[i] *= -1;
      this.collection.sortByAttr(attrName, this._currentSortingDirection[i]);
      return this.collection.trigger("reset");
    },
    getDirection: function(i) {
      return this._currentSortingDirection[i];
    },
    setCollection: function(collection) {
      this.collection = collection;
      return this.collection = _.extend(this.collection, this.collectionStrategy);
    },
    getCollection: function(collection) {
      return this.collection;
    }
  });
});
