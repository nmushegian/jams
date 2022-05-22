import { default as gram } from 'easygram'

// TODO: Here is the exact string grammar from JSON.
//       It needs to be modified to escape unicode rather than utf16.
//       It should be split into 2 char classes, those that need to be quoted,
//       like []"{} and whitespace, and those than do not require quotes.
/*
string               ::= '"' ( ( [#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]
                               ) | #x5C ( #x22 | #x5C | #x2F | #x62 | #x66
                                        | #x6E | #x72 | #x74 | #x75 HEXDIG HEXDIG HEXDIG HEXDIG
                                        )
                         )* '"'
HEXDIG               ::= [a-fA-F0-9]
*/

export const read = gram(`
jam          ::= obj | arr | str
obj          ::= WS* '{' WS* (duo (WS* duo)*)? WS* '}' WS*
arr          ::= WS* '[' WS* (jam (WS* jam)*)? WS* ']' WS*
duo          ::= str WS+ jam
str          ::= bare  | '"' quote '"'
bare         ::= SAFE+
quote        ::= ANY*
WS           ::= [ \t\n\r]+
SYN          ::= '{' | '}' | '[' | ']'
ANY          ::= (SAFE | WS | SYN | UNSAFE)
SAFE         ::= #x21 | [#x24-#x5A] | [#x5E-#x7A] | #x7C | #x7E
UNSAFE       ::= ESCAPE unsafe
ESCAPE       ::= #x5C
unsafe       ::= #x22 | #x5C
`)

export const jams =s=> {
    // Cast as string so we can accept a few other types
    const str = String(s)
    const ast = read(str)
    if (ast === null) throw new Error('Syntax error')
    return _jams(ast)
}

const _jams =ast=> {
    switch (ast.type) {
        case 'jam': {
            return _jams(ast.children[0])
        }
        case 'str': {
            if (ast.children.length != 1) {
                throw new Error(`Invalid string`)
            }
            return ast.children[0].text
        }
        case 'arr': {
            const arr = []
            for (let jam of ast.children) {
                arr.push(_jams(jam))
            }
            return arr
        }
        case 'obj': {
            const out = {}
            for (let duo of ast.children) {
                const key = _jams(duo.children[0])
                const val = _jams(duo.children[1])
                if (out[key] !== undefined) {
                    throw new Error(`parse error: duplicate keys are prohibited at parse time`)
                }
                out[key] = val
            }
            return out
        }
    }
    throw new Error(`panic: unrecognized AST node ${ast.type}`)
}
