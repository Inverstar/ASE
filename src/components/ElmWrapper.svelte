<script>
  import { onMount } from 'svelte';
  
  let node;

  onMount(async () => {
    try {
      // 动态导入 Elm 模块
      const module = await import('../elm/Counter.elm');
      const Elm = module.default || module.Elm || module;
      
      console.log('Elm module loaded:', module);
      console.log('Elm.Counter:', Elm?.Counter);
      
      if (Elm && Elm.Counter) {
        Elm.Counter.init({
          node: node
        });
        console.log('Elm app initialized successfully');
      } else if (Elm && Elm.init) {
        Elm.init({
          node: node
        });
        console.log('Elm app initialized successfully');
      } else {
        console.error('No init function found in Elm module');
      }
    } catch (e) {
      console.error('Failed to load or initialize Elm app:', e);
    }
  });
</script>

<!-- 这个 div 就是 Elm 渲染的地方 -->
<div bind:this={node}></div>