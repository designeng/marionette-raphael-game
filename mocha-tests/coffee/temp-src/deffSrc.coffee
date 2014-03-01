define [
	"when"
], (WhenP) ->
	def = undefined

	obj = {
		one: 1
	}

	DeffSrc = () ->
		console.log "DeffSrc"
		def = WhenP.defer()

		# $.ajax(
  # 			url: "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"
		# ).done (res) ->
		# 	def.resolve(res)

		setTimeout(()=>
		    def.resolve(obj)
		, 400)

		return def.promise

	return DeffSrc