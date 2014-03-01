define [], () ->
    routeMap = 
        "!/":
            "header" : []
            "content": []
            "footer" : []

        "!/start":
            # "header" : ["gameWrapper"]
            "header" : []
            "content": ["game"]
            "footer" : []