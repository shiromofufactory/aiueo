# Firebase Functions for Google Cloud Text-to-Speech

This function keeps Google Cloud credentials on the server side and returns MP3 audio for the web app.

## Setup

1. Enable billing for the Google Cloud / Firebase project.
2. Enable the Cloud Text-to-Speech API.
3. Install Firebase CLI and sign in.
4. Install function dependencies:

```sh
npm --prefix functions install
```

5. Deploy the function:

```sh
firebase deploy --only functions:synthesizeSpeech
```

6. Build the Nuxt app with the deployed endpoint:

```sh
GOOGLE_TTS_ENDPOINT="https://asia-northeast1-<project-id>.cloudfunctions.net/synthesizeSpeech" npm run build
```

For local emulator testing, use:

```sh
GOOGLE_TTS_ENDPOINT="http://127.0.0.1:5001/<project-id>/asia-northeast1/synthesizeSpeech" npm run dev
```

## Environment Variables

- `ALLOWED_ORIGINS`: comma-separated origins allowed to call the function.
- `GOOGLE_TTS_NEURAL2_FEMALE`: defaults to `ja-JP-Neural2-B`.
- `GOOGLE_TTS_NEURAL2_MALE_C`: defaults to `ja-JP-Neural2-C`.
- `GOOGLE_TTS_NEURAL2_MALE_D`: defaults to `ja-JP-Neural2-D`.
- `GOOGLE_TTS_POLYGLOT_VOICE`: optional. No `ja-JP` Polyglot voice is listed in the public supported voices table as of June 2026.
