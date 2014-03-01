define [
	"when"
    "marionette"
    "AppSpec"
    "PromisesSrc"
	"DeffSrc"
    "moduleHash"
], (WhenP, Marionette, appSpec, PromisesSrc, DeffSrc, moduleHash) ->

    class AppCorePromises extends Marionette.Controller

        initialize: ->
            # do somth initialization work
            appSpec.setSpec @

            # define promises
            @headerPromise = moduleHash.getModuleAsPromise "header"
            @footerPromise = moduleHash.getModuleAsPromise "footer"
            
            @triggerMethod "init"

        onInit: ->
            describe "Header", ->

                before ->
                    @spec = appSpec.getSpec()                    

                after ->
                    @spec.triggerMethod "footer"
                    window.location.href = "/mocha-tests/test2.html#!/footer"

                @.timeout(3000)

                Given (done) ->
                    @spec.setPromise(@spec.headerPromise, @, "result", done)
                Then ->
                    expect(@result).to.be.an "object"
                And ->
                    expect(@result).property "declaration"
                And ->
                    expect(@result.declaration.componentItems).to.have.length 2
                And ->
                    expect(@result).property "triggerMethod"

        onFooter: ->
            describe "Footer", ->

                after ->
                    delete @spec

                @.timeout(3000)

                Given (done) ->
                    @spec.setPromise(@spec.footerPromise, @, "result", done)
                Then ->
                    expect(@result).to.be.an "object"
                And ->
                    expect(@result).property "declaration"
                And ->
                    expect(@result.declaration.componentItems).to.be.an('array')
                And ->
                    expect(@result.declaration.componentItems).to.have.length 7
                And ->
                    expect(@result).property "triggerMethod"

    appCorePromises = new AppCorePromises()

    return appCorePromises
    		
