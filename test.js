import { test } from 'tapzero'

import { jams, read } from './jams.js'

const INVALID_JAMS = /Invalid JAMS/

test('jams', t=>{
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

    o = jams('[zero one]')
    t.ok(o)
    t.equal(o[0], 'zero')
    t.equal(o[1], 'one')

    o = jams('[{key val} one]')
    t.ok(o)
    t.equal(o[0]['key'], 'val')
    t.equal(o[1], 'one')

    try{
        o = jams('{key{inner val}key{inner val}}')
    }
    catch{
        t.ok(o)
    }
})

test('strings', t=>{

    let o;
    o = jams('""')
    t.equal("", o)

    o = jams(`{key "val"}`)
    t.equal(o.key, "val")

    o = jams(`{\"key \"val}`)
    t.equal(o["key "], `val`)

    // Should pass, regular escape char
    o = jams('{\key val}')
    t.equal(o[`key`], `val`)

    // Should fail, escaping an unsafe char without quotes
     t.throws( _ => {
         jams(`{\\key val}`)
     }, INVALID_JAMS)

     t.throws( _ => {
        jams(String.raw`{\key val}`)
     }, INVALID_JAMS)

    o = jams(`{key "val]"}`)
    t.equal(o.key, "val]")

    // but not stuff like this
    t.throws(_ => {
        jams(`{key val]}`)
    }, INVALID_JAMS)

    // should throw, bad quote matching
    t.throws(_ => {
        jams(`{key" val}`)
    })

    // TODO: !DMFXYZ! Escaped quotes not working
    // console.log(read(`{"key " " val! \""}`))
    // o = jams('{"key " " val!\""}')
    // t.equal(o["key "], ` val!"`)

    // o = jams(`{"key " val\"\}\}}`)
    // t.equal(o[`"key "`], `" val"}}`)

    // should work, inner jam is str with multiple words and has quotes
    o = jams(`{key "multiple word value"}`)
    t.equal(o.key, "multiple word value")

    // should parse two separate duos 
    o = jams(`{key multiple word value}`)
    t.equal(o.key, "multiple")
    t.equal(o.word, "value")
})

test('read', t=>{
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
