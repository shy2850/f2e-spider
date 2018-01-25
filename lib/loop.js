const { writeFileSync, existsSync } = require('fs')
const { join } = require('path')
const { JSDOM } = require('jsdom')
const Download = require('./download')
const cwd = process.cwd()
const CONF_PATH = join(cwd, 'f2espider.js')

const REG_URL = /^https?:\/\/([^\/]+)([^?]*)/

let config = {
    deepth: 1,
    source: '*'
}
if (existsSync(CONF_PATH)) {
    config = Object.assign(config, require(CONF_PATH))
}

const loop = function loop (url, cfg) {
    const { deepth } = cfg
    JSDOM.fromURL(url, {}).then(root => {
        const { window } = root
        const { document, location } = window
        const links = document.querySelectorAll('[src],[href]')
        links.forEach(l => {
            let href = l.src || l.href
            if (REG_URL.test(href) && ~href.indexOf(location.hostname)) {
                if (deepth > 1) {
                    loop(href, { deepth: deepth - 1})
                }
                Download(href)
            }
        })
    })
}

module.exports = (url, cfg) => {
    Download(url)
    loop(url, cfg)
}