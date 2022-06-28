import { reactive } from 'vue';

export default function useRate(id: string) {
  const rateState = reactive({
    visible: false,
    id,
  });

  const handleRate = () => {
    rateState.visible = true;
  };

  const handleCloseRateDialog = () => {
    rateState.visible = false;
  };

  return {
    rateState,
    handleRate,
    handleCloseRateDialog,
  };
}
