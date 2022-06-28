import { reactive } from 'vue';

export default function useCorrect(id: string) {
  const correctState = reactive({
    visible: false,
    id,
  });

  const handleOpenCorrectDialog = () => {
    correctState.visible = true;
  };

  const handleCloseCorrectDialog = () => {
    correctState.visible = false;
  };

  return {
    correctState,
    handleOpenCorrectDialog,
    handleCloseCorrectDialog,
  };
}
