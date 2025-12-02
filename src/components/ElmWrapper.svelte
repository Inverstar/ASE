<script>
  import { onMount } from 'svelte';
  // 导入刚才写的 Elm 文件
  // 使用 vite-plugin-elm 导入 Elm 模块的默认导出
  import Counter from '../elm/Counter.elm';

  let node;

  onMount(() => {
    // 初始化 Elm 应用，挂载到 node 节点上
    Counter.init({
      node
    });
  });
</script>

<!-- 这个 div 就是 Elm 渲染的地方 -->
<div bind:this={node}></div>