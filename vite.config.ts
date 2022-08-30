import { UserConfig, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import unElementPlus from 'unplugin-element-plus/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver, AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

const port = 3000;

function resovePath(paths: string) {
  return path.resolve(__dirname, paths);
}

let plugins = [
  vue(),
  unElementPlus({
    useSource: true,
  }),
  Components({
    // dirs: ['src/components'],
    resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
  }),
  visualizer(),
];

export default ({ mode }: ConfigEnv): UserConfig => {
  const isDev = mode === 'development';
  const publicPath = isDev ? '/' : `/knowledge/`;
  // const publicPath = isDev ? '/' : `/`;
  const distDir = path.join(__dirname, `../../../www/${publicPath}`);

  return {
    root: path.join(__dirname, '.'),
    base: publicPath, // 设置打包路径
    // server
    server: {
      // 服务配置
      port: port, // 类型： number 指定服务器端口;
      open: true, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      host: '0.0.0.0',
      proxy: {
        '/api': {
          // target: 'http://47.98.251.91:8662/',
          // target: 'http://47.98.139.3:8662/',
          target: 'http://192.168.1.13:8662/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // plugins
    plugins,
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
      outDir: 'knowledge',
      // outDir: 'dist',
      sourcemap: false,
      brotliSize: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          // drop_console: true,
          drop_debugger: true,
        },
      },
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          //静态资源分类打包
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            //静态资源分拆打包
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@config': resovePath('./config'),
        '@components': resovePath('./src/components'),
        '@utils': resovePath('./src/utils'),
        '@api': resovePath('./src/api'),
      },
    },
  };
};
