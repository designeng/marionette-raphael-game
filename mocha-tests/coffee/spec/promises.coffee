define [
	"when"
    "marionette"
    "AppSpec"
    "PromisesSrc"
	"DeffSrc"
], (WhenP, Marionette, appSpec, PromisesSrc, DeffSrc) ->

    class TestTest extends Marionette.Controller

        initialize: ->
            appSpec.setSpec @
            # do somth initialization work
            @triggerMethod "init"

        onInit: ->
            describe "Apple", ->

                before ->
                    @spec = appSpec.getSpec()
                    @prom = new DeffSrc()

                after ->
                    delete @spec
                    delete @prom

                @.timeout(5000)

                Given (done) ->
                    @spec.setPromise(@prom, @, "result", done)

                Then ->
                    expect(@result).to.be.a('object')
                And ->
                    console.log @result
                    expect(@result).property "one"


    testInstanse = new TestTest()

    return testInstanse
    		
