define [
    "marionette"
    "modelbinder"
], (Marionette) ->

    # template must be simple - with minimum handlebars logic inside
    # all fields to render should be placed in tplModel (see below)

    # Usage examples.
    # 
    # 1) if no "bindings" attribute settled in control model - all rendering fields must be in tplModel object
    # Template:
    # <ul>
    #     <li>{{tplModel.fromField}}</li>
    #     <li>{{tplModel.toField}}</li>
    # </ul>
    # 
    # 2) if this view model attribute "bindings" exists: we use Marionette.ModelBinder for binding to template elements.
    # Binding should be done this way (accordingly Marionette.ModelBinder documentation):
    # in model written:
    #   .   .   .   .   .   .   
    #   bindings:
    #       fromField: '[name=fromField]'
    #       toField: '[name=toField]'
    # Template:
    # <ul>
    #   <li name="fromField"></li>
    #   <li name="toField"></li>
    # </ul>

    SimpleTplView = Marionette.ItemView.extend
        className: ->
            @model.get "className" if @model

        initialize: ->
            @applyModelProperties([
                "tplModel"
                "bindings"
            ], {prefix: @_attrPrefix})

            @template = @model.get('tpl')

        onBeforeRender: ->
            # you can place in tplModel all text fileds intended for rendering in template
            # they'll be accessed via {{tplModel.somefield}} in handlebars notation
            # all they will be localized before rendering
            if @_tplModel
                @_tplModel = @prepareTemplateFields(@_tplModel)

                unless @_bindings
                    @template = @template
                        tplModel: @_tplModel.toJSON()

        onRender: ->
                # if bindings settled in control model
                if @_bindings
                    @modelBinder = new Backbone.ModelBinder()
                    @modelBinder.bind(@_tplModel, this.el, @_bindings)


        prepareTemplateFields: (model) ->
            newModel = new Backbone.Model()

            if model.attributes
                for attr of model.attributes
                    value = model.attributes[attr]
                    localizedValue = @prepareLocalized value, "string"
                    newModel.set attr, localizedValue

            return newModel

        # public method for change tplModel field
        setTemplateField: (attribute, value) ->
            value = @prepareLocalized value, "string"
            @_tplModel.set attribute, value

        # public api provider
        publicApi: () ->
            return {
                "setTemplateField": @setTemplateField
            }

    return SimpleTplView

