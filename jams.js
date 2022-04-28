const gram = require('easygram')

const jams = gram(`
val                  ::= obj | arr | str
WS                   ::= [ \t\n\r]+
obj                  ::= WS* "{" WS* (duo (WS duo)*)? WS* "}" WS*
duo                  ::= str WS val
arr                  ::= WS* "[" WS* (val (WS val)*)? WS* "]" WS*
str                  ::= SYM | '"' ANY* '"'
SYM                  ::= SAFE+
ANY                  ::= (SAFE | WS | "{" | "}" | "[" | "]")
SAFE                 ::= [#x21-#x26] | [#x28-#x5A] | [#x5E-#x7E]
`)

// json ebnf for strings, TODO escape chars and stuff
/*
string               ::= '"' (([#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]) | #x5C (#x22 | #x5C | #x2F | #x62 | #x66 | #x6E | #x72 | #x74 | #x75 HEXDIG HEXDIG HEXDIG HEXDIG))* '"'
HEXDIG               ::= [a-fA-F0-9]
*/

const it = require('tapzero').test

it('read', t=>{
    ast = jams(`{}`)
    t.ok(ast)

    ast = jams(`{key {key2 val}}`)
    t.ok(ast)

    ast = jams(`{ key { key2
val}}`)
    t.ok(ast)
    t.ok(ast.children[0].children)

    ast = jams(`[val val]`)
    t.ok(ast)

    ast = jams(`{"key space" val}`)
    t.ok(ast)

    ast = jams(`{key "val{"}`)
    t.ok(ast)
})
