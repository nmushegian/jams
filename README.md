actually minimalist JSON alternative
---

```
import { jams } from 'jams.js'
const obj = jams('...')
```

Most "minimalist" JSON alternatives have a spec that is actually longer than JSON's
and are harder to learn from a clean slate.

JSON is very close to minimal for what it can do.

JAMS is an almost-minimal variant of JSON.

Here is an example:

```
{
  name    jams.js
  version 0.0.5
  license MIT
  type    module
  dependencies {
    easygram ^0.0.4
  }
  devDependencies {
    tapzero ^0.6.1
  }
}
```

Here is approximately the grammar, with optional whitespace and string rules trimmed:

```
jam  ::=  obj | arr | str
obj  ::=  '{' (duo (WS duo)*)? '}'
arr  ::=  '[' (jam (WS jam)*)? ']'
duo  ::=  str WS jam
str  ::= ... | '"' ... '"'
WS   ::= ...
```

- You don't need commas `,`
- You don't need colons `:`
- You don't need quotes `"` unless your string has a reserved character `\n\\ "{}[]`
  (that's a newline, backslash, space, quote, and 2 pairs of brackets)
- JAMS are objects, arrays, or strings. There are no other value types besides strings.
  + Most of the time, JSON data needs to be checked, sanitized, and transformed into the
    a native representation in your language. Being able to safely use a value type like a number
    or bool directly from a JSON file is not that common. In terms of readability and writeability of
    JAMS files, it basically makes no difference to have no other value types because of lack of quote requirements.
    Just type what you mean directly like `1`, `1.0`, `true`, `null`, or whatever.
- String hex escape is for unicode not utf16 more like wtf16 am I right haha

Q: What does JAMS stand for?

A: Actually-Minimalist JSON Alternative

Q: Where can I find information / documentation for the parser generator which this package depends on?

A: https://github.com/lys-lang/node-ebnf/blob/master/src/Parser.ts
