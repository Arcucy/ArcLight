// Local
const Log = require("./log")

// Pre-defined value
const ignoraceNotice = "Ignore this message if this is working as intended."

// Global Data
let Storage = new Map()

// Global Control
function Add(name, reference) {
    // Check eval
    if (Storage.has(name)) {
        Log.warning("Global Variable Control: Variable is been set twice, ignored change." + ignoraceNotice)
        return false    
    }

    Storage.set(name, reference)
    return true
}

function Remove(name) {
    if (!Storage.has(name)) {
        Log.warning("Global Variable Control: Variable removal is terminated because variable is not exist, ignore change." + ignoraceNotice)
        return false
    }

    Storage.delete(name)
    return true
}

function Read(name) {
    if (!Storage.has(name)) {
        Log.warning("Global Variable Control: Variable read failed because variable is not exist, ignore action." + ignoraceNotice)
        return undefined
    }

    return Storage.get(name)
}

function Write(name, reference) {
    if (!Storage.has(name)) {
        Log.warning("Global Variable Control: Variable write failed because variable is not exist, ignore action." + ignoraceNotice)
        return false
    }

    Storage.set(name, reference)
    return true
}

module.exports = {
    Add,
    Remove,
    Read,
    Write
}