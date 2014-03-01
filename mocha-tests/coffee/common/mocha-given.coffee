Mocha     = if module?.parent? then module.parent.require('mocha') else window.Mocha
Suite     = Mocha.Suite
Test      = Mocha.Test
utils     = Mocha.utils
Context   = Mocha.Context

class Waterfall
	constructor: (@context, functions = [], @finalCallback) ->
		@functions = functions.slice(0)
		@asyncCount = 0
		for func in @functions
			@asyncCount += 1 if func.length > 0

	asyncTaskCompleted: =>
		@asyncCount -= 1
		@flow()

	invokeFinalCallbackIfNecessary: =>
		if @asyncCount == 0
			@finalCallback.apply(@context) if @finalCallback?
			@finalCallback = undefined

	flow: =>
		return @invokeFinalCallbackIfNecessary() if @functions.length == 0

		func = @functions.shift()

		if func.length > 0
			func.apply(@context, [@asyncTaskCompleted])
		else
			func.apply(@context)
			@flow()

comparisonLookup =
	'===': 'to strictly equal'
	'!==': 'to strictly differ from'
	'==' : 'to equal'
	'!=' : 'to differ from'
	'>'  : 'to be bigger than'
	'>=' : 'to be bigger or equal'
	'<'  : 'to be smaller than'
	'<=' : 'to be smaller or equal'

whenList = []
invariantList = []

o = (thing) ->

	assert: (context, args) ->
		throw new Error getErrorDetails thing, context if !!!thing.apply context, args

	isFunction: ->
		Object::toString.call(thing) is '[object Function]'

	isString: ->
		Object::toString.call(thing) is '[object String]'

	isNumber: ->
		Object::toString.call(thing) is '[object Number]'

	hasArguments: ->
		!thing.toString().replace(/\n/g,'').match(/^function\s?\(\)/i)

	firstThat: (test) ->
		i = 0
		while i < thing.length
			return thing[i] if test(thing[i]) is true
			i++
		return undefined

stringifyExpectation = (expectation) ->
	matches = expectation.toString().replace(/\n/g,'').match(/function\s?\(.*\)\s?{\s*(return\s+)?(.*?)(;)?\s*}/i)
	if matches and matches.length >= 3 then matches[2].replace(/\s+/g, ' ').replace('void 0', 'undefined') else ""

getErrorDetails = (fn, context) ->
	expectationString = stringifyExpectation(fn)
	expectation = finalStatementFrom(expectationString)
	if comparison = wasComparison(expectation)
		left = (-> eval(comparison.left)).call context # eval is evil
		right = (-> eval(comparison.right)).call context # eval is evil
		"     Expected '#{left}' #{comparisonLookup[comparison.comparator]} '#{right}'\n     Comparison: #{expectationString}\n"
	else
		""

finalStatementFrom = (expectationString) ->
	if multiStatement = expectationString.match(/.*return (.*)/)
		multiStatement[multiStatement.length - 1]
	else
		expectationString

wasComparison = (expectation) ->
	if comparison = expectation.match(/(.*) (===|!==|==|!=|>|>=|<|<=) (.*)/)
		[s, left, comparator, right] = comparison
		{left, comparator, right}

declareSpec = (specArgs, itFunc)->
	label = o(specArgs).firstThat (arg) -> o(arg).isString()
	fn    = o(specArgs).firstThat (arg) -> o(arg).isFunction()
	time  = o(specArgs).firstThat (arg) -> o(arg).isNumber()
	timelabel = if time > 0 then "after #{if time > 1e3 then time/1e3 else time} ms, " else ''
	itFunc "then #{timelabel}#{label ? stringifyExpectation(fn)}", (done) ->
		args = Array.prototype.slice.call arguments
		expectation = =>
			o(fn).assert @, args
			done() if not o(fn).hasArguments()

		new Waterfall(@, [].concat(whenList, invariantList), ->
			if time > 0
				setTimeout(expectation, time)
			else
				expectation()
		).flow()

MochaGivenSuite = (suite) ->
	suites = [suite]

	suite.on 'pre-require', (context, file, mocha) ->

		# reset context for watched tests
		suite.ctx = new Context

		context.before = (fn) ->
			suites[0].beforeAll(fn)
			return

		context.after = (fn) ->
			suites[0].afterAll(fn)
			return

		context.beforeEach = (fn) ->
			suites[0].beforeEach(fn)
			return

		context.afterEach = (fn) ->
			suites[0].afterEach(fn)
			return

		context.describe =
		context.context = (title, fn) ->
			suite = Suite.create(suites[0], title)
			suites.unshift(suite)
			fn.call(suite)
			suites.shift()
			return suite

		context.xdescribe =
		context.xcontext =
		context.describe.skip = (title, fn) ->
			suite = Suite.create(suites[0], title)
			suite.pending = true
			suites.unshift(suite)
			fn.call(suite)
			suites.shift()
			return

		context.describe.only = (title, fn) ->
			suite = context.describe(title, fn)
			mocha.grep(suite.fullTitle())
			return suite

		context.it =
		context.specify = (title, fn) ->
			suite = suites[0]
			fn = null if suite.pending
			test = new Test(title, fn)
			suite.addTest(test)
			return test

		context.it.only = (title, fn) ->
			test = context.it(title, fn)
			reString = '^' + utils.escapeRegexp(test.fullTitle()) + '$'
			mocha.grep(new RegExp(reString))
			return test

		context.xit =
		context.xspecify =
		context.it.skip = (title) ->
			context.it(title)
			return

		# mocha-given extension
		mostRecentlyUsed = null

		# get all keys in the context
		context.beforeEach ->
			@currentTest.ctxKeys = (i for i of @currentTest.ctx)

		# remove added keys to clean up what mocha messes up with a shared context
		context.afterEach ->
			delete @currentTest.ctx[i] for i of @currentTest.ctx when i not in @currentTest.ctxKeys

		Given = ->
			assignTo = o(arguments).firstThat (arg) -> o(arg).isString()
			fn = o(arguments).firstThat (arg) -> o(arg).isFunction()
			if assignTo
				context.beforeEach -> @[assignTo] = fn.apply @
			else
				context.beforeEach.apply @, Array.prototype.slice.call arguments

		When = ->
			assignTo = o(arguments).firstThat (arg) -> o(arg).isString()
			fn = o(arguments).firstThat (arg) -> o(arg).isFunction()
			if assignTo
				context.beforeEach -> whenList.push(-> @[assignTo] = fn.apply @)
			else
				context.beforeEach -> whenList.push(fn)

			context.afterEach ->
				whenList.pop()

		Invariant = (fn) ->
			context.beforeEach -> invariantList.push(fn)
			context.afterEach  -> invariantList.pop()

		Then = ->
			declareSpec arguments, context.it

		context.Given = ->
			mostRecentlyUsed = Given
			Given.apply @, Array.prototype.slice.call arguments

		context.When = ->
			mostRecentlyUsed = When
			When.apply @, Array.prototype.slice.call arguments

		context.Then = ->
			mostRecentlyUsed = Then
			Then.apply @, Array.prototype.slice.call arguments

		context.Then.only = ->
			declareSpec arguments, context.it.only

		context.Then.after = ->
			mostRecentlyUsed = Then
			declareSpec arguments, context.it

		context.Invariant = ->
			mostRecentlyUsed = Invariant
			Invariant.apply @, Array.prototype.slice.call arguments

		context.And = ->
			mostRecentlyUsed.apply @, Array.prototype.slice.call arguments

module.exports = MochaGivenSuite if typeof exports == 'object'
Mocha.interfaces['mocha-given'] = MochaGivenSuite
