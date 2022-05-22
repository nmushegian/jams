import { test } from 'tapzero'

import { jams, read } from '../jams.js'

import { readFileSync, readdirSync } from 'fs'

test('passing files and their JSON equivalents', t=> {
    readdirSync('./test/pass').forEach(filename => {
        const extension = filename.split('.').slice(-1)
        if (extension == "jams"){ // only read JAMS, look for json if jams exists
            const jams_o = jams(readFileSync(`./test/pass/${filename}`))
            const jsonfile = readFileSync(`./test/pass/${filename}`.replace('jams', 'json'))
            if (jsonfile) {
                const json_o = JSON.parse(jsonfile)
                for (const key in json_o) {
                    t.ok(jams_o[key])
                    t.deepEqual(json_o[key], jams_o[key])
                }
            }
        }
    })
})

