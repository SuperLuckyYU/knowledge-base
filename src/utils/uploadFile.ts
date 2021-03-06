// import { getImgTokenFromCookie, decodeToken } from '@/utils/auth.js';
import { updalodFile } from '@/services/myKnowledge/knowledge';

/**
 * 上传图片
 * @param file Image文件
 * @returns promise 接口返回值
 */

export const UploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return updalodFile(formData);
};

/**
 * 上传csv
 * @param file 表格文件
 * @returns promise 接口返回值
 */

// export const UploadCsvFile = async (file: File) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('file_name', file.name);
//   return uploadCsv(formData);
// };
