define [
	"when"
], (WhenP) ->
	WhenAll = WhenP.all

	PromisesSrc = () ->
		defereds = []

		def1 = WhenP.defer()
		defereds.push def1.promise

		def2 = WhenP.defer()
		defereds.push def2.promise

		setTimeout () ->				
				def1.resolve("test1")
			, 3000

		setTimeout () ->
				def2.resolve("test2")
			, 4000

		return WhenAll(defereds)

	return PromisesSrc