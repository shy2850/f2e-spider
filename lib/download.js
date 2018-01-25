const { writeFileSync, existsSync, mkdirSync, createWriteStream } = require('fs')
const { join, dirname } = require('path')
const Request = require('request')
const cwd = process.cwd()
const REG_URL = /^https?:\/\/([^\/]+)([^?]*)/

const mkdirDeep = (path) => {
    let paths = [dirname(path)]
    while (!existsSync(paths[0])) {
        paths.unshift(dirname(paths[0]))
    }
    paths.forEach(p => existsSync(p) || mkdirSync(p))
}

let renderedURL = {}
const download = function download(url) {
    url = url.split('?')[0]
    if (renderedURL[url]) {
        return
    }
    renderedURL[url] = 1
    if (REG_URL.test(url)) {
        const [u, host, pathname] = url.match(REG_URL)
        const path = join(cwd, host, pathname)
        console.log(path)
        if (existsSync(path)) {
            return
        }
        mkdirDeep(path)
        setTimeout(function (params) {
            try {
                Request(url).pipe(createWriteStream(path))
            } catch (e) {
                console.log(url, e)
            }
        }, 200 * Object.keys(renderedURL).length)

    }
}

module.exports = download