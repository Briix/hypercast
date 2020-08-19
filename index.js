var choo = require('choo')
var app = choo()

app.use(function (state, emitter) {
  state.broadcast = {}
  state.broadcast.active = false
  state.broadcast.key = null
  state.broadcast.audioOnly = false
  state.settings = {}
  state.settings.audioDevice = true
  state.settings.videoDevice = true

  emitter.on('audioOnlyToggle', function() {
    state.broadcast.audioOnly = !state.broadcast.audioOnly
    emitter.emit('render')
  })

  emitter.on('settingsToggle', function() {
    state.settings.visible = !state.settings.visible
    emitter.emit('render')
  })

  emitter.on('setMediaDevices', function(devices) {
    state.settings.devices = devices
    emitter.emit('render')
  })

  emitter.on('setAudioDevice', function(device) {
    state.settings.audioDevice = device
    emitter.emit('setStream')
  })

  emitter.on('setVideoDevice', function(device) {
    state.settings.videoDevice = device
    emitter.emit('setStream')
  })

  emitter.on('broadcast:start', function (key) {
    state.broadcast.peerCount = 0
    state.broadcast.active = true
    state.broadcast.key = key

    emitter.emit('render')
  })

  emitter.on('broadcast:peer', function (peerCount) {
    state.broadcast.peerCount = peerCount
    emitter.emit('render')
  })

  emitter.on('broadcast:stop', function (key) {
    state.broadcast.peerCount = 0
    state.broadcast.active = false
    state.broadcast.key = null

    emitter.emit('render')
  })

  emitter.on('setStream', function(audioCtx, analyser) {
    audioCtx = audioCtx || window.audioCtx
    analyser = analyser || window.analyser

    navigator.mediaDevices.getUserMedia({
      audio: typeof state.settings.videoDevice === 'string' && state.settings.videoDevice.includes('screen')
        ? false
        : state.settings.audioDevice,
      video: typeof state.settings.videoDevice === 'string' && state.settings.videoDevice.includes('screen')
        ? {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: state.settings.videoDevice
            }
          }
      : typeof state.settings.videoDevice === 'boolean'
        ? state.settings.videoDevice
        : {
            deviceId: state.settings.videoDevice
          }
    })
      .then(function(stream) {
        var elPreview = document.getElementById('preview')
        elPreview.srcObject = stream
        elPreview.muted = true

        if (audioCtx) {
           audioCtx.createMediaStreamSource(stream)
            .connect(analyser);
        }

        window.stream = stream
      })

    emitter.emit('render')
  })
})

app.route('/', require('./templates/home'))

document.body.appendChild(app.start())
