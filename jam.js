
const gram = require('easygram')


const json = gram(`
value                ::= false | null | true | object | array | number | string
BEGIN_ARRAY          ::= WS* #x5B WS*  /* [ left square bracket */
BEGIN_OBJECT         ::= WS* #x7B WS*  /* { left curly bracket */
END_ARRAY            ::= WS* #x5D WS*  /* ] right square bracket */
END_OBJECT           ::= WS* #x7D WS*  /* } right curly bracket */
NAME_SEPARATOR       ::= WS* #x3A WS*  /* : colon */
VALUE_SEPARATOR      ::= WS* #x2C WS*  /* , comma */
WS                   ::= [#x20#x09#x0A#x0D]+   /* Space | Tab | \n | \r */
false                ::= "false"
null                 ::= "null"
true                 ::= "true"
object               ::= BEGIN_OBJECT (member (VALUE_SEPARATOR member)*)? END_OBJECT
member               ::= string NAME_SEPARATOR value
array                ::= BEGIN_ARRAY (value (VALUE_SEPARATOR value)*)? END_ARRAY
 
number                ::= "-"? ("0" | [1-9] [0-9]*) ("." [0-9]+)? (("e" | "E") ( "-" | "+" )? ("0" | [1-9] [0-9]*))?
 
/* STRINGS */
 
string                ::= '"' (([#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]) | #x5C (#x22 | #x5C | #x2F | #x62 | #x66 | #x6E | #x72 | #x74 | #x75 HEXDIG HEXDIG HEXDIG HEXDIG))* '"'
HEXDIG                ::= [a-fA-F0-9]
`)

const jams = gram(`
val                  ::= obj | arr | str
WS                   ::= [ \t\n\r]+
obj                  ::= WS* "{" WS* (duo (WS duo)*)? WS* "}" WS*
duo                  ::= str WS val
arr                  ::= WS* "[" WS* (val (WS val)*)? WS* "]" WS*
str                  ::= [A-za-z0-9]+ | '"' [A-za-z0-9 \n\t\r]* '"'


string               ::= '"' (([#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]) | #x5C (#x22 | #x5C | #x2F | #x62 | #x66 | #x6E | #x72 | #x74 | #x75 HEXDIG HEXDIG HEXDIG HEXDIG))* '"'
HEXDIG               ::= [a-fA-F0-9]
`)

const it = require('tapzero').test

it('read', t=>{
    let ast = json(`{}`)
    t.ok(ast)
    ast = json(`{"key":"val"}`)
    t.ok(ast)

    ast = json(`{"key":{"key2":"val"}}`)
    t.ok(ast)

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
})
