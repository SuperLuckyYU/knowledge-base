export interface FormStateType {
  knowledgeName: string;
  // labelId: string;
}

export interface KnowledgeItemType {
  id: string;
  name: string;
}

export interface UploadDocumentFormState {
  fileList: any[];
  category: string;
  // label: string[];
}

export interface CreateFormState {
  type: string;
  file: any[];
  entry: string;
  category: string;
  doc_number: string;
  file_date: string;
  pages_num: string;
  storage_location: string;
  content: string;
  label: string[];
  safe_level: string;
  expiration_type: string;
  expiration_date: string;
  project: string;
  location: string;
}

export interface CreateTopicFormState {
  knowledgeName: string;
  knowledgeType: string;
  content: string;
  labels: string[];
  securityLevel: string;
  location: string;
}
