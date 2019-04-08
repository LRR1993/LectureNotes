mocha [spec..]

Run tests with Mocha

Commands
mocha debug [spec..] Run tests with Mocha [default]
mocha init <path> create a client-side Mocha setup at <path>

Rules & Behavior
--allow-uncaught Allow uncaught errors to propagate [boolean]
--async-only, -A Require all tests to use a callback (async) or
return a Promise [boolean]
--bail, -b Abort ("bail") after first test failure [boolean]
--check-leaks Check for global variable leaks [boolean]
--delay Delay initial execution of root suite [boolean]
--exit Force Mocha to quit after tests complete [boolean]
--forbid-only Fail if exclusive test(s) encountered [boolean]
--forbid-pending Fail if pending test(s) encountered [boolean]
--global, --globals List of allowed global variables [array]
--retries Retry failed tests this many times [number]
--slow, -s Specify "slow" test threshold (in milliseconds)
[number][default: 75]
--timeout, -t, --timeouts Specify test timeout threshold (in milliseconds)
[number][default: 2000]
--ui, -u Specify user interface [string][default: "bdd"]

Reporting & Output
--color, -c, --colors Force-enable color output [boolean]
--diff Show diff on failure
[boolean][default: true]
--full-trace Display full stack traces [boolean]
--growl, -G Enable Growl notifications [boolean]
--inline-diffs Display actual/expected differences
inline within each string [boolean]
--reporter, -R Specify reporter to use
[string][default: "spec"]
--reporter-option, --reporter-options, Reporter-specific options
-O (<k=v,[k1=v1,..]>) [array]

Configuration
--config Path to config file [default: (nearest rc file)]
--opts Path to `mocha.opts` [string][default: "./test/mocha.opts"]
--package Path to package.json for config [string]

File Handling
--exclude Ignore file(s) or glob pattern(s)
[array][default: (none)]
--extension, --watch-extensions File extension(s) to load and/or watch
[array][default: js]
--file Specify file(s) to be loaded prior to root
suite execution [array][default: (none)]
--recursive Look for tests in subdirectories [boolean]
--require, -r Require module [array][default: (none)]
--sort, -S Sort test files [boolean]
--watch, -w Watch files in the current working directory
for changes [boolean]

Test Filters
--fgrep, -f Only run tests containing this string [string]
--grep, -g Only run tests matching this string or regexp [string]
--invert, -i Inverts --grep and --fgrep matches [boolean]

Positional Arguments
spec One or more files, directories, or globs to test
[array]default: ["test"]]

Other Options
--help, -h Show usage information & exit [boolean]
--version, -V Show version number & exit [boolean]
--interfaces List built-in user interfaces & exit [boolean]
--reporters List built-in reporters & exit [boolean]

Mocha Resources
Chat: https://gitter.im/mochajs/mocha
GitHub: https://github.com/mochajs/mocha.git
Docs: https://mochajs.org/
