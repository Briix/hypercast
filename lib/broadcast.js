var fs = require('fs')
var path = require('path')
var recorder = require('media-recorder-stream')
var hyperdrive = require('hyperdrive')
var replicate = require('@hyperswarm/replicator')
var pump = require('pump')
var cluster = require('webm-cluster-stream')
var { appDataPath, addScripts } = require('./util')

exports.start = start
exports.stop = stop

function start (startCallback, peerCallback, audioOnly, screenShare, viewerTemplate) {

  var swarm, block = 0
  var mimeType = audioOnly
    ? 'audio/webm;codecs=opus'
    : screenShare
      ? 'video/webm;codecs=vp8'
      : 'video/webm;codecs=vp9,opus'
  var mediaRecorder = recorder(window.stream, {
    mimeType,
    videoBitsPerSecond: 600000,
    audioBitsPerSecond: 32000
  })

  window.recorder = mediaRecorder

  if (!fs.existsSync(appDataPath())) {
    fs.mkdirSync(appDataPath())
  }

  var feed = hyperdrive(path.join(appDataPath(), `/streams/broadcasted/${Date.now()}`))

  feed.on('ready', function () {
    swarm = replicate(feed, {live: true})
    startCallback(feed.key.toString('hex'))

    var viewerTemplatePath = viewerTemplate
      ? viewerTemplate.path
      : `${__dirname}/viewer.html`

    fs.readFile(viewerTemplatePath, function (err, data) {
      if (err) console.log('error reading viewer.html', err)

      var viewerJs = fs.readFileSync(`${__dirname}/viewer.js`)
      var scripts = [`var mime = "${mimeType}";`, viewerJs.toString()]

      feed.writeFile('index.html', addScripts(data.toString(), scripts), function (err) {
        if (err) console.log('error copying viewer.html', err)
      })
    })

    var stream = pump(mediaRecorder, cluster(), function (err) {
      if (err) console.log('error closing stream pump: ', err)

      feed.close(function (err) {
        if (err) console.log('error closing feed: ', err)
      })
    })

    stream.on('data', function (data) {
      console.log(`writing block ${block}`)
      feed.writeFile(block + '.buffer', data, function (err) {
        if (err) console.log('block write error', err)
      })

      console.log(`Streaming to ${swarm.connections.size} peers`)

      peerCallback(swarm.connections.size)

      block++
    })
  })
}

function stop (cb) {
  window.recorder.stop()
  cb()
}
