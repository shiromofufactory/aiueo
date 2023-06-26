<template lang="pug">
.container
  .row
    .col-sm-4
      h1
        img(src="title.png" alt="テキスト読み上げ機能付きあいうえお表")
    .col-sm-2
      .note.mb-1 タブレット・横向き画面でのご使用を推奨します
  transition
    .about(v-show="about" @click="about=false")
      .message
        h2 このページについて
        p 作者の2歳の子どもがひらがな・カタカナに興味を持ち始めたので、ふと思い立って作ってみました。
        p アナログのあいうえお表だと濁音・半濁音や拗音が書かれていないものも多いですが、このあいうえお表はこれらの文字も含めてひらがな・カタカナを全てカバーしています。
        p 音声はブラウザ標準の読み上げ機能（Speech Synthesis API）を使っています。喋らせる言葉によっては発音が少しおかしいので、ママやパパが近くで見守りながら正しい発音を教えてあげてください。
        p また、PWA(Progressive Web Apps)に対応していますので、スマホやタブレットから「ホーム画面に追加」をすることでアプリのように動作させることができます。
        button.close(@click="about=false") &times
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
      one-letter(v-for="value,idx in values1.split('')" :key="idx" :value="getKana(value)" @send="speechOne")
    .col-sm-3.flex
      one-letter(v-for="value,idx in values2.split('')" :key="idx" :value="getKana(value)" @send="speechOne")
      .one-letter.switch.action(@click="toggleKatakana") {{katakana ? "あいう" : "アイウ"}}
  .row(style="margin-top:48px")
    .col-sm-3.flex
      one-letter(v-for="value,idx in values3.split('')" :key="idx" :value="getKana(value)" @send="speechOne")
    .col-sm-3.flex
      one-letter(v-for="value,idx in values4.split('')" :key="idx" :value="getKana(value)" @send="speechOne")
  footer
    a(href="https://docs.google.com/forms/d/e/1FAIpQLScIBdi7vLDZ2gttYNBonjfpXWjgQbSsN78E6_8sK2YqyKMY_A/viewform?usp=sf_link"  target="_blank" rel="noopener")
      | [要望・お問い合わせ]
    a(href="#" @click.prevent="about=!about") [about]
    .note Copyright ©2023 しろもふファクトリー
</template>

<script>
export default {
  components: {
    OneLetter: () => import("@/components/OneLetter.vue")
  },
  data: () => ({
    utter: {},
    text: "",
    clearNext: false,
    values1:
      "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもや ゆ よらりるれろわをんー ",
    values2:
      "     がぎぐげござじずぜぞだぢづでど     ばびぶべぼぱぴぷぺぽゃ ゅ ょぁぃぅぇぉっ   ",
    values3: "01234",
    values4: "56789",
    katakana: false,
    about: false
  }),
  created() {
    this.utter = new SpeechSynthesisUtterance()
    this.voices = window.speechSynthesis.getVoices()
    this.utter.lang = "ja-JP"
    this.utter.rate = 1.0
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
      console.log(this.utter)
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
