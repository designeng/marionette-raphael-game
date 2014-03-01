define(["backbone", "marionette", "modules/debug/views/declaration"], function(Backbone, Marionette, componentItems) {
  var CompositeView, ControlItemView;
  ControlItemView = Marionette.Layout.extend({
    template: '<div control="{{controlType}}" model="controlModel"/>',
    initialize: function(options) {},
    onRender: function() {}
  });
  CompositeView = Marionette.CompositeView.extend({
    template: "<ul>                    <!-- INVERSION -->                    <li id='{{cid}}__3'></li>                    <li id='{{cid}}__2'></li>                    <li id='{{cid}}__1'></li>                    <li id='{{cid}}__0'></li>                </ul>",
    className: "viewCompositeView",
    itemView: ControlItemView,
    initialize: function(options) {
      var item, _i, _len;
      if (!this.model) {
        this.model = new Backbone.Model();
      }
      this.model.set("cid", this.cid);
      for (_i = 0, _len = componentItems.length; _i < _len; _i++) {
        item = componentItems[_i];
        item.controlModel.set({
          "context": this
        });
      }
      this.collection = new Backbone.Collection(componentItems);
      return this.on("linkControl:click", function(evtData) {});
    },
    appendHtml: function(collectionView, itemView, index) {
      return collectionView.$el.find("#" + this.cid + "__" + index).append(itemView.el);
    }
  });
  return CompositeView;
});
