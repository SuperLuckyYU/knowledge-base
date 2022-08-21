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

/**
 * 画布添加水印
 * wmConfig { font: '', textArray: [], density: 3}
 * font 字体
 * textArray 水印文本内容，允许数组最大长度3 即：3行水印
 * density 密度 建议取值范围1-5   值越大，水印越多，可能会导致水印重叠等问题，慎重！！！
 */
export interface WatermarkConfigType {
  font: string;
  textArray: string[];
  density: number;
}
export const drawWaterMark = (
  ctx: CanvasRenderingContext2D,
  imgWidth: number,
  imgHeight: number,
  wmConfig: WatermarkConfigType,
) => {
  let fontSize = 0;
  if (imgWidth >= 3456) {
    fontSize = 50;
  } else if (imgWidth >= 2700) {
    fontSize = 30;
  } else if (imgWidth >= 2000) {
    fontSize = 26;
  } else if (imgWidth >= 1436) {
    fontSize = 20;
  } else if (imgWidth >= 800) {
    fontSize = 20;
  } else if (imgWidth >= 500) {
    fontSize = 20;
  } else {
    fontSize = 20;
  }
  ctx.fillStyle = 'white';

  ctx.font = `${fontSize}px ${wmConfig.font}`;
  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  //文字坐标

  const maxPx = Math.max(imgWidth, imgHeight);

  const stepPx = Math.floor(maxPx / wmConfig.density);

  let arrayX = [0]; //初始水印位置 canvas坐标 0 0 点
  while (arrayX[arrayX.length - 1] < maxPx / 2) {
    arrayX.push(arrayX[arrayX.length - 1] + stepPx);
  }
  arrayX.push(
    ...arrayX.slice(1, arrayX.length).map((el) => {
      return -el;
    }),
  );

  for (let i = 0; i < arrayX.length; i++) {
    for (let j = 0; j < arrayX.length; j++) {
      ctx.save();
      ctx.translate(imgWidth / 2, imgHeight / 2); ///画布旋转原点 移到 图片中心
      ctx.rotate(-Math.PI / 5);
      if (wmConfig.textArray.length > 3) {
        wmConfig.textArray = wmConfig.textArray.slice(0, 3);
      }
      wmConfig.textArray.forEach((el, index) => {
        let offsetY = fontSize * index + 2;
        ctx.fillText(el, arrayX[i], arrayX[j] + offsetY);
      });
      ctx.restore();
    }
  }
};
