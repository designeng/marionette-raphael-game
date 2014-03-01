define [
        "marionette"
        "buttonControl"
        "buttonModel"
], (Marionette, ButtonControl, ButtonModel) ->

    BoxControlView = Marionette.Layout.extend
        template: "{{text}}<div class='streamDetector'>closeButton</div><span></span>"
        # template: "{{text}}"

        className: ->
            @defaultClassName("box")

        events:{
            "click": "onClick"
        }

        initialize: (options) ->
            @context = Marionette.getOption @, "context"

            @model.on "change", (model) =>
                console.log "CHANGED", model
                @$el.html(model.get "text")

            _.bindAll @, "onCollectedData"
            @context.on "collected:data", @onCollectedData

            # @es = @.asEventStream("noEvent")
            #     .map((val)=>
            #             return "1234567 " + val
            #         )
            #     .toProperty("Up")


            # @_FirstStream = new Bacon.Bus()

            # @first = @_FirstStream
            #     .map (v) -> return v
            #     .toProperty()


            # setTimeout(()=>
            #     @_FirstStream.push 123
            # , 100)

            # setTimeout(()=>
            #     console.log "first:::", @first, @_FirstStream.toProperty()
            # , 200)

            # plus = (a,b) -> return a + b
            # Bacon.sequentially(1, [1,2,3]).scan(0, plus).log()

            # stream = Bacon.fromBinder((sink) ->
            #         sink "first value"
            #         sink [new Bacon.Next("2nd"), new Bacon.Next("3rd")]
            #         sink new Bacon.Next () ->
            #                 "This one will be evaluated lazily"
            #         # sink(new Bacon.Error("oops, an error"))
            #         # sink(new Bacon.End())
            #         return () ->
            #             # nothing
            #     )

            # # unsub functionality here, this one's a no-op
            # test = stream.toProperty().log()
            


        onCollectedData: (evtData) ->
            if evtData.data.data
                text = ""
                for item in evtData.data.data
                    text += item.name + " - " + item.data + "<br>"
                
                @model.set("text", text)

        onRender: ->

            # @es.onValue (val) ->
            #     console.log  "value is", val

            # setTimeout(() =>
            #     @trigger "noEvent", "123"
            # , 1000)

            # setTimeout(() =>
            #     @trigger "noEvent", "4567"
            # , 2000)
            

        onClose: ->
