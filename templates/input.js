var html = require('choo/html')

module.exports.textInput = textInput
module.exports.selectInput = selectInput

function textInput (obj) {
  return html`
    <input type="text" id="input-text" value=${obj.value} readonly></input>
  `
}

function selectInput (obj) {
  return html`
    <label for=${obj.id} class="select-input">
      ${obj.label}
      <select name=${obj.id} id=${obj.id} onchange=${obj.onChange}>
        <option value="none" ${obj.activeDevice === false ? 'seleteced' : ''}>None</option>
        ${obj.values.map(function(value, index) {
          return html`
            <option
              value=${value.deviceId ? value.deviceId : value.id}
              ${obj.activeDevice === true && index === 0 ? 'selected' : ''}
              ${obj.activeDevice === value.deviceId || obj.activeDevice === value.id ? 'selected' : ''}
            >${value.label ? value.label : value.name}</option>
          `
        })}
      </select>
    </label>
  `
}
