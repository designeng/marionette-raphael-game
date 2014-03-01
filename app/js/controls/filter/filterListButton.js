define(["marionette", "baseControl", "baseControlWrapper"], function(Marionette, BaseControl, BaseControlWrapper) {
  var FilterListButton, FilterListButtonCollectionView, FilterListButtonItemView;
  FilterListButtonItemView = BaseControlWrapper.extend({
    className: 'filterListButton__item',
    tagName: 'li'
  });
  FilterListButtonCollectionView = Marionette.CollectionView.extend({
    className: 'filterListButton__wrapper',
    itemView: FilterListButtonItemView,
    tagName: 'ul'
  });
  return FilterListButton = BaseControl.extend({
    className: function() {
      return this.defaultClassName("bFilterListButton");
    },
    initialize: function(options) {
      this.model = options.model;
      this.filterTableMediator = this.getFilterTableMediator();
      this.listenToOnce(this.filterTableMediator, "setTableCollection", this.showFilterIfDataExtist);
      return this.creatListButton();
    },
    creatListButton: function() {
      return this.filterListButtonCollectionView = new FilterListButtonCollectionView({
        collection: this.prepareItems(),
        itemViewOptions: {
          context: this
        }
      });
    },
    getFilterTableMediator: function() {
      return this.options.context.filterTableMediator;
    },
    prepareItems: function() {
      var items,
        _this = this;
      items = this.model.get('items');
      items.each(function(itemModel, i) {
        itemModel.set("context", _this.model.get('context'));
        itemModel.set("controlType", "filterButton");
        itemModel.set("filterDeclarationIndex", i);
        return itemModel.set("filterConfig", itemModel.get('filterConfig'));
      });
      return items;
    },
    showFilterIfDataExtist: function() {
      if (this.filterTableMediator.model.get('originTableCollection').length) {
        return this.$el.html(this.filterListButtonCollectionView.render().el);
      }
    }
  });
});
