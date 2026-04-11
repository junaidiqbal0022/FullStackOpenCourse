function error(...message) {
  console.error(...message)
}

function warn(...message) {
  console.warn(...message)
}

function trace(...message) {
  console.trace(...message)
}

function log(...message) {
  console.log(...message)
}
function info(...message) {
  console.info(...message)
}

module.exports = { error, warn, trace, log, info }
