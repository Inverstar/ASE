import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel/serverless';
import node from '@astrojs/node';
import elm from 'vite-plugin-elm';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';


// 判断是否在 Vercel 环境 (Vercel 平台自带此变量)
const IS_VERCEL = process.env.VERCEL === '1';

export default defineConfig({
  // 开启 SSR (服务端渲染) 模式
  output: 'server',

  // 逻辑反转：如果是 Vercel，用 Vercel 适配器；
  // 否则（Zeabur、本地、Docker），统统用 Node 适配器。
  adapter: IS_VERCEL 
    ? vercel({}) 
    : node({ mode: 'standalone' }),

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