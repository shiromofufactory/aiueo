<template lang="pug">
.container
  .row
    .col-sm-4
      h1
        img(src="title.png" alt="テキスト読み上げ機能付きあいうえお表")
    .col-sm-2
      .note.mb-1 タブレット・横向き画面でのご使用を推奨します
  .row.header.mb-1
    .col-6.flex
      .savebox
        .content(:class="getClass") {{text}}
        button(aria-label="delete")
          img(src="delete.png" @click="backDelete" alt="削除")
      button.action.speech(aria-label="speech" @click="speechAll")
        img(src="speech.png" alt="読み上げ")
  .row
    .col-sm-3.flex
      one-letter(v-for="value in values1.split('')" :value="getKana(value)" @send="speechOne")
    .col-sm-3.flex
      one-letter(v-for="value in values2.split('')" :value="getKana(value)" @send="speechOne")
      .one-letter.switch.action(@click="toggleKatakana") {{katakana ? "あいう" : "アイウ"}}
  footer
    a(href="https://docs.google.com/forms/d/e/1FAIpQLScIBdi7vLDZ2gttYNBonjfpXWjgQbSsN78E6_8sK2YqyKMY_A/viewform?usp=sf_link"  target="_blank" rel="noopener")
      | [要望・お問い合わせ]
    .note Copyright ©2020 しろもふファクトリー
</template>

<script>
export default {
  components: {
    OneLetter: () => import("@/components/OneLetter.vue")
  },
  data: () => ({
    utter: {},
    voices: [],
    text: "",
    clearNext: false,
    values1:
      "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもや ゆ よらりるれろわをんー ",
    values2:
      "     がぎぐげござじずぜぞだぢづでど     ばびぶべぼぱぴぷぺぽゃ ゅ ょぁぃぅぇぉっ   ",
    katakana: false
  }),
  created() {
    this.utter = new SpeechSynthesisUtterance()
    this.voices = window.speechSynthesis.getVoices()
    this.utter.voice = this.voices[57]
    this.utter.rate = 1.0 //#e0ea9b
    /*
    window.speechSynthesis.onvoiceschanged = () => {
      if (!this.voices.length) {
        this.voices = window.speechSynthesis.getVoices()
        this.utter.voice = this.voices[0]
      }
    }
    */
  },
  computed: {
    getClass() {
      return {
        "clear-next": this.clearNext
      }
    }
  },
  methods: {
    getKana(str) {
      if (!this.katakana) return str
      return str.replace(/[\u3041-\u3096]/g, match => {
        return String.fromCharCode(match.charCodeAt(0) + 0x60)
      })
    },
    toggleKatakana() {
      this.katakana = !this.katakana
    },
    speech(text) {
      if (!text) return
      this.utter.text = text
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(this.utter)
    },
    speechOne(text) {
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
        this.text = ""
        this.clearNext = false
      } else {
        this.text = this.text.slice(0, this.text.length - 1)
      }
    }
  }
}
</script>
