var p = require('webpage').create();
var sys = require('system');

for (var i = 1; i < sys.args.length; i++) {
  var file = sys.args[i];
  if (!p.injectJs(file)) {
    phantom.exit(1);
    throw new Error("Failed to inject " + file);
  }
}

p.onConsoleMessage = function (x) {
  var line = x;
  if (line !== "[NEWLINE]") {
    console.log(line.replace(/\[NEWLINE\]/g, "\n"));
  }
};

p.evaluate(function () {
  cemerick.cljs.test.set_print_fn_BANG_(function(x) {
    console.log(x.replace(/\n/g, "[NEWLINE]")); // since console.log *itself* adds a newline
  });
});

var success = p.evaluate(function () {
  var results = cemerick.cljs.test.run_all_tests();
  console.log(results);
  return cemerick.cljs.test.successful_QMARK_(results);
});

phantom.exit(success ? 0 : 1);
