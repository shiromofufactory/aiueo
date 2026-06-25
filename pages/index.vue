<template lang="pug">
.container
  .row
    .col-sm-4
      h1
        img(src="title.png" alt="テキスト読み上げ機能付きあいうえお表")
    .col-sm-2
      .note.mb-1 タブレットでのご使用を推奨します
  transition
    .about(v-show="about" @click="about=false")
      .message
        h2 このページについて
        p シンプルな見栄えの、音が出るデジタルあいうえお表です。
        p アナログのあいうえお表だと濁音・半濁音や拗音が書かれていないものも多いですが、このあいうえお表はこれらの文字も含めてひらがな・カタカナを全てカバーしています。
        p 音声はブラウザ標準の読み上げ機能（Speech Synthesis API）を使っています。喋らせる言葉によっては発音が少しおかしいので、ママやパパが近くで見守りながら正しい発音を教えてあげてください。
        p また、PWA(Progressive Web Apps)に対応していますので、スマホやタブレットから「ホーム画面に追加」をすることでアプリのように動作させることができます。
        button.close(@click="about=false") &times
  transition
    .about(v-show="settingsOpen" @click="settingsOpen=false")
      .message.settings-panel(@click.stop)
        h2 設定
        .setting-block
          MySwitch(:value="slow" :show-status="true" @input="toggleSlow")
        .setting-block
          label.setting-label(for="font-mode") フォント
          select#font-mode.setting-select(:value="fontMode" @change="changeFontMode($event.target.value)")
            option(value="rounded") 丸ゴシック
            option(value="mincho") 明朝体
        .setting-block
          label.setting-label(for="speech-voice") 音声
          select#speech-voice.setting-select(:value="selectedVoiceKey" @change="changeVoice($event.target.value)")
            option(value="") 自動選択
            option(v-for="voice in cloudTtsVoices" :key="voice.key" :value="voice.key") {{voice.label}}
            option(v-for="voice in japaneseVoices" :key="voiceKey(voice)" :value="voiceKey(voice)") {{voiceLabel(voice)}}
        button.close(@click="settingsOpen=false") &times
  .row.header.mb-1
    .col-6
      .header-inner.flex
        .savebox
          .content(:class="getClass") {{text}}
          button(aria-label="削除")
            img(src="delete.png" @click="backDelete" alt="削除")
        template(v-if="!isMobile")
          button.action.speech(aria-label="全て削除" @click="allDelete")
            img(src="trash.png" alt="全て削除")
        button.action.speech(aria-label="読み上げ" @click="speechAll")
          img(src="speech.png" alt="読み上げ")
  .row
    .col-sm-3.flex
      one-letter(v-for="value,idx in values1.split('')" :key="idx" :value="getKana(value)" @send="speechOne")
    .col-sm-3.flex
      one-letter(v-for="value,idx in values2.split('')" :key="idx" :value="getKana(value)" @send="speechOne")
  .row(style="margin-top:46px")
    .col-sm-3.flex
      one-letter(v-for="value,idx in values3.split('')" :key="idx" :value="getKana(value)" @send="speechOne")
    .col-sm-3.flex
      one-letter(v-for="value,idx in values4.split('')" :key="idx" :value="getKana(value)" @send="speechOne")
  footer
    .footer-menu
      .footer-actions
        button.action(@click="toggleVertical")
          | {{ isVertical ? '横書き' : '縦書き' }}
        button.action.settings-button(aria-label="設定" @click="settingsOpen=true")
          img.settings-icon(src="settings.svg" alt="")
          span 設定
      .footer-links
        a(href="https://docs.google.com/forms/d/e/1FAIpQLScIBdi7vLDZ2gttYNBonjfpXWjgQbSsN78E6_8sK2YqyKMY_A/viewform?usp=sf_link"  target="_blank" rel="noopener")
          | [お問い合わせ]
        nuxt-link(to="/support") [支援のお願い]
        a(href="#" @click.prevent="about=!about") [about]
    .note Copyright ©2024 しろもふファクトリー
</template>

<script>
const FONT_MODE_ROUNDED = "rounded"
const FONT_MODE_MINCHO = "mincho"
const CLOUD_TTS_PREFIX = "google-cloud-tts:"
const CLOUD_TTS_VOICES = [
  {
    key: `${CLOUD_TTS_PREFIX}neural2Female`,
    value: "neural2Female",
    label: "Google Cloud Neural2-B（女性）"
  },
  {
    key: `${CLOUD_TTS_PREFIX}neural2MaleC`,
    value: "neural2MaleC",
    label: "Google Cloud Neural2-C（男性）"
  },
  {
    key: `${CLOUD_TTS_PREFIX}neural2MaleD`,
    value: "neural2MaleD",
    label: "Google Cloud Neural2-D（男性）"
  }
]
const FONT_FAMILY_MAP = {
  [FONT_MODE_ROUNDED]:
    '"ヒラギノ丸ゴ Pro W4","ヒラギノ丸ゴ Pro","Hiragino Maru Gothic Pro","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","HG丸ｺﾞｼｯｸM-PRO","HGMaruGothicMPRO"',
  [FONT_MODE_MINCHO]:
    '"Yu Mincho","YuMincho","Hiragino Mincho ProN","Hiragino Mincho Pro","BIZ UDPMincho","MS PMincho",serif'
}

export default {
  components: {
    OneLetter: () => import("@/components/OneLetter.vue"),
    MySwitch: () => import("@/components/MySwitch.vue")
  },
  data: () => ({
    utter: {},
    text: "",
    clearNext: false,
    values3: "01234",
    values4: "56789",
    katakana: false,
    isVertical: false,
    isMobile: false,
    slow: false,
    voices: [],
    selectedVoiceKey: "",
    cloudAudioContext: null,
    cloudAudioSource: null,
    cloudAudioCache: {},
    fontMode: FONT_MODE_ROUNDED,
    about: false,
    settingsOpen: false
  }),
  created() {
    this.utter = new SpeechSynthesisUtterance()
    this.utter.lang = "ja-JP"
  },
  mounted() {
    let config = {}
    try {
      config = JSON.parse(localStorage.getItem("aiueo-config"))
    } catch {}
    this.isVertical = !!config?.isVertical
    this.katakana = !!config?.katakana
    this.slow = !!config?.slow
    this.selectedVoiceKey = config?.voiceKey || ""
    this.fontMode =
      config?.fontMode === FONT_MODE_MINCHO
        ? FONT_MODE_MINCHO
        : FONT_MODE_ROUNDED
    this.applyFontMode()
    this.setUtterRate()
    this.setVoices()
    this.setIsMobile()
    this.listenVoiceEvents()
    window.addEventListener("resize", this.setIsMobile)
  },
  beforeDestroy() {
    this.stopCloudAudio()
    this.removeVoiceEvents()
    window.removeEventListener("resize", this.setIsMobile)
  },
  computed: {
    values1() {
      if (this.isVertical) {
        if (this.isMobile) {
          return "なたさかあにちしきいぬつすくうねてせけえのとそこお     わらやまはをり みひんるゆむふーれ めへ ろよもほ"
        } else {
          return "わらやまはをり みひんるゆむふーれ めへ ろよもほ     っぁゃぱば ぃ ぴび ぅゅぷぶ ぇ ぺべ ぉょぽぼ"
        }
      } else {
        return "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもや ゆ よらりるれろわをんー "
      }
    },
    values2() {
      if (this.isVertical) {
        if (this.isMobile) {
          return "      だざが  ぢじぎ  づずぐ  でぜげ  どぞごっ     ぁゃぱば ぃ ぴび ぅゅぷぶ ぇ ぺべ、ぉょぽぼ@"
        } else {
          return "なたさかあにちしきいぬつすくうねてせけえのとそこお      だざが  ぢじぎ  づずぐ  でぜげ、 どぞご@"
        }
      } else {
        return "     がぎぐげござじずぜぞだぢづでど     ばびぶべぼぱぴぷぺぽゃ ゅ ょぁぃぅぇぉっ  、@"
      }
    },
    getClass() {
      return {
        "clear-next": this.clearNext
      }
    },
    japaneseVoices() {
      return this.voices.filter(this.isJapaneseVoice)
    },
    cloudTtsVoices() {
      return CLOUD_TTS_VOICES
    }
  },
  methods: {
    saveConfig() {
      localStorage.setItem(
        "aiueo-config",
        JSON.stringify({
          isVertical: this.isVertical,
          katakana: this.katakana,
          slow: this.slow,
          voiceKey: this.selectedVoiceKey,
          fontMode: this.fontMode
        })
      )
    },
    applyFontMode() {
      document.documentElement.style.setProperty(
        "--app-font",
        FONT_FAMILY_MAP[this.fontMode] || FONT_FAMILY_MAP[FONT_MODE_ROUNDED]
      )
    },
    setIsMobile() {
      this.isMobile = window.innerWidth < 576
    },
    changeFontMode(fontMode) {
      this.fontMode =
        fontMode === FONT_MODE_MINCHO ? FONT_MODE_MINCHO : FONT_MODE_ROUNDED
      this.applyFontMode()
      this.saveConfig()
    },
    toggleVertical() {
      this.isVertical = !this.isVertical
      this.saveConfig()
    },
    toggleSlow() {
      this.slow = !this.slow
      this.setUtterRate()
      this.saveConfig()
    },
    setUtterRate() {
      this.utter.rate = this.slow ? 0.5 : 1.0
    },
    listenVoiceEvents() {
      const synth = window.speechSynthesis
      if (!synth) return
      if (synth.addEventListener) {
        synth.addEventListener("voiceschanged", this.setVoices)
      } else {
        synth.onvoiceschanged = this.setVoices
      }
    },
    removeVoiceEvents() {
      const synth = window.speechSynthesis
      if (!synth) return
      if (synth.removeEventListener) {
        synth.removeEventListener("voiceschanged", this.setVoices)
      } else if (synth.onvoiceschanged === this.setVoices) {
        synth.onvoiceschanged = null
      }
    },
    setVoices() {
      const synth = window.speechSynthesis
      if (!synth) return
      this.voices = synth.getVoices ? synth.getVoices() : []
      this.applyVoice()
    },
    isJapaneseVoice(voice) {
      return /^ja([-_]|$)/i.test(voice.lang || "")
    },
    voiceKey(voice) {
      return [voice.voiceURI, voice.name, voice.lang].join("|")
    },
    voiceLabel(voice) {
      const serviceType = voice.localService ? "端末内" : "オンライン"
      return `${voice.name}（${serviceType}）`
    },
    changeVoice(voiceKey) {
      this.selectedVoiceKey = voiceKey
      this.applyVoice()
      this.saveConfig()
    },
    applyVoice() {
      if (this.isCloudTtsVoice()) {
        this.utter.voice = null
        this.utter.lang = "ja-JP"
        return
      }

      const voice =
        this.japaneseVoices.find(item => {
          return (
            this.selectedVoiceKey &&
            this.voiceKey(item) === this.selectedVoiceKey
          )
        }) ||
        this.japaneseVoices.find(item => item.default) ||
        this.japaneseVoices.find(item => item.localService) ||
        this.japaneseVoices[0]

      this.utter.voice = voice || null
      this.utter.lang = voice?.lang || "ja-JP"
    },
    getKana(str) {
      if (!this.katakana) return str
      return str.replace(/[\u3041-\u3096]/g, match => {
        return String.fromCharCode(match.charCodeAt(0) + 0x60)
      })
    },
    toggleKatakana() {
      this.katakana = !this.katakana
      this.saveConfig()
    },
    speech(text) {
      if (!text) return
      if (this.isCloudTtsVoice()) {
        this.speechWithCloudTts(text)
      } else {
        this.speechWithBrowser(text)
      }
    },
    speechWithBrowser(text) {
      const synth = window.speechSynthesis
      if (!synth) return
      this.stopCloudAudio()
      this.applyVoice()
      this.utter.text = text
      synth.cancel()
      synth.speak(this.utter)
    },
    async speechWithCloudTts(text) {
      const endpoint = process.env.googleTtsEndpoint
      if (!endpoint) {
        console.warn("GOOGLE_TTS_ENDPOINT is not configured.")
        this.speechWithBrowser(text)
        return
      }

      const voice = this.getSelectedCloudTtsVoice()
      if (!voice) {
        this.speechWithBrowser(text)
        return
      }

      window.speechSynthesis?.cancel()
      await this.prepareCloudAudio()

      const cacheKey = [voice.value, this.slow ? "slow" : "normal", text].join(
        "|"
      )
      let audio = this.cloudAudioCache[cacheKey]
      if (!audio) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text,
              voice: voice.value,
              rate: this.slow ? 0.5 : 1.0
            })
          })

          if (!response.ok) {
            console.warn("Google Cloud TTS request failed.", response.status)
            return
          }

          audio = await response.json()
        } catch (error) {
          console.warn("Google Cloud TTS request failed.", error)
          return
        }
        this.$set(this.cloudAudioCache, cacheKey, audio)
      }

      await this.playCloudAudio(audio.audioContent, audio.mimeType)
    },
    async prepareCloudAudio() {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      if (!this.cloudAudioContext) {
        this.cloudAudioContext = new AudioContext()
      }
      if (this.cloudAudioContext.state === "suspended") {
        await this.cloudAudioContext.resume()
      }
    },
    async playCloudAudio(audioContent, mimeType = "audio/mpeg") {
      if (!audioContent) return
      this.stopCloudAudio()

      if (this.cloudAudioContext) {
        const audioBuffer = await this.cloudAudioContext.decodeAudioData(
          this.base64ToArrayBuffer(audioContent)
        )
        const source = this.cloudAudioContext.createBufferSource()
        source.buffer = audioBuffer
        source.connect(this.cloudAudioContext.destination)
        source.start(0)
        this.cloudAudioSource = source
        return
      }

      const audio = new Audio(`data:${mimeType};base64,${audioContent}`)
      this.cloudAudioSource = audio
      await audio.play()
    },
    stopCloudAudio() {
      if (!this.cloudAudioSource) return
      try {
        this.cloudAudioSource.stop?.()
        this.cloudAudioSource.pause?.()
      } catch {}
      this.cloudAudioSource = null
    },
    base64ToArrayBuffer(base64) {
      const binary = window.atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      return bytes.buffer
    },
    isCloudTtsVoice(voiceKey = this.selectedVoiceKey) {
      return String(voiceKey).startsWith(CLOUD_TTS_PREFIX)
    },
    getSelectedCloudTtsVoice() {
      return CLOUD_TTS_VOICES.find(voice => voice.key === this.selectedVoiceKey)
    },
    speechOne(text) {
      if (text == "@") return this.toggleKatakana()
      this.speech(text)
      this.text = (!this.clearNext ? this.text : "") + text
      this.clearNext = false
    },
    speechAll() {
      this.speech(this.text)
      this.clearNext = true
    },
    backDelete() {
      if (this.clearNext) {
        this.allDelete()
      } else {
        this.text = this.text.slice(0, this.text.length - 1)
      }
    },
    allDelete() {
      this.text = ""
      this.clearNext = false
    }
  }
}
</script>

<style lang="sass">
.settings-panel
  max-width: 28rem

.setting-block
  display: flex
  flex-direction: column
  align-items: stretch
  gap: 0.5rem
  margin-bottom: 1.25rem
  &:last-of-type
    margin-bottom: 0

.setting-label
  color: #343a40
  text-align: left

.setting-select
  min-height: 2.5rem
  padding: 0.5rem 0.75rem
  border: 1px solid #c8c9b7
  border-radius: 0.4rem
  background-color: #fff7e8
  font: inherit
  width: 100%

.settings-button
  width: 4.5rem !important

.settings-icon
  width: 1rem
  height: 1rem

@media (max-width: 575px)
  .setting-block
    margin-bottom: 1rem
</style>
