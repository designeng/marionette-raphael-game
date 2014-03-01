<<<<<<< HEAD
(function() {
  define(["underscore", "backbone", "marionette"], function(_, Backbone, Marionette) {
    var FilterCollection, FilterModel, FilterSortTableMediator, filtedDataModel;
    FilterModel = Backbone.Model.extend({
      fieldName: void 0,
      fieldIndex: void 0,
      value: void 0
    });
    FilterCollection = Backbone.Collection.extend({
      model: FilterModel
    });
    filtedDataModel = new Backbone.Model({
      filterCollection: new FilterCollection,
      tableCollection: void 0,
      originTableCollection: void 0
    });
    return FilterSortTableMediator = Marionette.Controller.extend({
      initialize: function() {
        this.model = filtedDataModel;
        this.listenToOnce(this.model, "change:tableCollection", this.createOriginTableData);
        return this.model.get('filterCollection').on('add remove change', this.applyfilterToTable, this);
      },
      toggleFilter: function(fieldName, fieldIndex, filterValue) {
        if (this.getFilterByParam(fieldName, fieldIndex, filterValue).length) {
          return this.removeFilter(fieldName, fieldIndex, filterValue);
        } else {
          return this.addFilter(fieldName, fieldIndex, filterValue);
        }
      },
      addFilter: function(fieldName, fieldIndex, filterValue) {
        return this.model.get('filterCollection').add([
          {
            fieldName: fieldName,
            fieldIndex: fieldIndex,
            value: filterValue
          }
        ]);
      },
      removeFilter: function(fieldName, fieldIndex, filterValue) {
        var aModel, model, _i, _len, _results;
        aModel = this.getFilterByParam(fieldName, fieldIndex, filterValue);
        _results = [];
        for (_i = 0, _len = aModel.length; _i < _len; _i++) {
          model = aModel[_i];
          _results.push(this.model.get('filterCollection').remove(model));
        }
        return _results;
      },
      setTableCollection: function(collection) {
        this.model.set('filterCollection', new FilterCollection);
        this.model.set('originTableCollection', void 0);
        this.model.set('tableCollection', collection);
        this.createOriginTableData();
        this.trigger('setTableCollection');
        return console.log('>>', this.model.get('tableCollection'));
      },
      getFilterByParam: function(fieldName, fieldIndex, filterValue) {
        return this.model.get('filterCollection').where({
=======
define(["underscore", "backbone", "marionette"], function(_, Backbone, Marionette) {
  var FilterCollection, FilterModel, FilterSortTableMediator, filtedDataModel;
  FilterModel = Backbone.Model.extend({
    fieldName: void 0,
    fieldIndex: void 0,
    value: void 0
  });
  FilterCollection = Backbone.Collection.extend({
    model: FilterModel
  });
  filtedDataModel = new Backbone.Model({
    filterCollection: new FilterCollection,
    tableCollection: void 0,
    originTableCollection: void 0
  });
  return FilterSortTableMediator = Marionette.Controller.extend({
    initialize: function() {
      this.model = filtedDataModel;
      return this.listenToOnce(this.model, "change:tableCollection", this.createOriginTableData);
    },
    toggleFilter: function(fieldName, fieldIndex, filterValue) {
      if (this.getFilterByParam(fieldName, fieldIndex, filterValue).length) {
        this.removeFilter(fieldName, fieldIndex, filterValue);
      } else {
        this.addFilter(fieldName, fieldIndex, filterValue);
      }
      return this.applyfilterToTable();
    },
    addFilter: function(fieldName, fieldIndex, filterValue) {
      return this.model.get('filterCollection').add([
        {
>>>>>>> AG-4601 add verstka tables
          fieldName: fieldName,
          fieldIndex: fieldIndex,
          value: filterValue
        });
      },
      getFilterByFieldIndex: function(fieldIndex) {
        return this.model.get('filterCollection').where({
          fieldIndex: fieldIndex
        });
      },
      getFilterItemCollectionByHeaderIndex: function(headerIndex) {
        var dataNameField, item, itemCollection, itemObj, itemsData, model, _i, _len, _ref;
        _ref = this.model.get('originTableCollection').models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          if (typeof model !== 'undefined') {
            itemsData = itemsData || {};
            dataNameField = Object.keys(model.attributes)[headerIndex];
            itemsData[model.get(dataNameField)] = dataNameField;
          }
        }
<<<<<<< HEAD
        itemCollection = new Backbone.Collection;
        for (item in itemsData) {
          itemObj = itemObj || {};
          itemObj['link'] = item;
          itemCollection.add(itemObj);
=======
      ]);
    },
    removeFilter: function(fieldName, fieldIndex, filterValue) {
      var aModel, model, _i, _len, _results;
      aModel = this.getFilterByParam(fieldName, fieldIndex, filterValue);
      _results = [];
      for (_i = 0, _len = aModel.length; _i < _len; _i++) {
        model = aModel[_i];
        _results.push(this.model.get('filterCollection').remove(model));
      }
      return _results;
    },
    setTableCollection: function(collection) {
      this.model.set('filterCollection', new FilterCollection);
      this.model.set('originTableCollection', void 0);
      this.model.set('tableCollection', collection);
      this.createOriginTableData();
      this.trigger('setTableCollection');
      return console.log('>>', this.model.get('tableCollection'));
    },
    getFilterByParam: function(fieldName, fieldIndex, filterValue) {
      return this.model.get('filterCollection').where({
        fieldName: fieldName,
        fieldIndex: fieldIndex,
        value: filterValue
      });
    },
    getFilterByFieldIndex: function(fieldIndex) {
      return this.model.get('filterCollection').where({
        fieldIndex: fieldIndex
      });
    },
    getFilterCollectionByField: function(filterField) {
      var item, itemCollection, itemObj, itemsData, model, _i, _len, _ref;
      itemCollection = new Backbone.Collection;
      _ref = this.model.get('originTableCollection').models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        if (typeof model !== 'undefined') {
          itemsData = itemsData || {};
          itemsData[model.get(filterField)] = model.get(filterField);
>>>>>>> AG-4601 add verstka tables
        }
        return itemCollection;
      },
      createOriginTableData: function() {
        var tableCollection;
        console.log('>>!1', this.model.get('tableCollection').models.length, this.model.get('tableCollection'));
        tableCollection = this.model.get('tableCollection');
        return this.model.set('originTableCollection', this.cloneCollection(tableCollection));
      },
      cloneCollection: function(collection) {
        var clonedCollection;
        clonedCollection = new Backbone.Collection();
        collection.each(function(collectionModel) {
          return clonedCollection.add(new Backbone.Model(collectionModel.toJSON()));
        });
        return clonedCollection;
      },
      applyfilterToTable: function() {
        var filteringCollection;
        filteringCollection = this.cloneCollection(this.model.get('originTableCollection')).models;
        if (this.model.get('filterCollection').length) {
          filteringCollection = this.filteringCollectionByValue(filteringCollection, this.getAllFilterValues());
        }
        return this.model.get('tableCollection').reset(filteringCollection);
      },
      filteringCollectionByValue: function(collection, filterValues) {
        return collection.filter(function(model) {
          return _.any(model.attributes, function(val, attr) {
            var value, _i, _len;
            for (_i = 0, _len = filterValues.length; _i < _len; _i++) {
              value = filterValues[_i];
              if (value === val) {
                return true;
              }
            }
          });
        });
      },
      dropAllFiltersByFieldIndex: function(fieldIndex) {
        var aModel, model, _i, _len, _results;
        aModel = this.getFilterByFieldIndex(fieldIndex);
        _results = [];
        for (_i = 0, _len = aModel.length; _i < _len; _i++) {
          model = aModel[_i];
          _results.push(this.model.get('filterCollection').remove(model));
        }
        return _results;
      },
      getAllFilterValues: function() {
        var values;
        values = [];
        this.model.get('filterCollection').each(function(model) {
          return values.push(model.get('value'));
        });
<<<<<<< HEAD
        return values;
      }
    });
=======
      });
    },
    dropAllFiltersByFieldIndex: function(fieldIndex) {
      var aModel, model, _i, _len;
      aModel = this.getFilterByFieldIndex(fieldIndex);
      for (_i = 0, _len = aModel.length; _i < _len; _i++) {
        model = aModel[_i];
        this.model.get('filterCollection').remove(model);
      }
      return this.applyfilterToTable();
    },
    getAllFilterValues: function() {
      var values;
      values = [];
      this.model.get('filterCollection').each(function(model) {
        return values.push(model.get('value'));
      });
      return values;
    }
>>>>>>> AG-4601 add verstka tables
  });

}).call(this);
