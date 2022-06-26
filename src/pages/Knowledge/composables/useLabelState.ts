import { reactive, onMounted, ref } from 'vue';
import { getLabelList } from '@/services/systemSetter/label';

export default function useLabelState() {
  const labelOptions = ref<{ label: string; value: string }[]>([]);

  const fetchLabelList = async (name?: string) => {
    const data: Record<string, any> = {};
    if (name) data['labelName' as keyof typeof data] = name;
    const { records } = await getLabelList(data);
    const vlaue = records.map((item) => ({
      label: item.labelName,
      value: item.id,
    }));
    labelOptions.value = vlaue;
  };

  const CreateLabelDialogState = reactive({
    visible: false,
  });

  const handleCreateLabel = () => {
    CreateLabelDialogState.visible = true;
  };

  const handleCancelLabelCreateDialog = () => {
    CreateLabelDialogState.visible = false;
  };

  onMounted(() => {
    fetchLabelList();
  });

  return {
    fetchLabelList,
    labelOptions,
    CreateLabelDialogState,
    handleCreateLabel,
    handleCancelLabelCreateDialog,
  };
}
