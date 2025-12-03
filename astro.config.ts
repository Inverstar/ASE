import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel/serverless';
import node from '@astrojs/node';
import elm from 'vite-plugin-elm';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';


// 判断是否在 Zeabur 构建 (通过环境变量)
const IS_ZEABUR = process.env.DEPLOY_PLATFORM === 'zeabur';

export default defineConfig({
  // 开启 SSR (服务端渲染) 模式
  output: 'server',

  // 动态选择适配器：
  // 如果是 Zeabur 就用 Node 模式，否则默认用 Vercel 模式
  adapter: IS_ZEABUR 
    ? node({ mode: 'standalone' }) 
    : vercel({}),

  // 启用 Svelte 支持
  integrations: [svelte(), sentry(), spotlightjs()],

  // 配置 Vite 插件来处理 Elm 文件
  vite: {
    plugins: [elm()],
    optimizeDeps: {
        include: ['src/elm/Counter.elm']
    }
  }
});