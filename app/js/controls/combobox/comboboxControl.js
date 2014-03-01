define(["marionette", "baseControl", "controls/combobox/controller/comboboxController", "comboboxListCollection", "inputTextControl", "dropDownListControl", "globalEvents"], function(Marionette, BaseControl, ComboboxController, ComboboxListCollection, InputTextControl, DropDownListControl, globalEvents) {
  var ComboboxView;
  return ComboboxView = BaseControl.extend({
    template: "<div class='inputTextWrapper'></div>",
    className: "comboboxControl",
    regions: {
      inputTextRegion: ".inputTextWrapper"
    },
    initialize: function(options) {
      var _this = this;
      this.context = Marionette.getOption(this, "context");
      this.eventBus = _.extend({}, Backbone.Events);
      this.dataModel = Marionette.getOption(this, "dataModel");
      this.applyModelProperties(["name", "url", "startInputLength", "inputControlModel", "dropDownListControlModel"], {
        prefix: this._attrPrefix
      });
      if (!this._inputControlModel) {
        throw new Error("InputControlModel is not defined!");
      }
      this._inputControlModel.on("change", function(model) {
        _this.initTextInputView(model);
        return _this.inputTextRegion.show(_this.inputTextView);
      });
      this.listCollection = new ComboboxListCollection();
      this.initTextInputView(this._inputControlModel);
      if (this._dropDownListControlModel) {
        this.initDropDown();
      }
      this.controller = new ComboboxController({
        inputName: this._name,
        url: this._url,
        input: this.inputTextView
      });
      _.bindAll(this, "onDropDownSelected", "onInputKeyUp", "onListData", "onWidnowResized", "onHtmlClick");
      this.eventBus.on("input:focus", this.onInputFocus);
      this.eventBus.on("input:keyup", this.onInputKeyUp);
      this.controller.on("listdata", this.onListData);
      this.on("option:selected", this.onDropDownSelected);
      globalEvents.on("window:resize", this.onWidnowResized);
      return globalEvents.on("html:click", this.onHtmlClick);
    },
    onWidnowResized: function(data) {
      var height, inputHeight, inputTop;
      inputTop = this.inputTextView.$el.offset().top;
      inputHeight = this.inputTextView.$el.height();
      height = data.height - (inputTop + inputHeight);
      return this.dropDown.setHeight(height);
    },
    onHtmlClick: function() {
      return this.dropDownRegion.close();
    },
    initDropDown: function() {
      this.selectionCompleted = false;
      return this.dropDown = new DropDownListControl({
        context: this,
        model: this._dropDownListControlModel,
        collection: this.listCollection
      });
    },
    initTextInputView: function(model) {
      return this.inputTextView = new InputTextControl({
        context: this.context,
        model: model,
        dataModel: this.dataModel,
        eventBus: this.eventBus
      });
    },
    onRender: function() {
      return this.inputTextRegion.show(this.inputTextView);
    },
    onInputKeyUp: function(data) {
      var val;
      val = data.value;
      if (val.length >= this._startInputLength) {
        return this.controller.doSearch(val);
      } else {
        return this.dropDownRegion.close();
      }
    },
    onListData: function(data) {
      this.listCollection = data.collection;
      this.dropDownRegion.reset();
      this.initDropDown();
      return this.dropDownRegion.show(this.dropDown);
    },
    onDropDownSelected: function(model) {
      if (model === "empty") {
        return this.inputTextView.setFocus();
      } else {
        this.selectionCompleted = true;
        this.displayResult(model);
        this.returnData(model);
        return this.context.trigger("focus:next");
      }
    },
    displayResult: function(model) {
      var result;
      result = model.get("name");
      if (model.has("country")) {
        result += " " + model.get("country");
      }
      if (model.has("codeIata" || model.has("codeSirena"))) {
        result += " (";
        if (model.has("codeIata")) {
          result += model.get("codeIata");
        }
        if (model.has("codeSirena")) {
          result += " " + model.get("codeSirena");
        }
        result += ")";
      }
      return this.inputTextView.setValue(result);
    },
    setInputValue: function(val) {
      return this.inputTextView.setValue(val);
    },
    returnData: function(model) {
      return this.context.trigger("collect:data", model);
    },
    patchInputTextModel: function(property, value) {
      return this._inputControlModel.set(property, value);
    },
    dropDownSelectedImitation: function(data) {
      return this.onDropDownSelected(data.model);
    },
    publicApi: function() {
      return {
        "patchInputTextModel": this.patchInputTextModel,
        "dropDownSelectedImitation": this.dropDownSelectedImitation
      };
    }
  });
});
