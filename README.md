# hypercast
`hypercast` is a tool for broadcasting live peer-to-peer video streams to `hyper://` enabled web browsers such as [Beaker Browser](https://beakerbrowser.com).

When users connect to your stream, they begin re-distributing your broadcast data amongst each other. This bypasses the need for a central broadcasting server, and the large amounts of bandwidth required to stream the same data to every user.

`hypercast` is a fork of [mafintosh's hypervision](https://github.com/mafintosh/hypervision) app. It utilizes modules like [`hyperdrive`](https://github.com/mafintosh/hyperdrive) and [`hyperdiscovery`](https://github.com/karissa/hyperdiscovery) from the `hyper://` ecosystem.

You can read an old introductory post to `hypervision` at the following URL: [https://louis.center/p2p-hypervision](https://louis.center/p2p-hypervision). It's also available in [Japanese/日本語 🇯🇵](https://louis.center/p2p-hypervision-jp) and [Korean/한국어 🇰🇷](https://louis.center/p2p-hypervision-kr).

![hypercast screenshot](https://louis.center/images/hypercast.png)

## Todo
- [x] Video/audio input selection (currently chooses system defaults)
- [ ] Audio-only broadcasting
- [ ] RTMP ingestion (to allow streaming from OBS)
- [x] Easier viewing page customization
- [ ] Better archiving (for re-watching a broadcast afterwards)
- [ ] Chat tools

## Privacy
[Hypercore Protocol](https://hypercore-protocol.org) (which powers `hypercast`) does __*not*__ have a built-in anonymity layer. Much like `BitTorrent`, unless you connect to a peer-to-peer network via a VPN or Tor proxy, other users in the network will be able to see your IP address.

## Installation
```
git clone git://github.com/Briix/hypercast.git
cd hypercast

npm install
npm start
```

## Broadcasting
After installating and starting the application, press the green `[Start Broadcast]` button in the top right hand corner of the window.

When the broadcast begins, a copyable `hyper://` URL should appear in the bottom right hand corner of the window. You can share this link with anyone who wants to tune into your broadcast. They will need to open this URL inside of a peer-to-peer `hyper://` enabled web browser, such as [Beaker Browser](https://beakerbrowser.com).

## Custom templates
`hypercast` allows you to specify a custom template in the settings to be used when broadcasting.

The custom template must be a single HTML file containing all the necessary
assets (CSS/JS), and must contain an element with the id of `video`. This
element is where your stream will be injected.

For an example of what a custom template can look like, check out
[hypercast-custom-template](https://github.com/Briix/hypercast-custom-template)
or the [default hypercast template](https://github.com/Briix/hypercast/blob/master/lib/viewer.html)

## License
MIT
