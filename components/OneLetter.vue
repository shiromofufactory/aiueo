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
      if (!this.value.trim()) return
      this.$emit("send", this.value)
    }
  }
}
</script>
