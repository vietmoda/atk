<template>
  <QuillEditor v-model:content="contentHTML" content-type="html" toolbar="#custom-toolbar">
    <template #toolbar>
        <div id="custom-toolbar">
          <select class="ql-header">
            <option :value="1"></option>
            <option :value="2"></option>
            <option :value="3"></option>
            <option :value="4"></option>
            <option :value="5"></option>
            <option :value="6"></option>
            <option selected></option>
          </select>
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
          <button class="ql-script" value="sub"></button>
          <button class="ql-script" value="super"></button>
          <select class="ql-align">
            <option selected></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
          <button class="ql-blockquote"></button>
          <button class="ql-code-block"></button>
          <button class="ql-link"></button>
          <button class="ql-image"></button>
          
        </div>
      </template>
    </QuillEditor>
</template>

<script setup>
import { ref, defineComponent, defineProps, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const emit = defineEmits(['update:content'])

const props = defineProps({
  content: String
})

const contentHTML = ref(props.content || '')

watch(contentHTML, () => {
  emit('update:content', contentHTML.value)
})

watch(()=>props.content,()=>{
  Object.assign(contentHTML,props.content)
})
</script>
