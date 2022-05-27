import { default as gram } from 'easygram'

export const read = gram(`
jam          ::= obj | arr | str
obj          ::= WS* '{' WS* (duo (WS* duo)*)? WS* '}' WS*
arr          ::= WS* '[' WS* (jam (WS* jam)*)? WS* ']' WS*
duo          ::= str WS+ jam
str          ::= bare  | '"' quote* '"'
bare         ::= SAFE+
quote        ::= ANY*
WS           ::= [ \t\n\r]+
SYN          ::= '{' | '}' | '[' | ']'
ANY          ::= (SAFE | WS | SYN | #x5C)
SAFE         ::= #x21 | [#x23-#x5A] | [#x5E-#x7A] | #x7C | #x7E
`)

export const jams =s=> {
    const ast = read(s)
    if (ast === null || ast.errors.length > 0) throw new Error('Syntax error')
    return _jams(ast)
}

const _jams =ast=> {
    switch (ast.type) {
        case 'jam': {
            return _jams(ast.children[0])
        }
        case 'str': {
            if (ast.text === '""') return ''
            if (ast.children.length !== 1) throw new Error(`Invalid string`)
            const text = ast.children[0].text
            console.log(1)
            console.log(text)
            const escaped = text.replace('"', '\\"')
            console.log(escaped)
            const quoted = String.raw`"${text}"`
            console.log(quoted)
            const interpreted = JSON.parse(quoted)
            return String.raw`${interpreted}`
        }
        case 'arr': {
            return ast.children.map(child => _jams(child))
        }
        case 'obj': {
            const out = {}
            for (let duo of ast.children) {
                const key = _jams(duo.children[0])
                const val = _jams(duo.children[1])
                if (out[key] !== undefined) throw new Error(`Parse error: duplicate keys are prohibited at parse time`)
                out[key] = val
            }
            return out
        }
    }
    throw new Error(`panic: unrecognized AST node ${ast.type}`)
}
