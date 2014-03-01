require.config

    baseUrl: "/app/js"

    packages: [
        "core"
    ]

    paths:
        # vendors 

        "jquery"                        : "vendors/jquery.min"
        "jquery.ScrollTo"               : "vendors/jquery-scrollto"
        "jquery.maskedinput"            : "vendors/jquery.maskedinput"
        "jquery.placeholder"            : "vendors/jquery.placeholder"
        "underscore"                    : "vendors/underscore"
        "_.str"                         : "vendors/underscore.string"
        "moment"                        : "vendors/moment"
        "backbone"                      : "vendors/backbone"
        "backbone.eventbinder"          : "vendors/backbone.eventbinder"
        "backbone.raphael"              : "vendors/backbone.raphael"
        "backbone.babysitter"           : "vendors/backbone.babysitter"
        "marionette"                    : "vendors/backbone.marionette"
        "backbone.wreqr"                : "vendors/backbone.wreqr"
        "modelbinder"                   : "vendors/Backbone.ModelBinder"
        "backbone.validation"           : "vendors/backbone.validation"
        "localstorage"                  : "vendors/backbone.localStorage"
        "Handlebars"                    : "vendors/handlebars"
        "flat"                          : "vendors/flat"
        "text"                          : "vendors/requirejs-text/text"
        "hbs"                           : "vendors/hbs"
        "tpl"                           : "vendors/tpl"
        "templates"                     : "../templates"
        "handlebarsHelpers"             : "helpers/handlebarsHelpers"
        "i18n"                          : "vendors/i18n"
        "msgs"                          : "vendors/msgs/msgs"

        "superagent"                    : "vendors/superagent"
        
        "bacon"                         : "vendors/Bacon"
        "eventstreams"                  : "vendors/backbone.eventstreams"

        # when with extentions
        "when"                          : "vendors/when/when"
        "function"                      : "vendors/when/function"
        "callbacks"                     : "vendors/when/callbacks"

        # meld with extentions
        "meld"                          : "vendors/meld"
        "trace"                         : "vendors/aspect/trace"

        # core

        "appinstance"   : "core/app"
        "mediator"      : "core/mediator"
        "appbootstrap"  : "core/appbootstrap"
        "vent"          : "core/vent"
        "overridden"    : "core/overridden"
        "extended"      : "core/extended"

        # registrators

        "regionModuleRegistrator"       :   "core/modules/page/registrator/regionModuleRegistrator"
        "moduleHash"                    :   "core/modules/page/registrator/moduleHash"

        # route processor

        "routeProcessor": "core/modules/root/routeprocessor/index"
        "routemap"      : "routeMap"


        # root modules

        "rootModule"    : "core/modules/root/rootModule"
        "rootController": "core/modules/root/rootController"
        "rootRouter"    : "core/modules/root/rootRouter"

        # page module

        "pageModule"    : "core/modules/page/pageModule"
        "pageController": "core/modules/page/pageController"
        "pageLayout"    : "core/modules/page/pageLayout"

        # base

        "baseViewObject"        : "core/base/object/baseViewObject"
        "baseLayoutObject"      : "core/base/object/baseLayoutObject"
        "baseControllerObject"  : "core/base/object/baseControllerObject"

        "baseRouter"            : "core/base/baseRouter"
        "baseModule"            : "core/base/baseModule"
        "baseLayout"            : "core/base/baseLayout"
        "baseComponent"         : "core/base/component/baseComponent"
        "baseControlWrapper"    : "core/base/baseControlWrapper"
        "baseInput"             : "core/base/baseInput"
        "baseActiveKey"         : "core/base/baseActiveKey"
        "baseControl"           : "core/base/baseControl"

        "baseBlockController"   : "core/base/baseBlockController"       


        # ioc

        "resolver"                  : "core/ioc/resolver"

        # services

        "globalEvents"              : "core/services/events/globalEvents"
        "controlContainerService"   : "core/services/controls/controlContainer"
        "renderingService"          : "core/services/controls/renderingService"

        "getLocale"                 : "core/utils/config/getCurrentLocale"


        # modules

        "gameWrapper" : "modules/gameWrapper/gameWrapperController"
        "game"        : "modules/game/gameController"

        # controls

        "startGameControl"   : "controls/startGame/startGameControl"
        "boardControl"   : "controls/board/boardControl"
        "gameControl"        : "controls/game/gameControl"



    shim:
        marionette: ["backbone"]
        handlebarsHelpers: ["Handlebars"]
        "_.str":
            deps: ["underscore"]
        Handlebars:
            exports: "Handlebars"
        backbone:
            deps: ["underscore", "jquery"]
            exports: "Backbone"
        "eventstreams":
            deps: ["backbone", "bacon"]
        "modelbinder":
            deps: ["backbone"]
        "backbone.validation":
            deps: ["backbone"]
        "backbone.wreqr":
            deps: ["backbone"]
        "backbone.babysitter":
            deps: ["backbone"]
        "backbone.raphael":
            deps: ["backbone"]
        "jquery.ScrollTo":
            deps: ['jquery']
            exports: "$.fn.ScrollTo"
        "jquery.maskedinput":
            deps: ['jquery']
        "jquery.placeholder":
            deps: ['jquery']
        "flat":
            exports: "flat"

    hbs:
        templateExtension: "html"
        disableI18n: true

    locale: "ru"
