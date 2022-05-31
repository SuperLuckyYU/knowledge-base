interface AppConfig {
  appName: string;
  logo?: string;
  toolId?: number;
  homeName: string
  miscellaneous?: { defaultAvatar: string }
};

const appConfig: AppConfig = {
  appName: '知识库智能管理系统',
  homeName: 'Home',
  miscellaneous: {
    // 配置当用户头像不存在时使用的fallback头像图URL
    defaultAvatar: '//s.go2yd.com/a/thead_meiguoduizhang.png',
  },
};

export default appConfig;
