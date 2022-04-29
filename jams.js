const gram = require('easygram')

const read = gram(`
jam     ::= obj | arr | str
obj     ::= WS* "{" WS* (duo (WS* duo)*)? WS* "}" WS*
arr     ::= WS* "[" WS* (jam (WS* jam)*)? WS* "]" WS*
duo     ::= str WS* jam
str     ::= SYM | '"' ANY* '"'

WS      ::= [ \t\n\r]+
SYM     ::= SAFE+
ANY     ::= (SAFE | WS | "{" | "}" | "[" | "]")
SAFE    ::= #x21 | [#x24-#x5A] | [#x5E-#x7A] | #x7C | #x7E
`)

// json ebnf for strings, TODO escape chars and stuff
/*
string               ::= '"' ( ( [#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]
                               ) | #x5C ( #x22 | #x5C | #x2F | #x62 | #x66
                                        | #x6E | #x72 | #x74 | #x75 HEXDIG HEXDIG HEXDIG HEXDIG
                                        )
                         )* '"'
HEXDIG               ::= [a-fA-F0-9]
*/

const _jams =ast=> {
    if ('jam' == ast.type) {
        return _jams(ast.children[0])
    }
    if ('obj' == ast.type) {
        if (ast.children.length == 0) {
            return {}
        } else {
            const out = {}
            for (let duo of ast.children) {
                const key = _jams(duo.children[0])
                const val = _jams(duo.children[1])
                out[key] = val
            }
            return out
        }
    }
    if ('str' == ast.type) {
        return ast.text
    }
    if ('val' == ast.type) {
        return _jams(ast.children[0])
    }
    throw new Error(`unimplemented ${ast.type}`)
}

const jams =s=> _jams(read(s))

const it = require('tapzero').test

it('jams', t=>{
    let o = jams('{}')
    t.ok(o)
    t.equal(typeof(o), 'object')
    t.equal(0, Object.keys(o).length)

    o = jams('{key val}')
    t.ok(o)
    t.ok(typeof(o), 'object')
    t.equal(1, Object.keys(o).length)
    t.equal(o['key'], 'val')

    o = jams('{outer{inner val}}')
    t.ok(o)
    t.equal(1, Object.keys(o).length)
    t.equal(o['outer']['inner'], 'val')

    o = jams('{outer{inner val}smushed{inner val2}}')
    t.ok(o)
    t.equal(o['outer']['inner'], 'val')
    t.equal(o['smushed']['inner'], 'val2')
})

it('read', t=>{
    let ast = read(`{}`)
    t.ok(ast)

    ast = read(`{key {key2 val}}`)
    t.ok(ast)

    ast = read(`{ key { key2
val}}`)
    t.ok(ast)
    t.ok(ast.children[0].children)

    ast = read(`[val val]`)
    t.ok(ast)

    ast = read(`{"key space" val}`)
    t.ok(ast)

    ast = read(`{key "val{"}`)
    t.ok(ast)
})
