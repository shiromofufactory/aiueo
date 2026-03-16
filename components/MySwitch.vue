<template lang="pug">
div.switch-field
  span.note(v-if="showLabel") {{ label }}
  .switch-control
    label.switch
      input(:checked="value" type="checkbox" @input="$emit('input',$event)")
      span.slider
    span.status(v-if="showStatus") {{ value ? onText : offText }}
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: false
    },
    label: {
      type: String,
      required: false,
      default: "ゆっくり発語"
    },
    showLabel: {
      type: Boolean,
      required: false,
      default: true
    },
    showStatus: {
      type: Boolean,
      required: false,
      default: false
    },
    onText: {
      type: String,
      required: false,
      default: "ON"
    },
    offText: {
      type: String,
      required: false,
      default: "OFF"
    }
  }
}
</script>

<style scoped>
.switch-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.switch-control {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.switch {
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

.status {
  min-width: 2.5rem;
  height: 28px;
  line-height: 28px;
  color: #4a4a4a;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: left;
}
</style>
