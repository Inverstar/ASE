<script>
  import { onMount } from 'svelte';
  
  export let targetNumber = 10;
  
  let node;
  let hasRedirected = false;

  onMount(async () => {
    try {
      // 动态导入 Elm 模块
      const module = await import('../elm/Counter.elm');
      const Elm = module.default || module.Elm || module;
      
      console.log('Elm module loaded:', module);
      console.log('Target number:', targetNumber);
      
      if (Elm && Elm.Counter) {
        const app = Elm.Counter.init({
          node: node,
          flags: { targetNumber: targetNumber }
        });
        console.log('Elm app initialized successfully with target:', targetNumber);
        
        // 监听成功消息元素，每100ms检查一次
        const checkInterval = setInterval(() => {
          if (!hasRedirected) {
            const successMsg = document.getElementById('success-message');
            console.log('Checking for success message:', successMsg);
            
            if (successMsg) {
              hasRedirected = true;
              clearInterval(checkInterval);
              console.log('Success detected! Redirecting to profile...');
              
              // 延迟1秒后跳转，让用户看到成功提示
              setTimeout(() => {
                window.location.href = '/profile';
              }, 1000);
            }
          }
        }, 100);
        
        // 页面卸载时清理
        return () => clearInterval(checkInterval);
      } else if (Elm && Elm.init) {
        const app = Elm.init({
          node: node,
          flags: { targetNumber: targetNumber }
        });
        console.log('Elm app initialized successfully with target:', targetNumber);
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