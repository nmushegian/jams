import { test } from 'tapzero'

import { jams, read } from '../jams.js'

import { readFileSync, readdirSync } from 'fs'

test('passing files and their JSON equivalents', _=> {
    const subpath = './test/pass'
    readdirSync(subpath).forEach(filename => {
        const extension = filename.split('.').slice(-1)[0]
	// Only read JAMS files, and we require a corresponding JSON verison.
        if (extension === "jams") {
	    test(`${subpath}/${filename}`, t=> {
		const jamspath = `${subpath}/${filename}`
	        const jams_o = jams(readFileSync(jamspath, {encoding: 'utf8'}))
	        const jsonfile = readFileSync(jamspath.replace('jams', 'json'))
	        const json_o = JSON.parse(jsonfile)
	        t.deepEqual(Object.keys(jams_o), Object.keys(json_o))
	        for (const key in json_o) {
	    	    t.ok(jams_o[key] !== undefined)
	    	    t.deepEqual(json_o[key], jams_o[key])
	        }
	    })
        }
    })
})

test('failing files', t=> {
    const subpath = './test/fail'
    readdirSync(subpath).forEach(filename => {
		test(`${subpath}/${filename}`, t => {
        const extension = filename.split('.').slice(-1)[0]
	const filepath = `${subpath}/${filename}`
        if (extension === "jams") {
	    t.throws(
	        _ => jams(readFileSync(filepath, {encoding: 'utf8'})),
		new RegExp('(Syntax error)|(Unexpected token .* in JSON)|(Unexpected end of input)')
	    )
	}
	})
    })
})
