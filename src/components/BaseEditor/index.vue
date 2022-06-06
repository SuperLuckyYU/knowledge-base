<template>
  <div class="base-editor border">
    <Toolbar class="border-bt" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor class="editor" :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" @onCreated="handleCreated"
      @onChange="handleChange" />
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, toRefs } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { cloneDeep } from 'lodash';

interface Editor {
  getHtml(): string;
}

const props = defineProps({
  modelValue: {
    type: String,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const { modelValue } = toRefs(props);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const mode = ref('default');

// 内容 HTML
const valueHtml = ref('');
valueHtml.value = cloneDeep(modelValue.value);

const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor: Editor) => {
  editorRef.value = editor;
};
const handleChange = (editor: Editor) => {
  emit('update:modelValue', editor.getHtml());
};
</script>

<style lang="less" scoped>
@border-option: 1px solid #ccc;

.border {
  border: @border-option
}

.border-bt {
  border-bottom: @border-option
}

.base-editor :deep(.editor) {
  height: 400px !important;
  overflow-y: hidden
}
</style>
