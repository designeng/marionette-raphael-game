define ["marionette"
        "baseControl"
        "hbs!controls/checkbox/checkboxTpl"
        ], (Marionette, BaseControl, CheckboxTpl) ->

    CheckboxView =  BaseControl.extend
        template: CheckboxTpl

        initialize: (options) ->
            @context = Marionette.getOption @, "context"

            self = @

            @links.each((model) ->
                    linkId = "link_" + id++
                    self.model.set linkId, model
                    self.textToInsert += "<li><div control='linkControl' model='#{linkId}'/></li>"
                )        

        onRender: ->
            @$el.find("ul").html @textToInsert

    return CheckboxView
