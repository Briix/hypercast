var el_player = document.createElement(/audio/.test(mime) ? 'audio' : 'video')
el_player.autoplay = true;
el_player.controls = true;
document.querySelector('#video').appendChild(el_player);
var archive = beaker.hyperdrive.drive(window.location.href)
var mediaSource = new MediaSource()

el_player.src = window.URL.createObjectURL(mediaSource)

var sourceBuffer
mediaSource.addEventListener('sourceopen', function () {
  sourceBuffer = mediaSource.addSourceBuffer(mime)
  sourceBuffer.mode = 'sequence'

  read()
})

async function read () {
  var files = await archive.readdir('/')
  var block = 0
  loop()

  async function loop () {
    var buffer

    try {
      buffer = await archive.readFile(`/${block}.buffer`, 'binary')
    } catch (err) {
      console.log(`error downloading block ${block}`, err)
    }

    if (buffer) {
      console.log(`appending block ${block}`)
      sourceBuffer.appendBuffer(buffer)
    }

    setTimeout(function () {
      if (block === 0 && files.length > 6) {
        block = files.length - 5
      } else {
        if (buffer) block++
      }

      loop()
    }, 2000)
  }
}

