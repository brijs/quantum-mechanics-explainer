# Quantum Mechanics: The Theoretical Minimum — animated explainer

An animated, narrated, interactive single-file HTML explainer of Susskind & Friedman's *Quantum Mechanics: The Theoretical Minimum*, guided by Professor Schrö (a cat). 51 scenes: foundations, ten lectures, check-yourself quizzes, and a glossary.

Open `index.html` in a browser (no server needed). Narration is Kokoro TTS (voice `af_heart`) embedded as base64 MP3.

## Rebuild
- `python3 tts.py` renders narration clips from `narration.json` into `audio/` (needs `kokoro-onnx`, model files, `ffmpeg`)
- `python3 build.py` assembles `parts/*` + audio into the HTML
- `python3 test.py` walks every scene with Playwright

By Brijesh Shetty · github.com/brijs
