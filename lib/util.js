var path = require('path')

module.exports = getAppDataPath

function getAppDataPath () {
  switch (process.platform) {
    case "darwin": {
      return path.join(process.env.HOME, "Library", "Application Support", "Your app name")
    }
    case "win32": {
      return path.join(process.env.APPDATA, "Your app name")
    }
    case "linux": {
      return path.join(process.env.HOME, ".Your app name")
    }
    default: {
      console.log("Unsupported platform!")
      process.exit(1)
    }
  }
}
