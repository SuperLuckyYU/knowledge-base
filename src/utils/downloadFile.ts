/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */
function getBlob(url: string) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };

    xhr.send();
  });
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob: Blob, filename: string) {
  const link = document.createElement('a');
  const body = document.querySelector('body');

  link.href = window.URL.createObjectURL(blob);
  link.download = filename;

  // fix Firefox
  link.style.display = 'none';
  body && body.appendChild(link);

  link.click();
  body && body.removeChild(link);

  window.URL.revokeObjectURL(link.href);
}

/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
export const download = (url: string, filename: string) => {
  getBlob(url).then((blob) => {
    saveAs(blob as Blob, filename);
  });
};
