<template lang="pug">
.one-letter(@click="click" :class="getClass")
  | {{value}}
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: false,
      default: ""
    }
  },
  computed: {
    getClass() {
      return {
        action: !!this.value.trim()
      }
    }
  },
  methods: {
    click() {
      const valueStr = String(this.value)
      if (!valueStr.trim()) return
      this.$emit("send", valueStr)
    }
  }
}
</script>
