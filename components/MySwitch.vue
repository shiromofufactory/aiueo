<template lang="pug">
div
  label.switch
    input(:checked="value" type="checkbox" @input="$emit('input',$event)")
    span.slider
  span.note ゆっくり発語
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: false
    }
  }
}
</script>

<style scoped>
.switch {
  margin: 0 8px;
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 28px;
  box-shadow: 0 0.125rem 0.125rem #222;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #e0ea9b;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
.note {
  height: 28px;
  line-height: 28px;
}
</style>
