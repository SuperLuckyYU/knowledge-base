import { message } from 'ant-design-vue';
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { isArray } from 'lodash-es';
import { useUserStore } from '@/store/moudles/user';
import { removeNullItem } from './utils';
import qs from 'qs';

interface IAxiosRequestConfig extends AxiosRequestConfig {
  useDefaultParms?: boolean;
  useGenParams?: boolean;
}

interface IAxiosGet {
  <T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig | null,
  ): Promise<T>;
}
interface IAxiosPostOrPutOrDelete {
  <T = any>(url: string, data?: Record<string, any>, config?: IAxiosRequestConfig): Promise<T>;
}

/**
 * 展示错误原因
 * @param msg
 */
const showErrorMessage = (msg: string) => {
  message.error(msg);
};

/**
 * 默认的请求配置
 */
export const defaultConfig = {
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000,
  showMsg: false, //是否显示默认提示，false用来配置特殊情况的提示弹窗
};

/**
 * 默认请求参数
 * @returns {{"app-code": string, "yd-login-token": any}}
 */
export const getDefaultParams = (config: IAxiosRequestConfig) => {
  if (config.useDefaultParms === false) {
    return {};
  }
  const userStore = useUserStore();
  const result ={
    userId: userStore.userInfo.pUserId,
    opUser: userStore.userInfo.userName,
  };
  removeNullItem(result)
  return result
};

/**
 * axios的实例
 * @type {AxiosInstance}
 */
const service: AxiosInstance = axios.create(defaultConfig);
service.defaults.withCredentials = true;

/**
 * axios的实例请求拦截器
 */
service.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    // 设备断网
    if (navigator.onLine !== undefined && navigator.onLine === false) {
      return Promise.reject({ message: '网络未链接', code: -1 });
    }

    /**
     * 合并参数
     */
    if (config.method == 'get') {
      config.params = { ...getDefaultParams(config as IAxiosRequestConfig), ...config.params };
    }
    if (config.method == 'post') {
      const data = {
        ...getDefaultParams(config as IAxiosRequestConfig),
        ...config.data,
      };
      if (config['useGenParams' as keyof typeof config] === false) {
        if (isArray(config.data)) {
          config.data = config.data.map((item) => {
            return { ...item, ...getDefaultParams(config) };
          });
          return config;
        }
        return config;
      }
      config.data = config.data instanceof FormData ? config.data : data; // 转为formdata数据格式
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

/**
 * axios的实例响应
 */
service.interceptors.response.use(
  function (response: AxiosResponse) {
    // 对响应数据做点什么
    const { data, config } = response;
    if (config.url?.indexOf('pandora.yidian-inc.com') !== -1) {
      if (data && data.status === 'success') {
        return data;
      } else {
        return Promise.reject();
      }
    }

    const code = data.code ?? -1;
    if (code !== 1000) {
      const message = data.message || '未定义错误';
      showErrorMessage(data.message);
      return Promise.reject({ code, message });
    }
    if (config['showMsg' as keyof typeof config] && data.message) {
      message.info(data.message);
    }
    return data.data;
  },
  function (error) {
    if (!(error.code && error.code === -1)) error.message = '接口请求错误，请联系管理员';
    showErrorMessage(error.message);
    return Promise.reject(error);
  },
);

export const get: IAxiosGet = (url, params, config) => {
  return service.get(url, { params, ...config });
};

export const post: IAxiosPostOrPutOrDelete = (url, data, config) => {
  return service.post(url, data, config);
};

export const put: IAxiosPostOrPutOrDelete = (url, data, config) => {
  return service.put(url, data, config);
};

export const deleteRequest: IAxiosPostOrPutOrDelete = (url, data, config) => {
  return service.delete(url, { data, ...config });
};

export default service;
