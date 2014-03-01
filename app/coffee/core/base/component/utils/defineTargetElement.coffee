define ->

    defineTargetElement = (collectionView, index) ->
        findSelector = "[data-id='#{@cid}__#{index}']"                  # default items
        findSelector = "[data-id='element__#{index}']" if @_rootClass   # root items (has componentModel)
        targetElement = collectionView.$el.find( findSelector )

        unless targetElement.length
            unless @_rootClass 
                throw new Error "HTML element with data-id='#{@cid}__#{index}' is not found! Check your template"
            else
                throw new Error "HTML element with data-id='element__#{index}' is not found! Your declaration componentModel.itemClasses may has not correspondence with componentItems"

        return targetElement

