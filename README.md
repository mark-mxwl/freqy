# FREQY

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Freqy is a multimode filter built with the Web Audio API.

🔥 Accepts an audio file of up to 10 MB in the following formats: wav, aiff, and mp3.

⚡️ Audio can be triggered as a one-shot or loop, and can be replaced at any time.

🦾 Four filter modes: Classic (LP), DJ Booth (HP), Trip-Hop (BP), and Nu-Skool (Notch).

👾 Cutoff can be controlled with the main knob, frequency display, or via MIDI.

> [!NOTE]
> All of Freqy's features are fully accessible with keyboard navigation.

> [!TIP]
> Connect a MIDI device to control Freqy via knobs, sliders, note velocity, etc.

## Try It 🙌

🌐 Freqy is [LIVE](https://freqy.netlify.app/) and ready for tweakage! 🌐

### Browser Compatibility

🔈 Freqy's audio features are compatible with all major browers: Chrome, Safari, Firefox, etc.

🎛 Firefox will request access to your MIDI devices. If your device fails to connect, try refreshing the page.

> [!WARNING]
> Safari does not support Web MIDI; features are disabled.

## Project Setup

Clone the repository to your local machine.

```
git clone https://github.com/mark-mxwl/freqy.git
```

Navigate to the root directory and install dependencies.

```
npm install
```

## Development

Run the Vite development server.

```
npm run dev
```

Enter `localhost:5173` (default port) into your browser, or press `o + ENTER`.

Ports, plugins, and other such things can be configured in `vite.config.js`.

## Contributing

If you'd like to lend some dev wizardry to Freqy, you can help out by opening an issue to report any bugs/odd behavior. If there's an open issue you'd like to tackle, @ me in the comments before you jump in. Thanks for getting involved! 🚀

> [!IMPORTANT]
> While I'm not currently accepting feature contributions, if you have an idea for one, fork or clone the repo and do your thing!
