define(["backbone", "marionette", "bacon", "eventstreams"], function(Backbone, Marionette, Bacon) {
  var InfoItemView, InfoView, InfoViewCollection;
  InfoItemView = Marionette.ItemView.extend({
    tagName: "li",
    template: "{{value}}"
  });
  InfoViewCollection = Backbone.Collection.extend({
    initialize: function() {
      return this.collectionStream = this.asEventStream("add remove reset change noitems").map(this).toProperty();
    },
    getCollectionStream: function() {
      return this.collectionStream;
    }
  });
  InfoView = Marionette.CollectionView.extend({
    className: function() {
      return this.defaultClassName("infoControl");
    },
    tagName: "ul",
    itemView: InfoItemView,
    initialize: function() {
      this.applyModelProperties(["cases"], {
        prefix: this._attrPrefix
      });
      if (!this.collection) {
        this.collection = new InfoViewCollection();
      }
      this.toCollection(this._cases);
      this.localizeCollection();
      this.reservedCollection = this.collection.clone();
      this.collectionStream = this.collection.getCollectionStream();
      return this.setCollectionStream();
    },
    setCollectionStream: function() {
      var _this = this;
      this.collectionStream = this.collection.getCollectionStream();
      return this.collectionStream.onValue(function(val) {
        return _this.render();
      });
    },
    toCollection: function(items) {
      var _this = this;
      return _.each(items, function(item) {
        var fieldName, fieldValue, keys;
        keys = _.keys(item);
        fieldName = keys[0];
        fieldValue = item[fieldName];
        return _this.collection.add(new Backbone.Model({
          key: fieldName,
          value: fieldValue
        }));
      });
    },
    localizeCollection: function() {
      var _this = this;
      return this.collection.each(function(model) {
        var localizedValue, value;
        value = model.get("value");
        localizedValue = _this.prepareLocalized(value, "string");
        return model.set("value", localizedValue);
      });
    },
    chooseModelByKey: function(collection, key) {
      return collection.where({
        key: key
      });
    },
    setInfoCases: function(infoCases) {
      var item, model, _collection, _i, _len, _results;
      _collection = this.collection.clone();
      this.collection = new InfoViewCollection();
      this.setCollectionStream();
      if (_.isString(infoCases)) {
        model = this.chooseModelByKey(_collection, infoCases);
        return this.collection.add(model);
      } else if (_.isArray(infoCases)) {
        if (infoCases.length !== 0) {
          _results = [];
          for (_i = 0, _len = infoCases.length; _i < _len; _i++) {
            item = infoCases[_i];
            model = this.chooseModelByKey(_collection, item);
            _results.push(this.collection.add(model));
          }
          return _results;
        } else {
          return this.collection.trigger("noitems");
        }
      }
    },
    publicApi: function() {
      return {
        "setInfoCases": this.setInfoCases
      };
    }
  });
  return InfoView;
});
