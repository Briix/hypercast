var path = require('path')

module.exports.appDataPath = getAppDataPath
module.exports.addScripts = addScripts

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

function addScripts (html, scripts) {
  var el = document.createElement('html')
  el.innerHTML = html

  var body = el.getElementsByTagName('body')[0]

  scripts.forEach(function(script) {
    scriptEl = document.createElement('script')
    scriptEl.innerHTML = script
    body.appendChild(scriptEl)
  })

  return el.outerHTML
}
