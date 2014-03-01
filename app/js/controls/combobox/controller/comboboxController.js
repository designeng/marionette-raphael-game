define(["backbone", "marionette", "comboboxListCollection", "getLocale", "core/utils/autocomplete/getLocalRefName", "core/utils/collection/item/getItemStringLength", "utils/collection/dictionary/createDictionary"], function(Backbone, Marionette, ComboboxListCollection, getLocale, getLocalRefName, getItemStringLength, createDictionary) {
  var ComboboxController, ComboboxListItemModel;
  ComboboxListItemModel = Backbone.Model.extend({
    initialize: function(options) {
      if (typeof options !== "undefined") {
        return this.set({
          name: options.name,
          codeIata: options.codeIata,
          codeSirena: options.codeSirena,
          type: options.type
        });
      }
    }
  });
  ComboboxController = Marionette.Controller.extend({
    initialize: function(options) {
      this.applyOptions(["inputName", "url", "input"]);
      this._locale = getLocale();
      return _.bindAll(this, "onSuccess");
    },
    doSearch: function(data) {
      return $.ajax({
        url: this.url,
        type: "GET",
        data: {
          query: data,
          lang: this._locale
        },
        success: this.onSuccess,
        error: this.onError
      });
    },
    onSuccess: function(responce) {
      if (typeof responce === "undefined" || (responce == null)) {
        return;
      }
      this.listCollection = this.createComboboxListCollection(responce);
      return this.trigger("listdata", {
        collection: this.listCollection,
        inputName: this.inputName
      });
    },
    onError: function(error) {
      return console.log("ERROR", error);
    },
    createComboboxListCollection: function(responce) {
      var dictionary, listCollection, locale, _inputName;
      _inputName = this.inputName;
      locale = getLocalRefName(this._locale);
      listCollection = new ComboboxListCollection();
      dictionary = createDictionary(["AIRPORT", "CITY", "COUNTRY"], responce);
      $(responce.data.items).each(function(index) {
        var city, cityName, country, countryName, dictionaryCountryModel, dictionaryModel, item, itemStringLength;
        dictionaryModel = void 0;
        dictionaryCountryModel = void 0;
        countryName = void 0;
        dictionaryModel = dictionary[this.reference.type].findWhere({
          id: this.reference.id
        });
        country = dictionaryModel.get("country");
        city = dictionaryModel.get("city");
        item = new ComboboxListItemModel({
          id: dictionaryModel.id,
          name: dictionaryModel.get(locale),
          codeIata: dictionaryModel.get("codeIata"),
          codeSirena: dictionaryModel.get("codeSirena"),
          type: this.reference.type,
          inputName: _inputName,
          modelIndex: index
        });
        if (country && country.id) {
          countryName = dictionary["COUNTRY"].findWhere({
            id: country.id
          }).get(locale);
          item.set("countryName", countryName);
        } else if (city && city.id) {
          cityName = dictionary["CITY"].findWhere({
            id: city.id
          }).get(locale);
          item.set("cityName", cityName);
        }
        itemStringLength = getItemStringLength(item);
        item.set("itemStringLength", itemStringLength);
        return listCollection.add(item);
      });
      return listCollection;
    }
  });
  return ComboboxController;
});
