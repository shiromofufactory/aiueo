<template lang="pug">
.one-letter(@click="click" :class="getClass")
  span(v-if="value=='@'") {{katakana ? "あいう" : "アイウ"}}
  span(v-else) {{value}}
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: false,
      default: ""
    },
    katakana: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    getClass() {
      return {
        action: !!this.value.trim(),
        switch: this.value == "@"
      }
    }
  },
  methods: {
    click() {
      const valueStr = String(this.value)
      console.log(this.value)
      if (!valueStr.trim()) return
      this.$emit("send", valueStr)
    }
  }
}
</script>
