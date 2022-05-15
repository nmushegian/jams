import { test } from 'tapzero'

import { jams, read } from './jams.js'

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
})

test('strings', t=>{
    let o
    o = jams('""')
    t.equal("", o)

    o = jams(`{key "val"}`)
    t.equal(o.key, "val")

    o = jams(`{\"key \"val}`)
    t.equal(o[`"key`], `"val`)

    o = jams(`{\\key val}`)
    t.equal(o[`\key`], `val`)

    o = jams(`{key" val}`)
    t.ok(!o) // err

    o = jams(`{"key " val\"\}\}}`)
    t.equal(o[`"key "`], `val"}`)
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


test('casetest sample', t=>{
    let obj = jams(`
{
  note "example casetest jams"
  func adder
  args [1 2]
  want ["" 3]
}
    `)
    t.ok(obj)
    t.equal(obj.note, "example casetest jams")
    t.equal(obj.func, "adder")
    t.equal(obj.args.length, 2)
    t.equal(obj.args[0], "1")
    t.equal(obj.args[1], "2")
    t.equal(obj.want.length, 2)
    t.equal(obj.want[0], "")
    t.equal(obj.want[1], "3")
})
