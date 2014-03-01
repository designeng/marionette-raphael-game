var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["backbone", "marionette", "underscore"], function(Backbone, Marionette, _) {
  var differenceBetween, getViewMethods;
  differenceBetween = function(target, arr) {
    var item, _i, _len;
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      item = arr[_i];
      target = _.difference(target, item);
    }
    return target;
  };
  return getViewMethods = function(shadow) {
    var actualProps, collectionViewProps, compositeViewProps, eventProps, itemViewProps, layoutViewProps, prop, targetObjectProps, viewProps;
    eventProps = [];
    for (prop in Backbone.Events) {
      eventProps.push(prop);
    }
    viewProps = [];
    for (prop in Marionette.View.prototype) {
      viewProps.push(prop);
    }
    itemViewProps = [];
    for (prop in Marionette.ItemView.prototype) {
      itemViewProps.push(prop);
    }
    layoutViewProps = [];
    for (prop in Marionette.Layout.prototype) {
      layoutViewProps.push(prop);
    }
    collectionViewProps = [];
    for (prop in Marionette.CollectionView.prototype) {
      collectionViewProps.push(prop);
    }
    compositeViewProps = [];
    for (prop in Marionette.CompositeView.prototype) {
      compositeViewProps.push(prop);
    }
    targetObjectProps = [];
    for (prop in this) {
      if (_.isArray(shadow)) {
        if (__indexOf.call(shadow, prop) >= 0) {
          (function() {
            return "nothing";
          })();
        } else if (_.isFunction(this[prop])) {
          targetObjectProps.push(prop);
        }
      } else {
        if (_.isFunction(this[prop])) {
          targetObjectProps.push(prop);
        }
      }
    }
    actualProps = differenceBetween(targetObjectProps, [eventProps, viewProps, itemViewProps, layoutViewProps, collectionViewProps, compositeViewProps]);
    return actualProps;
  };
});
