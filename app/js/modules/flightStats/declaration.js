define(["marionette", "buttonModel", "inputTextModel", "boxModel", "dropDownListModel"], function(Marionette, ButtonModel, InputTextModel, BoxModel, DropDownListModel) {
  var AutocompleteInputModel, CompositeFormModel, FlightNumberModel, FlightStatsSwitchModel, declaration;
  CompositeFormModel = Backbone.Model.extend;
  FlightNumberModel = Backbone.Model.extend({
    validation: {
      data: {
        required: true,
        pattern: 'flightNumber',
        msg: 'Please enter a valid flight number'
      }
    }
  });
  AutocompleteInputModel = Backbone.Model.extend({
    validation: {
      data: {
        required: true,
        msg: 'Please enter a valid ID VALUE'
      }
    }
  });
  FlightStatsSwitchModel = Backbone.Model.extend({
    validation: {
      data: {
        required: true,
        msg: 'Please choose one of switchControl tabs'
      }
    }
  });
  return declaration = {
    componentModel: new Backbone.Model({
      componentType: "form",
      action: "/mock/services/flightStatesSearches",
      method: "POST",
      ajax: true,
      inputErrorHandlerCid: "flightStatsFormErrorHandler",
      rootClass: "flightStats",
      itemClasses: ["switch", "inputText", "combobox_first", "combobox_second", "button", "error"],
      dataModel: new CompositeFormModel()
    }),
    componentItems: [
      {
        controlType: "switchControl",
        controlModel: new Backbone.Model({
          name: "switch",
          className: "switchControl",
          width: 200,
          height: 30,
          fontSize: 20,
          inputOptions: ["loc_Route", "loc_FlightNumber"],
          startIndex: 0,
          itemClass: "switchItem",
          itemFocusedClass: "switchItem__focused",
          itemSelectedClass: "switchItem__selected"
        }),
        dataModel: new FlightStatsSwitchModel()
      }, {
        controlType: "inputTextControl",
        controlModel: new InputTextModel({
          name: "flightNumber",
          className: "inputTextControl flightNumber",
          inputClassName: "inputTextControl__input",
          placeHolder: "loc_FlightNumber",
          disabledLabelClassName: "inputTextControl__label--disabled",
          disabledInputClassName: "inputTextControl__input--disabled"
        }),
        dataModel: new FlightNumberModel()
      }, {
        controlType: "comboboxControl",
        controlModel: new InputTextModel({
          name: "flightFrom",
          innerComponent: {
            innerComponentType: "dropDownListControl",
            behaviour: {
              toggle: true,
              closeWithOuterClick: true
            },
            buffer: {
              layout: [
                function(layout) {
                  return layout.dropDownRegion = this.getRegion(layout);
                }
              ]
            },
            model: new DropDownListModel({
              className: "dropDownList",
              height: 400,
              listHeight: 400,
              display: true,
              defaultMaxItemsToShow: 10,
              firstVisible: 0,
              noItemsMessage: "loc_FlightPointNotFound",
              itemType: "flightPointControl",
              itemClassName: "flightPointItem",
              itemHeight: 25,
              itemOverClass: "flightPointItem--over"
            })
          },
          inputControlModel: new InputTextModel({
            name: "flightFrom",
            className: "inputTextControl content__inputTextControl from",
            placeHolder: "loc_From"
          }),
          dropDownListControlModel: new DropDownListModel({
            className: "dropDownList",
            height: 400,
            listHeight: 400,
            display: true,
            defaultMaxItemsToShow: 10,
            firstVisible: 0,
            noItemsMessage: "loc_FlightPointNotFound",
            itemType: "flightPointControl",
            itemClassName: "flightPointItem",
            itemHeight: 25,
            itemOverClass: "flightPointItem--over"
          }),
          url: "/services/rest/v1/dictionaries/autoComplete/flightPoints",
          startInputLength: 2
        }),
        dataModel: new AutocompleteInputModel()
      }, {
        controlType: "comboboxControl",
        controlModel: new InputTextModel({
          name: "flightTo",
          innerComponent: {
            innerComponentType: "dropDownListControl",
            behaviour: {
              toggle: true,
              closeWithOuterClick: true
            },
            buffer: {
              layout: [
                function(layout) {
                  return layout.dropDownRegion = this.getRegion(layout);
                }
              ],
              view: [function(view) {}]
            },
            model: new DropDownListModel({
              className: "dropDownList",
              width: 326,
              height: 400,
              listHeight: 400,
              display: true,
              defaultMaxItemsToShow: 10,
              firstVisible: 0,
              noItemsMessage: "loc_FlightPointNotFound",
              itemType: "flightPointControl",
              itemClassName: "flightPointItem",
              itemHeight: 25,
              itemOverClass: "flightPointItem--over"
            })
          },
          inputControlModel: new InputTextModel({
            name: "flightTo",
            className: "inputTextControl content__inputTextControl to",
            placeHolder: "loc_To"
          }),
          dropDownListControlModel: new DropDownListModel({
            className: "dropDownList",
            width: 326,
            height: 400,
            listHeight: 400,
            display: true,
            defaultMaxItemsToShow: 10,
            firstVisible: 0,
            noItemsMessage: "loc_FlightPointNotFound",
            itemType: "flightPointControl",
            itemClassName: "flightPointItem",
            itemHeight: 25,
            itemOverClass: "flightPointItem--over"
          }),
          url: "/services/rest/v1/dictionaries/autoComplete/flightPoints",
          startInputLength: 2
        }),
        dataModel: new AutocompleteInputModel()
      }, {
        controlType: "buttonControl",
        controlModel: new ButtonModel({
          caption: "loc_FindFlights",
          className: "buttonControl",
          ajax: true,
          triggerEvent: "flightstats:process:data"
        })
      }, {
        controlType: "inputError",
        controlModel: new BoxModel({
          text: "inputError Error here",
          width: 150,
          height: 80
        })
      }
    ]
  };
});
