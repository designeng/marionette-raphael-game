var Context, Mocha, MochaGivenSuite, Suite, Test, Waterfall, comparisonLookup, declareSpec, finalStatementFrom, getErrorDetails, invariantList, o, stringifyExpectation, utils, wasComparison, whenList,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Mocha = (typeof module !== "undefined" && module !== null ? module.parent : void 0) != null ? module.parent.require('mocha') : window.Mocha;

Suite = Mocha.Suite;

Test = Mocha.Test;

utils = Mocha.utils;

Context = Mocha.Context;

Waterfall = (function() {
  function Waterfall(context, functions, finalCallback) {
    var func, _i, _len, _ref;
    this.context = context;
    if (functions == null) {
      functions = [];
    }
    this.finalCallback = finalCallback;
    this.flow = __bind(this.flow, this);
    this.invokeFinalCallbackIfNecessary = __bind(this.invokeFinalCallbackIfNecessary, this);
    this.asyncTaskCompleted = __bind(this.asyncTaskCompleted, this);
    this.functions = functions.slice(0);
    this.asyncCount = 0;
    _ref = this.functions;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      func = _ref[_i];
      if (func.length > 0) {
        this.asyncCount += 1;
      }
    }
  }

  Waterfall.prototype.asyncTaskCompleted = function() {
    this.asyncCount -= 1;
    return this.flow();
  };

  Waterfall.prototype.invokeFinalCallbackIfNecessary = function() {
    if (this.asyncCount === 0) {
      if (this.finalCallback != null) {
        this.finalCallback.apply(this.context);
      }
      return this.finalCallback = void 0;
    }
  };

  Waterfall.prototype.flow = function() {
    var func;
    if (this.functions.length === 0) {
      return this.invokeFinalCallbackIfNecessary();
    }
    func = this.functions.shift();
    if (func.length > 0) {
      return func.apply(this.context, [this.asyncTaskCompleted]);
    } else {
      func.apply(this.context);
      return this.flow();
    }
  };

  return Waterfall;

})();

comparisonLookup = {
  '===': 'to strictly equal',
  '!==': 'to strictly differ from',
  '==': 'to equal',
  '!=': 'to differ from',
  '>': 'to be bigger than',
  '>=': 'to be bigger or equal',
  '<': 'to be smaller than',
  '<=': 'to be smaller or equal'
};

whenList = [];

invariantList = [];

o = function(thing) {
  return {
    assert: function(context, args) {
      if (!!!thing.apply(context, args)) {
        throw new Error(getErrorDetails(thing, context));
      }
    },
    isFunction: function() {
      return Object.prototype.toString.call(thing) === '[object Function]';
    },
    isString: function() {
      return Object.prototype.toString.call(thing) === '[object String]';
    },
    isNumber: function() {
      return Object.prototype.toString.call(thing) === '[object Number]';
    },
    hasArguments: function() {
      return !thing.toString().replace(/\n/g, '').match(/^function\s?\(\)/i);
    },
    firstThat: function(test) {
      var i;
      i = 0;
      while (i < thing.length) {
        if (test(thing[i]) === true) {
          return thing[i];
        }
        i++;
      }
      return void 0;
    }
  };
};

stringifyExpectation = function(expectation) {
  var matches;
  matches = expectation.toString().replace(/\n/g, '').match(/function\s?\(.*\)\s?{\s*(return\s+)?(.*?)(;)?\s*}/i);
  if (matches && matches.length >= 3) {
    return matches[2].replace(/\s+/g, ' ').replace('void 0', 'undefined');
  } else {
    return "";
  }
};

getErrorDetails = function(fn, context) {
  var comparison, expectation, expectationString, left, right;
  expectationString = stringifyExpectation(fn);
  expectation = finalStatementFrom(expectationString);
  if (comparison = wasComparison(expectation)) {
    left = (function() {
      return eval(comparison.left);
    }).call(context);
    right = (function() {
      return eval(comparison.right);
    }).call(context);
    return "     Expected '" + left + "' " + comparisonLookup[comparison.comparator] + " '" + right + "'\n     Comparison: " + expectationString + "\n";
  } else {
    return "";
  }
};

finalStatementFrom = function(expectationString) {
  var multiStatement;
  if (multiStatement = expectationString.match(/.*return (.*)/)) {
    return multiStatement[multiStatement.length - 1];
  } else {
    return expectationString;
  }
};

wasComparison = function(expectation) {
  var comparator, comparison, left, right, s;
  if (comparison = expectation.match(/(.*) (===|!==|==|!=|>|>=|<|<=) (.*)/)) {
    s = comparison[0], left = comparison[1], comparator = comparison[2], right = comparison[3];
    return {
      left: left,
      comparator: comparator,
      right: right
    };
  }
};

declareSpec = function(specArgs, itFunc) {
  var fn, label, time, timelabel;
  label = o(specArgs).firstThat(function(arg) {
    return o(arg).isString();
  });
  fn = o(specArgs).firstThat(function(arg) {
    return o(arg).isFunction();
  });
  time = o(specArgs).firstThat(function(arg) {
    return o(arg).isNumber();
  });
  timelabel = time > 0 ? "after " + (time > 1e3 ? time / 1e3 : time) + " ms, " : '';
  return itFunc("then " + timelabel + (label != null ? label : stringifyExpectation(fn)), function(done) {
    var args, expectation,
      _this = this;
    args = Array.prototype.slice.call(arguments);
    expectation = function() {
      o(fn).assert(_this, args);
      if (!o(fn).hasArguments()) {
        return done();
      }
    };
    return new Waterfall(this, [].concat(whenList, invariantList), function() {
      if (time > 0) {
        return setTimeout(expectation, time);
      } else {
        return expectation();
      }
    }).flow();
  });
};

MochaGivenSuite = function(suite) {
  var suites;
  suites = [suite];
  return suite.on('pre-require', function(context, file, mocha) {
    var Given, Invariant, Then, When, mostRecentlyUsed;
    suite.ctx = new Context;
    context.before = function(fn) {
      suites[0].beforeAll(fn);
    };
    context.after = function(fn) {
      suites[0].afterAll(fn);
    };
    context.beforeEach = function(fn) {
      suites[0].beforeEach(fn);
    };
    context.afterEach = function(fn) {
      suites[0].afterEach(fn);
    };
    context.describe = context.context = function(title, fn) {
      suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
      return suite;
    };
    context.xdescribe = context.xcontext = context.describe.skip = function(title, fn) {
      suite = Suite.create(suites[0], title);
      suite.pending = true;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
    };
    context.describe.only = function(title, fn) {
      suite = context.describe(title, fn);
      mocha.grep(suite.fullTitle());
      return suite;
    };
    context.it = context.specify = function(title, fn) {
      var test;
      suite = suites[0];
      if (suite.pending) {
        fn = null;
      }
      test = new Test(title, fn);
      suite.addTest(test);
      return test;
    };
    context.it.only = function(title, fn) {
      var reString, test;
      test = context.it(title, fn);
      reString = '^' + utils.escapeRegexp(test.fullTitle()) + '$';
      mocha.grep(new RegExp(reString));
      return test;
    };
    context.xit = context.xspecify = context.it.skip = function(title) {
      context.it(title);
    };
    mostRecentlyUsed = null;
    context.beforeEach(function() {
      var i;
      return this.currentTest.ctxKeys = (function() {
        var _results;
        _results = [];
        for (i in this.currentTest.ctx) {
          _results.push(i);
        }
        return _results;
      }).call(this);
    });
    context.afterEach(function() {
      var i, _results;
      _results = [];
      for (i in this.currentTest.ctx) {
        if (__indexOf.call(this.currentTest.ctxKeys, i) < 0) {
          _results.push(delete this.currentTest.ctx[i]);
        }
      }
      return _results;
    });
    Given = function() {
      var assignTo, fn;
      assignTo = o(arguments).firstThat(function(arg) {
        return o(arg).isString();
      });
      fn = o(arguments).firstThat(function(arg) {
        return o(arg).isFunction();
      });
      if (assignTo) {
        return context.beforeEach(function() {
          return this[assignTo] = fn.apply(this);
        });
      } else {
        return context.beforeEach.apply(this, Array.prototype.slice.call(arguments));
      }
    };
    When = function() {
      var assignTo, fn;
      assignTo = o(arguments).firstThat(function(arg) {
        return o(arg).isString();
      });
      fn = o(arguments).firstThat(function(arg) {
        return o(arg).isFunction();
      });
      if (assignTo) {
        context.beforeEach(function() {
          return whenList.push(function() {
            return this[assignTo] = fn.apply(this);
          });
        });
      } else {
        context.beforeEach(function() {
          return whenList.push(fn);
        });
      }
      return context.afterEach(function() {
        return whenList.pop();
      });
    };
    Invariant = function(fn) {
      context.beforeEach(function() {
        return invariantList.push(fn);
      });
      return context.afterEach(function() {
        return invariantList.pop();
      });
    };
    Then = function() {
      return declareSpec(arguments, context.it);
    };
    context.Given = function() {
      mostRecentlyUsed = Given;
      return Given.apply(this, Array.prototype.slice.call(arguments));
    };
    context.When = function() {
      mostRecentlyUsed = When;
      return When.apply(this, Array.prototype.slice.call(arguments));
    };
    context.Then = function() {
      mostRecentlyUsed = Then;
      return Then.apply(this, Array.prototype.slice.call(arguments));
    };
    context.Then.only = function() {
      return declareSpec(arguments, context.it.only);
    };
    context.Then.after = function() {
      mostRecentlyUsed = Then;
      return declareSpec(arguments, context.it);
    };
    context.Invariant = function() {
      mostRecentlyUsed = Invariant;
      return Invariant.apply(this, Array.prototype.slice.call(arguments));
    };
    return context.And = function() {
      return mostRecentlyUsed.apply(this, Array.prototype.slice.call(arguments));
    };
  });
};

if (typeof exports === 'object') {
  module.exports = MochaGivenSuite;
}

Mocha.interfaces['mocha-given'] = MochaGivenSuite;
