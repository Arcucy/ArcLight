// Dependencies
const log4js = require("log4js")

let SysTime = new Date()
let logTime = SysTime.getFullYear() + "-" + ("0" + (SysTime.getMonth() + 1)).slice(-2) + "-" + ("0" + SysTime.getDate()).slice(-2)
const coreLogFileName = `./logs/ArcLight-${logTime}.log`

log4js.configure({
    appenders: {
        Core: { type: "file", filename: coreLogFileName },
        console: { type: "console" }
    },
    categories: {
        ArcLight: { appenders: ["console", "Core"], level: "trace" },
        default: { appenders: ["console"], level: "trace" }
    }
})

let ArcLightLogger = log4js.getLogger("ArcLight")

function info(log) {
    ArcLightLogger.info(log)
}

function trace(log) {
    ArcLightLogger.trace(log)
}

function debug(log) {
    ArcLightLogger.debug(log)
}

function warning(log) {
    ArcLightLogger.warn(log)
}

function fatal(log) {
    ArcLightLogger.fatal(log)
}

function level(lev) {
    ArcLightLogger.level = lev
}

module.exports = {
    info,
    trace,
    debug,
    warning,
    fatal,
    level
}