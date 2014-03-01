define [
    "marionette"
    "buttonModel"
    "inputTextModel"
    "boxModel"
    "dropDownListModel"
], (Marionette, ButtonModel, InputTextModel, BoxModel, DropDownListModel) ->

    CompositeFormModel = Backbone.Model.extend

    # AG-4291 specification (Backbone.Validation plugin)
    FlightNumberModel = Backbone.Model.extend
        validation:
            data:
                required: true
                pattern: 'flightNumber' # defined in FlightStatsController
                msg: 'Please enter a valid flight number'

    # AG-4291 specification (Backbone.Validation plugin)
    AutocompleteInputModel = Backbone.Model.extend
        validation:
            data:
                required: true
                msg: 'Please enter a valid ID VALUE'

    FlightStatsSwitchModel = Backbone.Model.extend
        validation:
            data:
                required: true
                msg: 'Please choose one of switchControl tabs'

    declaration =
        componentModel: new Backbone.Model(
                componentType: "form"
                # action: "stub.json"
                action: "/mock/services/flightStatesSearches"
                method: "POST"
                ajax: true
                inputErrorHandlerCid: "flightStatsFormErrorHandler"
                rootClass: "flightStats"
                itemClasses: ["switch", "inputText", "combobox_first", "combobox_second", "button", "error"]
                dataModel: new CompositeFormModel()
            )
        componentItems: [
                        {controlType: "switchControl", controlModel: new Backbone.Model(
                                name: "switch"
                                className: "switchControl"
                                width: 200
                                height: 30
                                fontSize: 20
                                inputOptions: ["loc_Route", "loc_FlightNumber"]
                                startIndex: 0
                                itemClass: "switchItem"
                                itemFocusedClass: "switchItem__focused"
                                itemSelectedClass: "switchItem__selected"
                                # showInputs: true
                            ), dataModel: new FlightStatsSwitchModel()}

                        {controlType: "inputTextControl", controlModel: new InputTextModel(
                                name: "flightNumber"
                                className: "inputTextControl flightNumber"
                                inputClassName: "inputTextControl__input"
                                placeHolder: "loc_FlightNumber"
                                # width: 738
                                # height: 32
                                # fontSize: 20
                                # errorPosition: "inline"

                                # disabled: true
                                # label: "TEST"
                                disabledLabelClassName: "inputTextControl__label--disabled"
                                disabledInputClassName: "inputTextControl__input--disabled"
                            ), dataModel: new FlightNumberModel()}

                        {controlType: "comboboxControl", controlModel: new InputTextModel(
                                name: "flightFrom"

                                innerComponent:
                                    innerComponentType: "dropDownListControl"
                                    behaviour:
                                        toggle: true
                                        closeWithOuterClick: true
                                    buffer:
                                        {layout:[
                                            (layout) ->
                                                layout.dropDownRegion = @getRegion(layout)
                                        ]}

                                    model: new DropDownListModel
                                        className: "dropDownList"
                                        height: 400
                                        listHeight: 400
                                        display: true
                                        defaultMaxItemsToShow: 10
                                        firstVisible: 0
                                        noItemsMessage: "loc_FlightPointNotFound"

                                        # item specifications
                                        itemType: "flightPointControl"
                                        itemClassName: "flightPointItem"
                                        itemHeight: 25
                                        itemOverClass: "flightPointItem--over"

                                inputControlModel: new InputTextModel(
                                    name: "flightFrom"
                                    className: "inputTextControl content__inputTextControl from"
                                    placeHolder: "loc_From"
                                    # width: 330
                                    # height: 32
                                    # fontSize: 8
                                )

                                # dropdown list
                                dropDownListControlModel: new DropDownListModel(
                                    className: "dropDownList"
                                    height: 400
                                    listHeight: 400
                                    display: true
                                    defaultMaxItemsToShow: 10
                                    firstVisible: 0
                                    noItemsMessage: "loc_FlightPointNotFound"

                                    # item specifications
                                    itemType: "flightPointControl"
                                    itemClassName: "flightPointItem"
                                    itemHeight: 25
                                    itemOverClass: "flightPointItem--over"
                                )
                                # service url
                                url: "/services/rest/v1/dictionaries/autoComplete/flightPoints"
                                startInputLength: 2
                            ), dataModel: new AutocompleteInputModel()}

                        {controlType: "comboboxControl", controlModel: new InputTextModel(
                                name: "flightTo"
                                innerComponent:
                                    innerComponentType: "dropDownListControl"
                                    behaviour:
                                        toggle: true
                                        closeWithOuterClick: true
                                    buffer:
                                        layout:[
                                            (layout) ->
                                                layout.dropDownRegion = @getRegion(layout)
                                            ]
                                        view:[
                                            (view) ->

                                            ]

                                    model: new DropDownListModel
                                        className: "dropDownList"
                                        width: 326
                                        height: 400
                                        listHeight: 400
                                        display: true
                                        defaultMaxItemsToShow: 10
                                        firstVisible: 0
                                        noItemsMessage: "loc_FlightPointNotFound"

                                        # item specifications
                                        itemType: "flightPointControl"
                                        itemClassName: "flightPointItem"
                                        itemHeight: 25
                                        itemOverClass: "flightPointItem--over"

                                inputControlModel: new InputTextModel(
                                    name: "flightTo"
                                    className: "inputTextControl content__inputTextControl to"
                                    placeHolder: "loc_To"
                                    # width: 365
                                    # height: 32
                                    # fontSize: 8
                                )

                                # dropdown list
                                dropDownListControlModel: new DropDownListModel(
                                    className: "dropDownList"
                                    width: 326
                                    height: 400
                                    listHeight: 400
                                    display: true
                                    defaultMaxItemsToShow: 10
                                    firstVisible: 0
                                    noItemsMessage: "loc_FlightPointNotFound"

                                    # item specifications
                                    itemType: "flightPointControl"
                                    itemClassName: "flightPointItem"
                                    itemHeight: 25
                                    itemOverClass: "flightPointItem--over"
                                    
                                )
                                # service url
                                url: "/services/rest/v1/dictionaries/autoComplete/flightPoints"
                                startInputLength: 2
                            ), dataModel: new AutocompleteInputModel()}

                        {controlType: "buttonControl", controlModel: new ButtonModel(
                                caption: "loc_FindFlights"
                                className: "buttonControl"
                                ajax: true
                                # event to trigger by button click
                                triggerEvent: "flightstats:process:data"
                            )}

                        {controlType: "inputError", controlModel: new BoxModel(
                                text: "inputError Error here"
                                width: 150
                                height: 80
                                # display: true
                            )}
                    ]
