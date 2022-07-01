import Cookies from 'js-cookie';
import * as C from '@/constants/index';

/**
 * @param {Date|Number} 日期对象或时间戳
 * @param {String} 模板字符串
 * @description 格式化日期对象 dd-MM-yyyy hh:mm:ss
 */
export const formatDate = (date: string | number | Date, layout = 'yyyy-MM-dd hh:mm:ss') => {
  if (!date) return null;
  date = new Date(date);
  let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  let y: string = date.getFullYear() + '';
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return layout
    .replace('yyyy', y)
    .replace('MM', M as string)
    .replace('dd', d as string)
    .replace('hh', h as string)
    .replace('mm', m as string)
    .replace('ss', s as string);
};

/**
 * 移除对象中的 undefined null 空字符串
 * @param obj
 */
export const removeNullItem = (obj: any, removeNullString = true) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
    if (removeNullString && obj[key] === '') {
      delete obj[key];
    }
    if (JSON.stringify(obj[key]) === '[]' || JSON.stringify(obj[key]) === '{}') {
      delete obj[key];
    }
  });
  return obj;
};

/**
 * @param {File} file对象
 * @description 将antd处理后的file格式转换为base64
 */
export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
};

/**
 * @param {File} file对象
 * @description 将originFile格式转换为base64
 */
export const getBase64FromOriginFile = (file: BlobPart) => {
  return new Promise(function (resolve, reject) {
    const aBlob = new Blob([file], { type: 'video/mp4' });
    const reader = new FileReader();
    reader.readAsDataURL(aBlob);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * @param {File} file对象
 * @description 将base64转换为文件
 */
export const genBase64ToFile = (dataUrl: any, fileName: string) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

// 获取图片的源url
export const getImgOgriginUrl = (fileList: any[]) => {
  return fileList.map((item) => {
    return item.response?.url;
  });
};

/**
 *
 * @param {*} fileList
 * @param {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        thumbUrl: data.pic_url,
        type: 'image/png',
        response: {
          url:  data.pic_url
        }
      }
 * @returns
 */
export const mockImgUrl = (fileList: string[] | string) => {
  if (!fileList.length) return [];
  if (typeof fileList === 'string') {
    const fileNameArr = fileList.split('/');
    return [
      {
        uid: '-1',
        status: 'done',
        thumbUrl: fileList,
        type: 'image/png',
        name: fileNameArr[fileNameArr.length - 1],
        response: fileList,
      },
    ];
  }
  if (typeof fileList === 'object') {
    return fileList.map((item: string, index) => {
      const fileNameArr = item.split('/');
      return {
        uid: (-(index + 1)).toString(),
        status: 'done',
        thumbUrl: item,
        type: 'image/png',
        name: fileNameArr[fileNameArr.length - 1],
        response: item,
      };
    });
  }
  return [];
};

// 获取用户信息
export const getUserInfo = () => {
  let info = {
    user_id: Cookies.get('userid'),
    operator: Cookies.get('nickname'),
  };
  return info;
};

/**
 * 获取首页的route
 */
export const getRouteList = (routers: any, route = []) => {
  let i = -1;
  let len = routers.length;
  let routeList: any = route;
  while (++i < len) {
    let item: any = routers[i];
    if (item.children && item.children.length) {
      let res: any = getRouteList(item.children, routeList);
      if (res.name) return res;
    } else {
      if (item.path) routeList.push(item);
    }
  }
  return routeList;
};
