actually minimalist JSON alternative
---

Most "minimalist" JSON alternatives have a spec that is actually longer than JSON's
and are harder to learn from a clean slate.

JSON is very close to minimal for what it can do.

JAMS is an almost-minimal variant of JSON.

Here is approximately the grammar, with optional whitespace and string rules trimmed:

```
jam  ::=  obj | arr | str
obj  ::=  '{' (duo (WS duo)*)? '}'
duo  ::=  str WS jam
arr  ::=  '[' (jam (WS jam)*)? ']'
str  ::= ... | '"' ... '"'
WS   ::= ...
```

- You don't need commas ~`,`~
- You don't need colons ~`:`~
- You don't need quotes ~`"`~ unless your string has a reserved character  \n{}[] (space)"
- JAMS are objects, arrays, or strings. There are no other value types besides strings.
  + The vast majority of the time, JSON data needs to be additionally checked
    and manipulated into the right form in your language. Being able to safely use a value type like a number
    or bool directly is a rare exception. In terms of readability and writeability of
    JAMS files, it basically makes no difference because of lack of quote requirements,
    just type what you mean directly like `1`, `1.0`, `true`, or whatever.
- String hex escape is for unicode not utf16 more like wtf16 am I right haha

Q: What does JAMS stand for?

A: Actually-Minimalist JSON Alternative


```
// testcase.jams
{
    func test
    args [arg1 "arg 2"]
    want ["" 100]
}

// wethpack.jams
{
    format dpack-1
    network ethereum
    objects {
        weth {
            objectname weth
            address 0x00
            typename Weth
            artifact ""
        }
    }
    types {
        Weth {
            typename Weth
            artifact ""
        }
    }
}
```

