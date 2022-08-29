import type { CreateFormState } from '@/types/myKnowledge/knowledge';
import { reactive, computed } from 'vue';

export default function useFormState() {
  const modelRef = reactive<CreateFormState>({
    type: '2',
    file: [],
    entry: '',
    category: '',
    doc_number: '',
    file_date: '',
    pages_num: '',
    storage_location: '',
    content: '',
    label: [],
    safe_level: '0',
    expiration_type: '0',
    expiration_date: '',
    project: '',
    location: '',
  });

  const rulesRef = computed(() => ({
    type: [
      {
        required: true,
        message: '请选择知识类型',
      },
    ],
    file: [
      {
        required: false,
        message: '请上传文件',
      },
    ],
    entry: [
      {
        required: true,
        message: '请填写知识条目',
      },
    ],
    category: [
      {
        required: true,
        message: '请选择知识分类',
      },
    ],
    doc_number: [
      {
        required: false,
      },
    ],
    file_date: [
      {
        required: false,
      },
    ],
    pages_num: [
      {
        required: false,
      },
    ],
    storage_location: [
      {
        required: false,
      },
    ],
    content: [
      {
        required: false,
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
    expiration_type: [
      {
        required: false,
      },
    ],
    expiration_date: [
      {
        required: false,
      },
    ],
    project: [
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
