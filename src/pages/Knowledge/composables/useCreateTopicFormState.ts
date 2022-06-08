import { reactive, computed } from 'vue';

export default function useFormState() {
  const modelRef = reactive({
    name: '',
    category: '',
    content: '',
    label: [],
    safe_level: '0',
    location: '',
  });

  const rulesRef = computed(() => ({
    name: [
      {
        required: true,
        message: '请填写标题',
      },
    ],
    category: [
      {
        required: true,
        message: '请选择分类',
      },
    ],
    content: [
      {
        required: true,
        message: '请填写专题描述',
      },
    ],
    label: [
      {
        required: false,
      },
    ],
    safe_level: [
      {
        required: false,
      },
    ],
    location: [
      {
        required: false,
      },
    ],
    knowledge: [
      {
        required: false,
      },
    ],
  }));

  return {
    modelRef,
    rulesRef,
  };
}
