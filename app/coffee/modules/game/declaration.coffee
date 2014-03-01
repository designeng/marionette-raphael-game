define [
], ()->

    declaration =
    	componentModel: new Backbone.Model(
                rootClass: "__game"
                itemClasses: ["gameEl", "boardEl"]
            )

        componentItems:[
            {
                controlType: "gameControl"
                controlModel: new Backbone.Model()
            },
            {
                controlType: "boardControl"
                controlModel: new Backbone.Model()
            }
        ]
