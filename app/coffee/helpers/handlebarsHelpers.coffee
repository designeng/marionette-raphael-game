define ["Handlebars", "i18n!nls/general"], (Handlebars, localized) ->

    # declation support for Handlebars. Sample {{_decl 123 '["day","day","days"]'}}
    Handlebars.registerHelper "_decl", (num, formsJSON) ->
        formsJSON = Handlebars.helpers._(formsJSON)
        forms = JSON.parse(formsJSON)
        if num % 10 is 1 and num % 100 isnt 11
            forms[0]
        else if (num % 10 >= 2) and (num % 10 <= 4) and (num % 100 < 10 or num % 100 >= 20)
            forms[1]
        else
            forms[2]

    # combobox list view
    Handlebars.registerHelper "_itemblank", (text) ->
        "<li class='combobox__list__blankItem'>" + text + "</li>"

    # i18n support
    Handlebars.registerHelper "_", (text) ->
        if arguments.length > 2
            console.log "Handlebars.registerHelper ARGS > 2"
            str = arguments[0]
            params = _.toArray(arguments).slice(1, -1)
            param = undefined
            until str.indexOf("%s") is -1
                param = (if params.length is 1 then params[0] else params.shift())
                str = str.replace(/%s/, param)
            text = str
        else
            text = localized[text]
        text

    # how to use it?
    Handlebars.registerHelper "if_eq", (context, options) ->
        return options.fn(this)  if context is options.hash.compare
        options.inverse this

    Handlebars.registerHelper "equal", (lvalue, rvalue, options) ->
        throw new Error("Handlebars Helper equal needs 2 parameters")  if arguments.length < 3
        unless lvalue is rvalue
            options.inverse this
        else
            options.fn this

    Handlebars.registerHelper "safeText", (str) ->
        if str
            str = str.replace(/\s/g, '<span class="blank">_</span>')
            # str = str.replace(/\s/g, ' ')
            # str = "<pre><code>" + str + "</code></pre>"
            new Handlebars.SafeString str

    Handlebars.registerHelper "createControlDiv", (index, classStr) ->
        str = "<div data-id='element__#{index}' class='#{classStr}'></div>"
        new Handlebars.SafeString str

