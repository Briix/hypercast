var html = require('choo/html')
var onload = require('on-load')
var button = require('./button')
var { selectInput } = require('./input')
var { desktopCapturer } = require('electron')
var closeIcon = html`
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 7L7 21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 7L21 21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`

module.exports = settings

function settings (state, emit) {
  var el = html`
    <div id="settings">
      <div id="settings-nav">
        <h1>Settings</h1>

        ${button({
          color: 'transparent',
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
    </div>
  `

  onload(el, enumrateMediaDevices)

  return el

  function onAudioToggle() {
    emit('audioOnlyToggle')
  }

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

  function setAudioDevice(event) {
    emit('setAudioDevice', event.target.value === 'none' ? false : event.target.value)
  }

  function setVideoDevice(event) {
    emit('setVideoDevice', event.target.value === 'none' ? false : event.target.value)
  }
}
