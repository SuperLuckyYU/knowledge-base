
import { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
import path from "path";

const port = 3000;

function resovePath(paths: string) {
  // 如何 __dirname 找不到 需要 yarn add @types/node --save-dev
  return path.resolve(__dirname, paths);
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const isDev = mode === 'development';
  const publicPath = isDev ? '/' : `/`;
  const distDir = path.join(__dirname, `../../../www/${publicPath}`);

  return {
    root: path.join(__dirname, '.'),
    base: publicPath, // 设置打包路径
    // server
    server: {
      // 服务配置
      port: port, // 类型： number 指定服务器端口;
      open: true, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: false, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      proxy: {
        '/api': {
          target: 'http://dev.yidian-inc.com:5000',
          changeOrigin: true,
        },
      },
    },
    // plugins
    plugins: [vue()],

    // css
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // 这样就能全局使用 src/assets/styles/base.less 定义的 变量
          // additionalData: `@import "${resovePath('src/assets/styles/base.less')}";`
        },
      },
    },



    // build
    build: {
      emptyOutDir: true,
      // outDir: distDir,
      sourcemap: false,
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src'),
        '@config': resovePath('./config'),
        "@components": resovePath('./src/components'),
        '@utils': resovePath('./src/utils'),
        '@api': resovePath('./src/api'),
      }
    },
  }
};


