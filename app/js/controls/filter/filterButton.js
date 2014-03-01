define(["marionette", "baseControl", "baseControlWrapper", "popupControl", "buttonControl", "buttonModel", "hbs!templates/modules/popup/filterTpl"], function(Marionette, BaseControl, BaseControlWrapper, PopupControl, ButtonControl, ButtonModel, filterTpl) {
  var FilterButtonPopupCollectionView, FilterButtonPopupItemView, closeButtonModel, filterButtonPopup;
  closeButtonModel = new ButtonModel({
    className: "closeButton filter",
    caption: "x",
    states: {
      "disabled": {},
      "default": {},
      "hover": {
        "className": "closeButtonHover"
      },
      "active": {
        "className": "closeButtonActive"
      }
    }
  });
  FilterButtonPopupItemView = BaseControlWrapper.extend({
    className: 'filterButtonNav__item',
    template: '<span class="filterButtonNav__itemText"><span class="filterButtonNav__itemSplit">,</span>{{ value }}</span>',
    tagName: 'li',
    events: {
      'click .filterButtonNav__itemText': 'onClick'
    },
    onClick: function(e) {
      return this.options.filterButtonController.showPopup();
    }
  });
  FilterButtonPopupCollectionView = Marionette.CollectionView.extend({
    itemView: FilterButtonPopupItemView,
    className: 'filterButtonNav',
    tagName: 'ul',
    events: {
      'mouseover .closeButton': 'onCloseHover',
      'mouseout .closeButton': 'onCloseOut'
    },
    closeButton: closeButtonModel,
    initialize: function() {
      this.itemViewOptions = this.options.itemViewOptions;
      this.filterButtonController = this.itemViewOptions.filterButtonController;
      this.filterTableMediator = this.filterButtonController.filterTableMediator;
      return this.initCloseButton();
    },
    initCloseButton: function() {
      var CloseButton,
        _this = this;
      CloseButton = ButtonControl.extend({
        model: Marionette.getOption(this, "closeButton"),
        onClick: function(e) {
          return _this.dropFilterButtons();
        }
      });
      return this.closeButton = new CloseButton;
    },
    dropFilterButtons: function() {
      var filterFieldIndex;
      filterFieldIndex = this.filterButtonController.model.get('filterDeclarationIndex');
      this.filterTableMediator.dropAllFiltersByFieldIndex(filterFieldIndex);
      return this.filterButtonController.fetchFilterButtonPopup();
    },
    onRender: function() {
      var filterCount, filterFieldIndex;
      filterFieldIndex = this.filterButtonController.model.get('filterDeclarationIndex');
      filterCount = this.filterTableMediator.getFilterByFieldIndex(filterFieldIndex);
      if (filterCount.length) {
        this.$el.append(this.closeButton.render().$el);
        return this.$el.addClass('filtered');
      }
    },
    onCloseHover: function() {
      return this.$el.addClass('closeHover');
    },
    onCloseOut: function() {
      return this.$el.removeClass('closeHover');
    }
  });
  return filterButtonPopup = BaseControl.extend({
    className: function() {
      return this.defaultClassName("filterButton");
    },
    initialize: function() {
      this.filterConfig = this.model.get('filterConfig');
      this.maxShowSelectedFilterButtons = 3;
      this.filterTableMediator = this.getFilterTableMediator();
      this.fetchFilterButtonPopup(true);
      return this.listenToOnce(this.filterTableMediator, "setTableCollection", this.fetchFilterButtonPopup);
    },
    fetchFilterButtonPopup: function(noFetch) {
      this.filterButtons = this.creatFilterButtonPopupItems();
      this.filterButtons.render();
      if (!noFetch) {
        return this.$el.html(this.filterButtons.render().el);
      }
    },
    creatFilterButtonPopupItems: function() {
      var filterButtonPopupCollectionView;
      return filterButtonPopupCollectionView = new FilterButtonPopupCollectionView({
        itemViewOptions: {
          filterButtonController: this
        },
        collection: this.getFilterButtonCollection()
      });
    },
    onRender: function() {
      return this.$el.html(this.filterButtons.render().el);
    },
    getFilterButtonCollection: function() {
      var aAddingModels, model, modelCounter, modelsButtonCollection, newFilterButtonCollection, singlFilterButtonCollection, _i, _len;
      singlFilterButtonCollection = new Backbone.Collection;
      newFilterButtonCollection = this.filterTableMediator.cloneCollection(this.filterTableMediator.model.get('filterCollection'));
      modelsButtonCollection = newFilterButtonCollection.where({
        fieldIndex: this.model.get('filterDeclarationIndex')
      });
      if (modelsButtonCollection.length) {
        aAddingModels = [];
        modelCounter = 0;
        for (_i = 0, _len = modelsButtonCollection.length; _i < _len; _i++) {
          model = modelsButtonCollection[_i];
          if (modelCounter < this.maxShowSelectedFilterButtons) {
            aAddingModels.push(model);
            modelCounter++;
          }
        }
        return singlFilterButtonCollection.add(aAddingModels);
      } else {
        return singlFilterButtonCollection.add({
          value: this.getLocalDefaultTitle()
        });
      }
    },
    getFilterTableMediator: function() {
      return this.model.get('context').options.context.filterTableMediator;
    },
    getLocalDefaultTitle: function() {
      var loc;
      loc = this.filterConfig.param.filterField;
      if (this.filterConfig.param.filterTitle) {
        loc = this.filterConfig.param.filterTitle;
      }
      return this.prepareLocalized(loc, "string");
    },
    showPopup: function() {
      if (!$(this.el).next().length) {
        this.popup = this.createPopup();
        this.listenTo(this.popup, 'popupClose:finish', this.fetchFilterButtonPopup);
        return this.popup.show();
      }
    },
    createPopup: function() {
      var defaultFilterPopupOptions;
      defaultFilterPopupOptions = {
        className: "popupControl",
        centeringWidthPosition: false,
        centeringHeightPosition: false,
        borderColor: "black",
        content: this.filterConfig.type,
        closeButton: false,
        mask: false,
        context: this,
        typeRendering: 'inside',
        wrapperClassName: this.cid + '__popupRegion',
        template: filterTpl,
        el: $(this.el)
      };
      return new PopupControl({
        model: new Backbone.Model(_.extend(defaultFilterPopupOptions, this.model.get('popup')))
      });
    }
  });
});
