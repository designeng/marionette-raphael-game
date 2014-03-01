define ["_.str"], () ->
    getCurrentLocale = (options) ->
        locale = requirejs.s.contexts._.config.locale

        if options and options.uppercase
            locale = _.str.classify.call(@, locale)
                
        return locale