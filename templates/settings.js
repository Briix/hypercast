var html = require('choo/html')
var onload = require('on-load')
var button = require('./button')
var { selectInput } = require('./input')
var { desktopCapturer, shell } = require('electron')
var closeIcon = html`
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 7L7 21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 7L21 21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`
var deleteIcon = html`
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 7H5.83333H24.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.33325 7.00004V4.66671C9.33325 4.04787 9.57909 3.45438 10.0167 3.01679C10.4543 2.57921 11.0477 2.33337 11.6666 2.33337H16.3333C16.9521 2.33337 17.5456 2.57921 17.9832 3.01679C18.4208 3.45438 18.6666 4.04787 18.6666 4.66671V7.00004M22.1666 7.00004V23.3334C22.1666 23.9522 21.9208 24.5457 21.4832 24.9833C21.0456 25.4209 20.4521 25.6667 19.8333 25.6667H8.16659C7.54775 25.6667 6.95425 25.4209 6.51667 24.9833C6.07908 24.5457 5.83325 23.9522 5.83325 23.3334V7.00004H22.1666Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

`

module.exports = settings

function settings (state, emit) {
  var el = html`
    <div id="settings">
      <div id="settings-nav">
        <h1>Settings</h1>

        ${button({
          classes: 'bg-transparent',
          onclick: settingsToggle,
          text: closeIcon
        })}

      </div>

      <div id="device-selection">
        ${state.settings.devices
          ? selectInput({
              values: state.settings.devices.audioDevices,
              label: 'Audio device',
              id: 'audio-device',
              onChange: setAudioDevice,
              activeDevice: state.settings.audioDevice
            })
          : ''
        }

        ${state.settings.devices
          ? selectInput({
              values: state.settings.devices.videoDevices,
              label: 'Video device',
              id: 'video-device',
              onChange: setVideoDevice,
              activeDevice: state.settings.videoDevice
            })
          : ''
        }
      </div>

      <label id="file-input" for="viewer-template">
        Choose viewer template
        <div class="viewer-template-inner">
          ${state.settings.viewerTemplate
            ? button({
                classes: 'bg-red mr-1',
                onclick: removeCustomTemplate,
                text: deleteIcon
              })
            : html`
                <div class="file-input-btn btn bg-grey">
                  Choose template
                </div>
              `
          }
          ${state.settings.viewerTemplate ? state.settings.viewerTemplate.name : 'No template selected'}
        </div>
        <input name="viewer-template" id="viewer-template" type="file" onchange="${setViewerTemplate}" />
      </label>
      <span onclick=${function() { shell.openExternal('https://github.com/Briix/hypercast#custom-templates')}} class="viewer-template-link">Learn more about custom templates</span>
    </div>
  `

  onload(el, enumrateMediaDevices)

  return el

  function settingsToggle() {
    emit('settingsToggle')
  }

  function enumrateMediaDevices() {
    var mediaDevices = navigator.mediaDevices.enumerateDevices()
    var screens = desktopCapturer.getSources({ types: ['screen'] })

    Promise.all([mediaDevices, screens])
      .then(function(values) {
        var audioDevices = []
        var videoDevices = []

        values[0].forEach(function(device) {
          if (device.kind === 'audioinput') {
            audioDevices.push(device)
          }

          if (device.kind === 'videoinput') {
            videoDevices.push(device)
          }
        })

        values[1].forEach(function(device) {
          videoDevices.push(device)
        })

        var obj = {
          audioDevices: audioDevices,
          videoDevices: videoDevices
        }

        emit('setMediaDevices', obj)
      })
  }

  function setAudioDevice (event) {
    emit('setAudioDevice', event.target.value === 'none' ? false : event.target.value)
  }

  function setVideoDevice (event) {
    emit('setVideoDevice', event.target.value === 'none' ? false : event.target.value)
  }

  function setViewerTemplate (event) {
    var file = event.target.files[0]
    var viewerTemplate = {
      name: file.name,
      path: file.path
    }

    emit('setViewerTemplate', viewerTemplate)
  }

  function removeCustomTemplate () {
    emit('setViewerTemplate', undefined)
  }
}
