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
      if (this.filterItems.collection.length > 5) {
        $('.filterMenuWrapper__content', this.$el).addClass('scroll');
      }
      return $('.filterMenuWrapper__content', this.$el).html(this.filterItems.render().el);
    },
    onBeforeRender: function() {
      return this.template = this.model.get('tpl');
    },
    initialize: function() {
      this.filterTableMediator = this.getFilterTableMediator();
      return this.filterItems = this.creatFilterItems();
    },
    getFilterTableMediator: function() {
      return this.getPopupContext().filterTableMediator;
    },
    getPopup: function() {
      return this.options.context.options.context;
    },
    getFilterField: function() {
      return this.getPopupContext().model.get('filterConfig').param.filterField;
    },
    getPopupContext: function() {
      return this.getPopup().model.get('context');
    },
    closePopup: function() {
      return this.getPopup().closePopup();
    },
    creatFilterItems: function() {
      var filterWrapperContentCollectionView;
      return filterWrapperContentCollectionView = new FilterWrapperContentCollectionView({
        collection: this.filterTableMediator.getFilterCollectionByField(this.getFilterField()),
        itemViewOptions: {
          filterTableMediator: this.filterTableMediator,
          fieldIndex: this.getPopupContext().model.get('filterDeclarationIndex'),
          fieldName: this.getFilterField()
        }
      });
    }
  });
});
