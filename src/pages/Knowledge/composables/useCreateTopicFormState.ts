import type { CreateTopicFormState } from '@/types/myKnowledge/knowledge';
import { reactive, computed } from 'vue';

export default function useFormState() {
  const modelRef = reactive<CreateTopicFormState>({
    knowledgeName: '',
    knowledgeType: '',
    content: '',
    labels: [],
    securityLevel: '0',
    location: '',
  });

  const rulesRef = computed(() => ({
    knowledgeName: [
      {
        required: true,
        message: '请填写标题',
      },
    ],
    knowledgeType: [
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
    labels: [
      {
        required: false,
      },
    ],
    securityLevel: [
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
