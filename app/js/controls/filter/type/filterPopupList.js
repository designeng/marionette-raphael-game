define(["underscore", "marionette", "baseControl", "baseControlWrapper"], function(_, Marionette, BaseControl, BaseControlWrapper) {
  var FilterWrapperContent, FilterWrapperContentCollectionView, FilterWrapperContentItemView;
  FilterWrapperContentItemView = BaseControlWrapper.extend({
    template: "<div class='filterMenu__itemButton'><span class='filterMenu__itemText'>{{ link }}</span><span class='filterMenu__itemArrow'></span></div>",
    events: {
      "click .filterMenu__itemText": "onClick"
    },
    tagName: 'li',
    className: function() {
      var tagClass;
      tagClass = 'filterMenu__item';
      if (this.options.filterTableMediator.getFilterByParam(this.options.fieldName, this.options.fieldIndex, this.model.get('link')).length) {
        tagClass = 'filterMenu__item selected';
      }
      return tagClass;
    },
    onClick: function(e) {
      var vauleText;
      vauleText = $(e.target).closest('.filterMenu__item').toggleClass('selected');
      return this.options.filterTableMediator.toggleFilter(this.options.fieldName, this.options.fieldIndex, $(e.target).text());
    }
  });
  FilterWrapperContentCollectionView = Marionette.CollectionView.extend({
    itemView: FilterWrapperContentItemView,
    className: 'filterMenu',
    tagName: 'ul',
    initialize: function() {
      return this.itemViewOptions = this.options.itemViewOptions;
    }
  });
  return FilterWrapperContent = BaseControl.extend({
    events: {
      'click .buttonControl': 'closePopup'
    },
    onRender: function() {
      var conunter, item, _i, _len, _ref;
      conunter = 0;
      $('.filterMenuWrapper__content', this.$el).html('');
      _ref = this.filterItems;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        $('.filterMenuWrapper__content', this.$el).append('<h2 class="filterMenuWrapper__contentTitle">' + item.title + '</h2>').append(item.collection.render().el);
        conunter += item.collection.collection.length;
      }
      if (conunter > 5) {
        return $('.filterMenuWrapper__content', this.$el).addClass('scroll');
      }
    },
    onBeforeRender: function() {
      return this.template = this.model.get('tpl');
    },
    initialize: function() {
      this.filterTableMediator = this.getFilterTableMediator();
      return this.filterItems = this.creatFilterItems(this.getFilterItems());
    },
    getFilterTableMediator: function() {
      return this.getPopupContext().filterTableMediator;
    },
    getFilterItems: function() {
      return this.getPopupContext().model.get('filterConfig').param.filterItems;
    },
    getPopupContext: function() {
      return this.getPopup().model.get('context');
    },
    getPopup: function() {
      return this.options.context.options.context;
    },
    closePopup: function() {
      return this.getPopup().closePopup();
    },
    creatFilterItems: function(aItems) {
      var filteItem, _i, _len;
      if (aItems.length) {
        for (_i = 0, _len = aItems.length; _i < _len; _i++) {
          filteItem = aItems[_i];
          filteItem.collection = this.creatCollectionFilterItem(filteItem);
        }
      }
      return aItems;
    },
    creatCollectionFilterItem: function(item) {
      var collectionView;
      return collectionView = new FilterWrapperContentCollectionView({
        collection: this.filterTableMediator.getFilterCollectionByField(item.field),
        itemViewOptions: {
          fieldName: item.field,
          fieldIndex: this.getPopupContext().model.get('filterDeclarationIndex'),
          filterTableMediator: this.filterTableMediator
        }
      });
    }
  });
});
