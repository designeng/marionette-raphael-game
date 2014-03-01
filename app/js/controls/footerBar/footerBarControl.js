define(["marionette", "baseControlWrapper"], function(Marionette, BaseControlWrapper) {
  var FooterBarControlLayout, FooterBarItemCollectionView, FooterBarItemView;
  FooterBarItemView = BaseControlWrapper.extend({
    tagName: "li",
    className: "footerContactBar__linkItem"
  });
  FooterBarItemCollectionView = Marionette.CollectionView.extend({
    tagName: "ul",
    className: "footerContactBar__link",
    itemView: FooterBarItemView
  });
  FooterBarControlLayout = Marionette.Layout.extend({
    className: function() {
      if (this.model) {
        return this.model.get("className");
      }
    },
    initialize: function(options) {
      this.context = Marionette.getOption(this, "context");
      this.createFooterContacts();
      return this.createFooterHelp();
    },
    createFooterPhone: function() {
      var htmlPhone, phone, _i, _len, _ref;
      htmlPhone = '';
      _ref = this.model.get("phones");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        phone = _ref[_i];
        htmlPhone += htmlPhone !== '' ? '<span class="footerContactBar__phonesComma">,</span><span class="footerContactBar__phonesText">' + phone + '</span>' : '<span class="footerContactBar__phonesText">' + phone + '</span>';
      }
      return htmlPhone;
    },
    createFooterHelp: function() {
      var _this = this;
      this.model.get("help").get('items').each(function(model) {
        return model.set("context", _this.model.get("context"));
      });
      return this.footerHelpItemCollectionView = new FooterBarItemCollectionView({
        collection: this.model.get("help").get('items'),
        className: "footerContactBar__help"
      });
    },
    createFooterContacts: function() {
      var _this = this;
      this.model.get("items").each(function(model) {
        return model.set("context", _this.model.get("context"));
      });
      this.footerBarItemCollectionView = new FooterBarItemCollectionView({
        collection: this.model.get("items"),
        itemViewOptions: {
          context: this.context
        }
      });
      return this.listenTo(this.context, "openFooterBar:click", this.openFooterContacts);
    },
    openFooterContacts: function() {
      return this.$el.toggleClass('footerContactBar_showHelp');
    },
    footerBarTexts: function(model) {
      var htmlText;
      htmlText = '<span class="footerContactBar__workTime">' + this.model.get('help').get('workTimeText') + '</span>';
      htmlText += '<span class="footerContactBar__support">' + this.model.get('help').get('supportText') + '</span>';
      htmlText += '<span class="footerContactBar__phones">' + this.createFooterPhone() + '</span>';
      htmlText += '<span class="footerContactBar__phonesBig">' + this.createFooterPhone() + '</span>';
      return htmlText;
    },
    onRender: function() {
      return this.$el.append(this.footerHelpItemCollectionView.render().el).append(this.footerBarTexts(this.model)).append(this.footerBarItemCollectionView.render().el);
    }
  });
  return FooterBarControlLayout;
});
