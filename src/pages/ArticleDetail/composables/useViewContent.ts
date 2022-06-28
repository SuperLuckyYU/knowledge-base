import { reactive } from 'vue';

export default function useViewContent() {
  const viewContentState = reactive({
    visible: false,
    content: '',
  });

  const handleViewContent = (content: string) => {
    viewContentState.visible = true;
    viewContentState.content = content;
  };

  const handleCloseViewContentDialog = () => {
    viewContentState.visible = false;
  };

  return {
    viewContentState,
    handleViewContent,
    handleCloseViewContentDialog,
  };
}
