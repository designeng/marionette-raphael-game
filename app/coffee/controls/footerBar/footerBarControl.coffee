define [
    "marionette"
    "baseControlWrapper"
], (Marionette, BaseControlWrapper) ->

    FooterBarItemView = BaseControlWrapper.extend
        tagName: "li"
        className: "footerContactBar__linkItem"

    FooterBarItemCollectionView = Marionette.CollectionView.extend
        tagName: "ul"
        className: "footerContactBar__link"
        itemView: FooterBarItemView

    FooterBarControlLayout = Marionette.Layout.extend
        className: ->
            return @model.get "className" if @model

        initialize: (options) ->
            @context = Marionette.getOption @, "context"
            @createFooterContacts()
            @createFooterHelp()

        createFooterPhone: ->
            htmlPhone = ''
            for phone in @model.get("phones")
                htmlPhone += if htmlPhone isnt'' then '<span class="footerContactBar__phonesComma">,</span><span class="footerContactBar__phonesText">'+phone+'</span>' else '<span class="footerContactBar__phonesText">'+phone+'</span>'
            return htmlPhone

        createFooterHelp: ->
            @model.get("help").get('items').each (model) =>
                model.set "context", @model.get("context")

            @footerHelpItemCollectionView = new FooterBarItemCollectionView
                collection: @model.get("help").get('items')
                className: "footerContactBar__help"

        createFooterContacts: ->
            @model.get("items").each (model) =>
                model.set "context", @model.get("context")

            @footerBarItemCollectionView = new FooterBarItemCollectionView
                collection: @model.get("items")
                itemViewOptions : {
                    context: @context
                }

            @listenTo(@context, "openFooterBar:click", @openFooterContacts)     # навешиваем слушателя на событие клика по плашке футтера

        openFooterContacts: ->
            @$el.toggleClass('footerContactBar_showHelp')

        footerBarTexts: (model) -> # @TODO в teamplate
            htmlText = '<span class="footerContactBar__workTime">'+@model.get('help').get('workTimeText')+'</span>'
            htmlText +='<span class="footerContactBar__support">'+@model.get('help').get('supportText')+'</span>'
            htmlText +='<span class="footerContactBar__phones">'+@createFooterPhone()+'</span>' 
            htmlText +='<span class="footerContactBar__phonesBig">'+@createFooterPhone()+'</span>' 

            return htmlText

        onRender: ->
            @$el
                .append( @footerHelpItemCollectionView.render().el ) 
                .append( @footerBarTexts(@model) )
                .append( @footerBarItemCollectionView.render().el )

    return FooterBarControlLayout