var html = require('choo/html')

module.exports = button

function button (obj) {
  return html`
    <button class=${obj.classes} onclick=${obj.onclick}>
      ${obj.text}
    </button>
  `
}
