<template>
  <div class="inp">
    <label v-if="label" :for="id">{{ label }}</label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :maxlength="maxLength"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    ></textarea>
    <div v-if="charCount && maxLength" class="char-count">
      {{ modelValue.length }}/{{ maxLength }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextArea',
  props: {
    id: { type: String, default: '' },
    label: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    rows: { type: Number, default: 4 },
    disabled: { type: Boolean, default: false },
    charCount: { type: Boolean, default: false },
    maxLength: { type: Number, default: null }
  },
  emits: ['update:modelValue', 'blur', 'focus']
}
</script>