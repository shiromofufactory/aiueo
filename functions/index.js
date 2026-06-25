"use strict"

const { onRequest } = require("firebase-functions/v2/https")
const logger = require("firebase-functions/logger")
const textToSpeech = require("@google-cloud/text-to-speech")

const client = new textToSpeech.TextToSpeechClient()

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://aiueo.netlify.app"
]

const VOICES = {
  neural2Female: {
    languageCode: "ja-JP",
    name: process.env.GOOGLE_TTS_NEURAL2_FEMALE || "ja-JP-Neural2-B",
    ssmlGender: "FEMALE"
  },
  neural2MaleC: {
    languageCode: "ja-JP",
    name: process.env.GOOGLE_TTS_NEURAL2_MALE_C || "ja-JP-Neural2-C",
    ssmlGender: "MALE"
  },
  neural2MaleD: {
    languageCode: "ja-JP",
    name: process.env.GOOGLE_TTS_NEURAL2_MALE_D || "ja-JP-Neural2-D",
    ssmlGender: "MALE"
  },
  polyglot: {
    languageCode: "ja-JP",
    name: process.env.GOOGLE_TTS_POLYGLOT_VOICE || "",
    ssmlGender: "FEMALE"
  }
}

function allowedOrigins() {
  const configured = process.env.ALLOWED_ORIGINS
  if (!configured) return DEFAULT_ALLOWED_ORIGINS
  return configured
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean)
}

function applyCors(req, res) {
  const origin = req.get("origin")
  const allowed = allowedOrigins()

  if (origin && !allowed.includes(origin)) {
    return false
  }

  res.set("Vary", "Origin")
  res.set("Access-Control-Allow-Origin", origin || allowed[0])
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.set("Access-Control-Allow-Headers", "Content-Type")
  res.set("Access-Control-Max-Age", "3600")
  return true
}

function parseSpeakingRate(value) {
  const rate = Number(value)
  if (!Number.isFinite(rate)) return 1
  return Math.min(Math.max(rate, 0.25), 4)
}

exports.synthesizeSpeech = onRequest(
  {
    region: "asia-northeast1",
    timeoutSeconds: 30,
    memory: "256MiB",
    maxInstances: 10
  },
  async (req, res) => {
    if (!applyCors(req, res)) {
      res.status(403).json({ error: "origin_not_allowed" })
      return
    }

    if (req.method === "OPTIONS") {
      res.status(204).send("")
      return
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed" })
      return
    }

    const body = req.body || {}
    const text = typeof body.text === "string" ? body.text : ""
    const voiceKey =
      typeof body.voice === "string" ? body.voice : "neural2Female"
    const voice = VOICES[voiceKey]

    if (!text.trim()) {
      res.status(400).json({ error: "text_required" })
      return
    }

    if (text.length > 300) {
      res.status(400).json({ error: "text_too_long" })
      return
    }

    if (!voice || !voice.name) {
      res.status(400).json({ error: "voice_not_configured" })
      return
    }

    try {
      const [response] = await client.synthesizeSpeech({
        input: { text },
        voice,
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: parseSpeakingRate(body.rate)
        }
      })

      res.set("Cache-Control", "private, max-age=86400")
      res.json({
        audioContent: response.audioContent.toString("base64"),
        mimeType: "audio/mpeg",
        voice: voice.name
      })
    } catch (error) {
      logger.error("Text-to-Speech synthesis failed", {
        message: error.message,
        voice: voice.name
      })
      res.status(500).json({ error: "synthesis_failed" })
    }
  }
)
