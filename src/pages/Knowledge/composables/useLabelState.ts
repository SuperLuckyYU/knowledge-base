import { reactive, onMounted } from 'vue';

export default function useLabelState() {
  const labelOptions = reactive([]);

  const fetchLabelList = () => {
    const vlaue = [
      {
        label: '水行政',
        value: '0',
      },
      {
        label: '水务志',
        value: '1',
      },
    ];
    Object.assign(labelOptions, vlaue);
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
