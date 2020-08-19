var html = require('choo/html')

module.exports = button

function button (obj) {
  return html`
    <button class=${obj.color} onclick=${obj.onclick}>
      ${obj.text}
    </button>
  `
}
