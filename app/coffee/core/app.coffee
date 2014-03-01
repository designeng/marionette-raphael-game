define ["marionette", "mediator"], (Marionette, mediator) ->

    # TODO: mediator must be moved in root (not to be in core folder)

    return app = new Marionette.Application() unless app?


