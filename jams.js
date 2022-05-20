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
jam     ::= obj | arr | str
obj     ::= WS* '{' WS* (duo (WS* duo)*)? WS* '}' WS*
arr     ::= WS* '[' WS* (jam (WS* jam)*)? WS* ']' WS*
duo     ::= str WS* jam
str     ::= SYM | '"' q_str '"'
q_str   ::= ANY*
WS      ::= [ \t\n\r]+
SYM     ::= SAFE+
SYN     ::= '{' | '}' | '[' | ']'
ANY     ::= (SAFE | WS | SYN)
SAFE    ::= #x21 | [#x24-#x5A] | [#x5E-#x7A] | #x7C | #x7E
`)
// Cast as string as it might be a buffer as from
// readFilySync
export const jams =s=> _jams(read(String(s)))

const _jams =ast=> {
    switch (ast.type) {
        case 'jam': {
            return _jams(ast.children[0])
        }
        case 'str': {
            if (ast.children.length == 1) {
                let child = ast.children[0]
                if (child.type != 'q_str') {
                    throw new Error(`Bad string: ${ast.text}`)
                }
                return _jams(child)
            }
            return ast.text
        }
        case 'q_str': {
            return ast.text
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
                let key = duo.children[0]
                if(!(key.type == 'str' || key.type == 'q_str')){
                    throw new Error(`parse error: keys can only be strings. ${key} is not a string`)
                }
                key = _jams(key)
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
