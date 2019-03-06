# Using regexp

All regexps are only usual for GENERAL pattern finding. If you want to do something specific, i.e. look for exact characters, there are better string methods available.

## Regexp Methods

### Test

Returns a true if a string matches the regex pattern. This is a property on a regexp.

eg.

```js
/[a-z]/.test('a') // returns true
/[a-z]/.test('2') // returns false
/[a-z]/.test('2a') // returns true

```

What are the conditions we'd want to use this logic on? It almost always conditional, as with most things that return bools.

#### Where might you want to use this?

Password validation in front end logic would be good - checking that a password conforms to certain rulesets in order to ensure its security. For example, it might need to be 8-12 characters, contain 1 number, and a mix of cases. What would that look like?

```js
// two approaches :

// simple regex building

const uppercase = /[A-Z]/g;
const lowercase = /[a-z]/g;
const numbers = /[0-9]/g;

const pw = "N0rthc0der7";

lowercase.test(pw) && uppercase.test(pw) && numbers.test(pw);

// complex regex building

// we can use a series of positive lookaheads which check in the pattern exists, preceded by any number of any characters.

/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(pw);
```

## Exec

This method is rarely useful, but occasionally very useful.

Usually used in conjunction with the global flag, it keeps track of matches, and progresses through a string with each invocation. Therefore it's usually most useful in a for loop.

```js
const letterNumberGrouping = /[a-z]+\d+/g;

const string = "812hiya1988tasty455howdy434";

const a = letterNumberGrouping.exec(string)[0]; // 'hiya1988'
const b = letterNumberGrouping.exec(string)[0]; // 'tasty455'
const c = letterNumberGrouping.exec(string)[0]; // 'howdy434'
const d = letterNumberGrouping.exec(string); // null
```

If you're familiar with `match`, which we'll cover in a minute, to the untrained eye `exec` could look like a rubbish version of it. However, it behaves differently with capture groups.

```js
const letterNumberGrouping = /([a-z]+)\d+/g;

const string = "812hiya1988tasty455howdy434";

const a = letterNumberGrouping.exec(string)[1]; // 'hiya'
const b = letterNumberGrouping.exec(string)[1]; // 'tasty'
const c = letterNumberGrouping.exec(string)[1]; // 'howdy'
const d = letterNumberGrouping.exec(string); // null
```

When used with a `while` loop, this can become very powerful.

```js
const namesAndIds = /([A-z]+)(\d+)/g;

const str =
  "Sam76385223411200504Nicki79870767466Mitch6733232935128754Vel121212611654David327892332338454Jonny166831148992Tom221241886737331868Anat70216189914Izzi194900668732Alex34233239431915272Paul200738165306";

let match;
const names = [];
const ids = [];

while ((match = namesAndIds.exec(str))) {
  const [wholeMatch, name, id] = match;
  names.push(name);
  ids.push(+id);
}
```

#### Where might you want to use this?

When wanting to systematically gather a capture group or groups, based on a larger pattern. Parsing CSV style data into JS objects for example.

## String Methods that use Regexp

### Match

Very frequently useful, very frequently misused.

`match` is a string method which takes a regex, and returns an array of the whole WHOLE match, ignoring capture groups, or `null` when no matches are found.

```js
const aNb = "abba banana";
const as = aNb.match(/a/g); // ['a', 'a', 'a', 'a', 'a'];
const bas = aNb.match(/ba/g); // ['ba', 'ba'];
const cs = aNb.match(/c/g); // null
```

The null return value breaks a lot of people's code, generally as they assume `str.match(/regex/)` will always return an array, and try to access it or use an array method. Always check with conditional logic that you have an array, or do this:

```js
const me = /sam/gi;

const str = "hiya";

const allMatches = str.match(me) || [];
```

This `or` operator will assign the right hand value if the left hand is falsy.

#### When to use it

Very similar to exec, but with less information available for each match. Use it when you require matches in an array, and are not interested in capture groups, index positions, etc.

Do NOT use it instead of test.

### Replace

Does what it says on the tin. Replaces one or all regexp matches in a string with something else. The use of the global flag is important here.

```js
const selfDoubtSentence =
  "hi there... I was wondering if you would go to prom with me ...?";

const overconfidenceSentence = selfDoubtSentence.replace(/\.{3}/g, "!");
```

You can also take advantage of capture groups in replace, which is where regex replace really comes into its element.

```js
const normalSentence = "Welcome to the old world!";

const yeOldSentence = normalSentence
  .replace("the", "ye")
  .replace(/(d)([\s\.!\?])/g, "$1e$2");
```

### Search

Works exactly the same as indexOf, except it takes a pattern rather than a char/ string.
