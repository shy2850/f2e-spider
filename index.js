const { argv } = process
const loop = require('./lib/loop')

const [ url, deepth ] = [].slice.call(argv, 2)

loop(url, {deepth})