<template>
  <div class="inp">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    <div v-if="charCount && maxLength" class="char-count">
      {{ modelValue.length }}/{{ maxLength }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    id: { type: String, default: '' },
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    modelValue: { type: [String, Number], default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    charCount: { type: Boolean, default: false },
    maxLength: { type: Number, default: null }
  },
  emits: ['update:modelValue', 'blur', 'focus']
}
</script>