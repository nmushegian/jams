actually minimal JSON alternative
---

Most "minimal" JSON alternatives have a spec at least 3x longer than JSON's
and are harder to learn from a clean slate.

JSON is very close to minimal for what it can do.

JAMSON is an actually-minimal variant of JSON (but then extended with comments)


- Restrict identifiers to non-whitespace 7-bit ascii printable chars
- Restrict strings to 7-bit ascii printable chars
- No quotes for identifiers
- No commas
- No colons
- No role models
- Restrict values to strings
- Do not require quotes for strings without whitespace
- Multi line strings by default
- Prohibit duplicate keys at parse time by specification


```
// testcase.jam
{
    func test
    args [arg1 "arg 2"]
    want ["" 100]
}

// wethpack.jam
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

