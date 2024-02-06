# FREQY

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Freqy is a multimode audio filter built with the Web Audio API. The buffer accepts an audio file of up to 10 MB in the following formats: wav, aiff, and mp3. The uploaded audio can be triggered as a one-shot or loop, and can be replaced with new audio at any time. There are four filter modes available: Classic (lowpass), DJ Booth (highpass), Trip-Hop(bandpass), and Nu-Skool (notch). Each filter type is set with a Q factor of 0.7, a low range of 100 Hz, and a high range of 10 KHz. Cutoff can be controlled via the main knob or the frequency display.

> [!NOTE]
> All of Freqy's features are fully accessible with keyboard navigation.

> [!TIP]
> Connect a MIDI device to control Freqy via knobs, sliders, etc.

## Project Setup

Clone the repository to your local machine.

```
git clone https://github.com/mark-mxwl/freqy
```

Navigate to the root directory.

```
cd ~./freqy
```

Install node dependencies.

```
npm install
```

## Local Development

Run the Vite development server.

```
npm run dev
```

Enter `localhost:5173` (default port) into your browser, or press `o + ENTER` from the terminal.

To build, preview, or deploy your project with Vite, or to customize your scripts, reference `package.json`. Ports, plugins, and other such things can be configured in `vite.config.js`.

## Contributing

(Contributing guidelines here...)
