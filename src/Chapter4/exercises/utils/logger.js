const configs = require('./config')
function error(...message) {
    if (configs.NODE_ENV === 'test') return
    console.error(...message)
}

function warn(...message) {
    if (configs.NODE_ENV === 'test') return
    console.warn(...message)
}

function trace(...message) {
    if (configs.NODE_ENV === 'test') return
    console.trace(...message)
}

function log(...message) {
    if (configs.NODE_ENV === 'test') return
    console.log(...message)
}
function info(...message) {
    if (configs.NODE_ENV === 'test') return
    console.info(...message)
}

module.exports = { error, warn, trace, log, info }
