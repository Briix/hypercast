var html = require('choo/html')
var onload = require('on-load')

var broadcast = require('../lib/broadcast')

var button = require('./button')
var { textInput } = require('./input')
var label = require('./label')
var canvas = require('./canvas')
var setupWaveform = require('../lib/waveform')
var { desktopCapturer } = require('electron')
var settings = require('./settings')
var settingsIcon = html`
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 17.5C15.933 17.5 17.5 15.933 17.5 14C17.5 12.067 15.933 10.5 14 10.5C12.067 10.5 10.5 12.067 10.5 14C10.5 15.933 12.067 17.5 14 17.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22.6334 17.5C22.4781 17.8519 22.4318 18.2422 22.5004 18.6207C22.569 18.9991 22.7495 19.3484 23.0184 19.6233L23.0884 19.6933C23.3054 19.91 23.4775 20.1674 23.5949 20.4506C23.7123 20.7339 23.7727 21.0375 23.7727 21.3442C23.7727 21.6508 23.7123 21.9544 23.5949 22.2377C23.4775 22.521 23.3054 22.7783 23.0884 22.995C22.8717 23.2119 22.6144 23.384 22.3311 23.5015C22.0478 23.6189 21.7442 23.6793 21.4376 23.6793C21.1309 23.6793 20.8273 23.6189 20.5441 23.5015C20.2608 23.384 20.0035 23.2119 19.7867 22.995L19.7167 22.925C19.4418 22.656 19.0926 22.4756 18.7141 22.407C18.3356 22.3384 17.9453 22.3847 17.5934 22.54C17.2483 22.6879 16.9541 22.9334 16.7468 23.2465C16.5395 23.5595 16.4282 23.9262 16.4267 24.3017V24.5C16.4267 25.1188 16.1809 25.7123 15.7433 26.1499C15.3057 26.5875 14.7123 26.8333 14.0934 26.8333C13.4746 26.8333 12.8811 26.5875 12.4435 26.1499C12.0059 25.7123 11.7601 25.1188 11.7601 24.5V24.395C11.751 24.0088 11.6261 23.6343 11.4013 23.3201C11.1766 23.006 10.8626 22.7667 10.5001 22.6333C10.1482 22.478 9.75786 22.4317 9.37939 22.5003C9.00093 22.5689 8.65171 22.7494 8.37675 23.0183L8.30675 23.0883C8.09004 23.3053 7.8327 23.4774 7.54944 23.5948C7.26618 23.7122 6.96255 23.7727 6.65591 23.7727C6.34928 23.7727 6.04565 23.7122 5.76239 23.5948C5.47912 23.4774 5.22179 23.3053 5.00508 23.0883C4.78814 22.8716 4.61603 22.6143 4.49861 22.331C4.38119 22.0478 4.32075 21.7441 4.32075 21.4375C4.32075 21.1309 4.38119 20.8272 4.49861 20.544C4.61603 20.2607 4.78814 20.0034 5.00508 19.7867L5.07508 19.7167C5.34404 19.4417 5.52446 19.0925 5.59309 18.714C5.66171 18.3356 5.61538 17.9452 5.46008 17.5933C5.31219 17.2483 5.06663 16.954 4.75362 16.7467C4.44062 16.5394 4.07383 16.4282 3.69841 16.4267H3.50008C2.88124 16.4267 2.28775 16.1808 1.85017 15.7432C1.41258 15.3057 1.16675 14.7122 1.16675 14.0933C1.16675 13.4745 1.41258 12.881 1.85017 12.4434C2.28775 12.0058 2.88124 11.76 3.50008 11.76H3.60508C3.99124 11.751 4.36575 11.626 4.67993 11.4013C4.99411 11.1766 5.23342 10.8625 5.36675 10.5C5.52205 10.1481 5.56838 9.75777 5.49975 9.37931C5.43113 9.00085 5.25071 8.65162 4.98175 8.37666L4.91175 8.30666C4.6948 8.08996 4.5227 7.83262 4.40528 7.54936C4.28785 7.2661 4.22741 6.96247 4.22741 6.65583C4.22741 6.34919 4.28785 6.04557 4.40528 5.7623C4.5227 5.47904 4.6948 5.2217 4.91175 5.005C5.12845 4.78805 5.38579 4.61595 5.66905 4.49852C5.95232 4.3811 6.25595 4.32066 6.56258 4.32066C6.86922 4.32066 7.17285 4.3811 7.45611 4.49852C7.73937 4.61595 7.99671 4.78805 8.21341 5.005L8.28341 5.075C8.55837 5.34396 8.9076 5.52438 9.28606 5.593C9.66452 5.66162 10.0549 5.6153 10.4067 5.46H10.5001C10.8451 5.31211 11.1394 5.06655 11.3467 4.75354C11.554 4.44053 11.6653 4.07375 11.6667 3.69833V3.5C11.6667 2.88116 11.9126 2.28767 12.3502 1.85008C12.7878 1.4125 13.3812 1.16666 14.0001 1.16666C14.6189 1.16666 15.2124 1.4125 15.65 1.85008C16.0876 2.28767 16.3334 2.88116 16.3334 3.5V3.605C16.3349 3.98041 16.4462 4.3472 16.6534 4.66021C16.8607 4.97321 17.155 5.21877 17.5001 5.36666C17.852 5.52196
             18.2423 5.56829 18.6208 5.49967C18.9992 5.43105 19.3485 5.25062 19.6234 4.98166L19.6934 4.91166C19.9101 4.69472 20.1675 4.52261 20.4507 4.40519C20.734 4.28777 21.0376 4.22733 21.3442 4.22733C21.6509 4.22733 21.9545 4.28777 22.2378 4.40519C22.521 4.52261 22.7784 4.69472 22.9951 4.91166C23.212 5.12837 23.3841 5.38571 23.5016 5.66897C23.619 5.95223 23.6794 6.25586 23.6794 6.5625C23.6794 6.86913 23.619 7.17276 23.5016 7.45602C23.3841 7.73929 23.212 7.99663 22.9951 8.21333L22.9251 8.28333C22.6561 8.55829 22.4757 8.90752 22.4071 9.28598C22.3385 9.66444 22.3848 10.0548 22.5401 10.4067V10.5C22.688 10.8451 22.9335 11.1394 23.2465 11.3466C23.5595 11.5539 23.9263 11.6652 24.3017 11.6667H24.5001C25.1189 11.6667 25.7124 11.9125 26.15 12.3501C26.5876 12.7877 26.8334 13.3812 26.8334 14C26.8334 14.6188 26.5876 15.2123 26.15 15.6499C25.7124 16.0875 25.1189 16.3333 24.5001 16.3333H24.3951C24.0197 16.3348 23.6529 16.4461 23.3399 16.6534C23.0269 16.8606 22.7813 17.1549 22.6334 17.5V17.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`

module.exports = home

function home (state, emit) {
  var waveformEl = canvas()
  var el = html`
    <div id="container">
      ${state.settings.visible ? settings(state, emit) : ''}
      <video id="preview" autoplay></video>
      ${state.settings.videoDevice ? '' : waveformEl}
      <div id="interface">
        <div id="nav">
          ${label({
            color: !state.broadcast.active ? 'grey' : 'red',
            text: !state.broadcast.active ? 'Standby' : `On Air: ${state.broadcast.peerCount} viewer(s)`
          })}
          <div id="actions">
            ${button({
              classes: !state.broadcast.active ? 'bg-green' : 'bg-grey',
              onclick: !state.broadcast.active ? startBroadcast : stopBroadcast,
              text: `${!state.broadcast.active ? 'Start' : 'Stop'} Broadcast`
            })}
            ${button({
              classes: 'bg-grey',
              onclick: settingsToggle,
              text: settingsIcon
            })}
          </div>
        </div>

        <div id="nav">
          <div></div>
          <div id="share">
            ${state.broadcast.key
              ? textInput({value: `hyper://${state.broadcast.key}`})
              : null
            }
          </div>
        </div>
      </div>
    </div>
  `
  onload(el, setStream)
  onload(waveformEl, onCanvas, setStream)
  return el

  function setStream () {
    emit('setStream')
  }


  function onCanvas (canvas) {
    var result = setupWaveform(canvas)
    var audioCtx = result.audioCtx;
    var analyser = result.analyser;
    window.audioCtx = audioCtx
    window.analyser = analyser
    setStream(audioCtx, analyser)
  }

  function startBroadcast () {
    broadcast.start(function (key) {
      emit('broadcast:start', key)
    }, function(peerCount) {
      emit('broadcast:peer', peerCount)
    },
    !state.settings.videoDevice,
    typeof state.settings.videoDevice === 'string' && state.settings.videoDevice.includes('screen'),
    state.settings.viewerTemplate
    )
  }

  function stopBroadcast () {
    broadcast.stop(function () {
      emit('broadcast:stop')
    })
  }

  function settingsToggle() {
    emit('settingsToggle')
  }
}
