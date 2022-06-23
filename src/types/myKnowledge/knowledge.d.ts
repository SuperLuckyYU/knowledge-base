export interface FormStateType {
  knowledgeName: string;
  labelId: string[];
}

export interface KnowledgeItemType {
  id: string;
  name: string;
}

export interface UploadDocumentFormState {
  fileList: any[];
  category: string;
  label: string[];
}
