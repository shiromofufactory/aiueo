<template lang="pug">
.container.support-page
  .support-header
    h1 支援のお願い
  main.support-main
    section.support-section
      p
        | 「読み上げあいうえお表」は、どなたでも無料で使えるように公開しています。
        | 法人・団体での日本語教育、障害者教育などにもご利用いただいており、継続的な運用と改善のため、任意でのご支援をお願いしています。
      p
        | 支援金は、サーバー・周辺サービスの維持、問い合わせ対応、改善開発のために使わせていただきます。
      p
        | 支援をいただかなくても、すべての機能を無料でご利用いただけます。
        | また、利用条件やサポート内容に差が出ることはありませんので、ご安心くださいませ。
    section.support-section
      h2 ご支援方法
      p
        | 以下の口座にお振込いただいた上で、フォームからのご連絡をお願いいたします。
      dl.account-list
        template(v-for="item in bankAccount")
          dt(:key="`${item.label}-label`") {{ item.label }}
          dd(:key="item.label") {{ item.value }}
      // button.support-copy(type="button" @click="copyAccountInfo")
      //   | {{ copyLabel }}
      a.support-form-link(
        v-if="supportFormUrl"
        :href="supportFormUrl"
        target="_blank"
        rel="noopener"
      ) ご支援連絡フォーム
      button.support-form-link.support-form-link-disabled(
        v-else
        type="button"
        disabled
      ) フォーム準備中
      ul.support-small
        li 振込手数料はご負担ください。金額はご無理のない範囲でお決めください。<br>
        li 領収書の発行をご希望される場合も、このフォームから発行依頼していただけます。
    section.support-section
      h2 注意事項
      p
        | 原則として返金は承っておりません。誤入金などの場合は、
        a(href="https://docs.google.com/forms/d/e/1FAIpQLScIBdi7vLDZ2gttYNBonjfpXWjgQbSsN78E6_8sK2YqyKMY_A/viewform" target="_blank" rel="noopener") お問い合わせフォーム
        | からご連絡ください。
      p
        | また、本ご支援は寄付金控除の対象にはならないので、ご注意ください。
  footer.support-footer
    nuxt-link(to="/") ← あいうえお表に戻る
</template>

<script>
const SUPPORT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScPlMfkp24YKjcJ-ws34v7nuv8EdqPEhBBi-sa8AAnRjmOYRw/viewform?usp=publish-editor"

const BANK_ACCOUNT = [
  { label: "金融機関", value: "GMOあおぞらネット銀行" },
  { label: "支店", value: "法人第二営業部（102）" },
  { label: "預金種別", value: "円普通預金" },
  { label: "口座番号", value: "1861761" },
  { label: "口座名義", value: "ド）シロモフファクトリー" }
]

export default {
  data: () => ({
    supportFormUrl: SUPPORT_FORM_URL,
    bankAccount: BANK_ACCOUNT,
    copyLabel: "口座情報をコピー"
  }),
  computed: {
    accountText() {
      return this.bankAccount
        .map(item => {
          return `${item.label}: ${item.value}`
        })
        .join("\n")
    }
  },
  methods: {
    async copyAccountInfo() {
      const text = this.accountText
      let copied = false

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
          copied = true
        }
      } catch {}

      if (!copied) {
        copied = this.copyAccountInfoWithTextarea(text)
      }

      this.copyLabel = copied ? "コピーしました" : "コピーできませんでした"
      window.setTimeout(() => {
        this.copyLabel = "口座情報をコピー"
      }, 2000)
    },
    copyAccountInfoWithTextarea(text) {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()

      let copied = false
      try {
        copied = document.execCommand("copy")
      } catch {}

      document.body.removeChild(textarea)
      return copied
    }
  }
}
</script>

<style lang="sass">
.support-page
  text-align: left

.support-header
  max-width: 42rem
  margin: 0 auto 1rem
  padding-top: 0.5rem
  h1
    margin: 0.75rem 0 1rem
    font-size: 1.7rem
    line-height: 1.25
    text-align: center

.support-footer a
  color: #3fb4f8
  font-size: 1.0rem
  text-decoration: none
  text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, 0px 1px 0 #fff,  0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff

.support-main
  max-width: 42rem
  margin: 0 auto
  padding: 1rem
  border-radius: 0.4rem
  background: rgba(#fff, 0.92)
  box-shadow: 0 0.125rem 0.25rem rgba(#000, 0.16)

.support-section
  padding: 1.25rem 0
  border-top: 1px solid #e3e0c1
  &:first-child
    padding-top: 0
    border-top: 0
  &:last-child
    padding-bottom: 0
  h2
    margin-bottom: 0.75rem
    text-align: left
  p:last-child
    margin-bottom: 0

.support-note
  display: inline-block
  padding: 0.55rem 0.75rem
  border-radius: 0.4rem
  background-color: #fff7e8
  font-weight: bold

.support-small
  margin-top: 0.75rem
  font-size: 0.8rem

.account-list
  display: grid
  grid-template-columns: 7rem 1fr
  gap: 0.5rem 0.75rem
  margin: 0 0 1rem
  padding: 0
  font-size: 0.95rem
  dt
    color: #495057
    font-weight: bold
  dd
    margin: 0
    word-break: break-word

.support-copy,
.support-form-link
  display: inline-flex
  align-items: center
  justify-content: center
  min-height: 2.4rem
  padding: 0.45rem 0.8rem
  border-radius: 0.4rem
  border: outset
  background-color: #e0ea9b
  color: #212529
  font: inherit
  font-size: 0.9rem
  line-height: 1.2
  text-decoration: none
  cursor: pointer
  &:active,
  &:hover
    border: inset
    background-color: #e0ea9b

.support-form-link-disabled
  opacity: 0.65
  cursor: default
  &:active,
  &:hover
    border: outset

.support-footer
  max-width: 42rem
  margin: 1rem auto 0
  text-align: center

@media (max-width: 575px)
  .support-main
    padding: 0.85rem

  .support-header
    h1
      font-size: 1.45rem

  .account-list
    grid-template-columns: 1fr
    gap: 0.2rem
    dt
      margin-top: 0.45rem
      &:first-child
        margin-top: 0
</style>
