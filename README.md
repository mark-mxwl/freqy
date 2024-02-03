# FREQY

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Freqy is a multimode audio filter built with the Web Audio API. The buffer accepts an audio file of up to 10 MB in the following formats: wav, aiff, and mp3. The uploaded audio can be triggered as a one-shot or loop, and can be replaced at any time. There are four filter modes available: lowpass, highpass, bandpass, and notch. Modes can be freely switched during playback. Each filter is set with a Q factor of 0.7, a low range of 100 Hz, and a high range of 10 KHz. Cutoff can be controlled via the main knob or the frequency display.

> [!NOTE]
> All of Freqy's features are fully accessible with keyboard navigation.

## Project Setup

Clone the repository.

```
git clone https://github.com/mark-mxwl/freqy
```

Install node dependencies.

```
npm install
```

## Local Development

Run the development server.

```
npm run dev
```

## Contributing

Contributing guidlines here...
