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
  .row.header.mb-1
    .col-6
      .header-inner.flex
        .savebox
          .content(:class="getClass") {{text}}
          button(aria-label="delete")
            img(src="delete.png" @click="backDelete" alt="削除")
        template(v-if="!isMobile")
          button.action.speech(aria-label="trash" @click="allDelete")
            img(src="trash.png" alt="全て削除")
        button.action.speech(aria-label="speech" @click="speechAll")
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
      button.action(@click="toggleVertical")
        | {{ isVertical ? '横書き' : '縦書き' }}
      MySwitch(:value="slow" @input="toggleSlow")
      .spacer
      a(href="https://docs.google.com/forms/d/e/1FAIpQLScIBdi7vLDZ2gttYNBonjfpXWjgQbSsN78E6_8sK2YqyKMY_A/viewform?usp=sf_link"  target="_blank" rel="noopener")
        | [お問い合わせ]
      a(href="#" @click.prevent="about=!about") [about]
    .note Copyright ©2024 しろもふファクトリー
</template>

<script>
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
    about: false
  }),
  created() {
    this.utter = new SpeechSynthesisUtterance()
    this.voices = window.speechSynthesis.getVoices()
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
    this.setUtterRate()
    this.setIsMobile()
    window.addEventListener("resize", this.setIsMobile)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setIsMobile)
  },
  computed: {
    values1() {
      if (this.isVertical) {
        if (this.isMobile) {
          return "なたさかあにちしきいぬつすくうねてせけえのとそこおわらやまはをり みひんるゆふむーれ めへ ろよもほ"
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
          return "      だざが  ぢじぎ  づずぐ  でぜげ  どぞごっぁゃぱば ぃ ぴび ぅゅぷぶ ぇ ぺべ、ぉょぽぼ@"
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
    }
  },
  methods: {
    saveConfig() {
      localStorage.setItem(
        "aiueo-config",
        JSON.stringify({
          isVertical: this.isVertical,
          katakana: this.katakana,
          slow: this.slow
        })
      )
    },
    setIsMobile() {
      this.isMobile = window.innerWidth < 576
    },
    toggleVertical() {
      this.isVertical = !this.isVertical
      this.saveConfig()
    },
    toggleSlow(e) {
      this.slow = !this.slow
      this.setUtterRate()
      this.saveConfig()
    },
    setUtterRate() {
      this.utter.rate = this.slow ? 0.5 : 1.0
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
      this.utter.text = text
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(this.utter)
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
