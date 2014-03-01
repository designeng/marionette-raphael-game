define [
    "boxModel"
    "dropDownListModel"
    "comboboxListCollection"
], (BoxModel, DropDownListModel, ComboboxListCollection)->

    declaration =
        componentItems:[
            {
                controlType: "navigationBarControl"
                controlModel: new Backbone.Model
                    className: "headerNav"
                    items: new Backbone.Collection([ 
                        { text: "loc_AviaTickets"   , url: "!/" }
                        { text: "loc_TrainTickets"  , url: "!/header" }
                        { text: "loc_Hotels"        , url: "!/hotels" }
                        { text: "loc_CarRental"     , url: "!/cars" }
                        { 
                            text: "loc_More"
                            url: "#"
                            preventDefault: true
                            innerComponent: 
                                innerComponentType: "dropDownListControl"
                                connectTo: "confirm"
                                behaviour:
                                    toggle: true
                                    closeWithOuterClick: true

                                model: new DropDownListModel
                                    itemType: "linkControl"
                                    width: 200
                                    height: 400
                                    className: "dropDownList header"
                                    collection: new ComboboxListCollection([
                                        { text: "loc_FlightStatus", url: "!/flight-stats"}
                                        { text: "loc_ScheduleFlights", url: "!/flight-stats/resultSort"}
                                        { text: "loc_AdditionalServices", url: "!/additional-services"}
                                    ])
                        }]
                    )
            },{
                controlType: "navigationBarControl"
                controlModel: new Backbone.Model
                    className: "userBar"
                    items: new Backbone.Collection(
                                [{ text: "loc_PersonalArea"
                                url: "!/personal"}
                                {text: "Ru"
                                url: "#"
                                preventDefault: true

                                innerComponent: {
                                    innerComponentType: "dropDownListControl"
                                    connectTo: "confirm"
                                    behaviour:
                                        toggle: true
                                        closeWithOuterClick: true

                                    # dropdown list model
                                    model: new DropDownListModel
                                        itemType: "linkControl"
                                        collection: new ComboboxListCollection(
                                                [
                                                    {text: "Ru", url: "!/ru"}
                                                    {text: "En", url: "!/en"}
                                                    {text: "De", url: "!/de"}
                                                    {text: "Es", url: "!/es"}
                                                    {text: "Lv", url: "!/lv"}
                                                ]
                                            )
                                        className: "dropDownList header"
                                        width: 50
                                        height: 400
                                }
                                }]
                    )
            }
        ]
