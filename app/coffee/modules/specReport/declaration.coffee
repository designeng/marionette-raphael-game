# TODO: remove it from project - bad practise

# it must be service adapter! do not involve mediator!
# does it tampers global scope ?
mediator = require("mediator")
param = mediator.getCurrentParam()[0]

dataArr = param.split(":")
path = dataArr[0].split("\\").join("/")
lineToScroll = dataArr[1]
# a little hack - there is no requirejs public api
requirejsConfig = requirejs.s.contexts._.config

path = path.replace(requirejsConfig["baseUrl"], "")

define [
    "marionette"
    "buttonModel"
    "inputTextModel"
    "boxModel"
    "dropDownListModel"
    "text!#{path}" # pass path as parameter
], (Marionette, ButtonModel, InputTextModel, BoxModel, DropDownListModel, jsText)->

    lines = jsText.split "\n"
    linesList = _.map(lines, (line)->
            lineModel = new Backbone.Model(
                    text: line
                )
        )

    declaration =
        componentItems: [{controlType: "dropDownListControl", controlModel: new DropDownListModel(
                                    className: "dropDownList"
                                    width: document.body.offsetWidth
                                    height: document.body.offsetHeight
                                    listHeight: document.body.offsetHeight
                                    display: true
                                    # defaultMaxItemsToShow: 10
                                    collection: new Backbone.Collection(linesList)

                                    stayOpen: true

                                    # item specifications
                                    itemType: "textControl"
                                    itemClassName: "specResultItem"
                                    itemHeight: 25
                                    itemOverClass: "specResultItem--over" 

                                    firstVisible: lineToScroll

                                    # error line will be emphasized
                                    errorItemClass: "specResultItem--error"                                                                  
                                )}

                    ]

    return declaration       
