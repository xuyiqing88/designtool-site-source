export default {
  async fetch(request, env, ctx) {
    // 获取访问的URL路径
    const url = new URL(request.url);

    // 规则：如果有人专门访问 /api/get-model 这个路径
    // 我们就去R2里加载模型并返回信息
    if (url.pathname === '/api/get-model') {
      try {
        const object = await env.MY_MODEL_BUCKET.get('u2netp.onnx');

        if (object === null) {
          return new Response('模型文件未在R2中找到', { status: 404 });
        }

        // 只是为了演示，返回一个成功信息
        // 实际应用中你会在这里执行模型推理
        return new Response('成功从R2加载模型！模型大小: ' + object.size + ' 字节');

      } catch (e) {
        return new Response('从R2加载模型时发生错误: ' + e.message, { status: 500 });
      }
    }

    // 对于所有其他访问请求 (比如访问 index.html, style.css 等)
    // 我们让Cloudflare Pages自己去处理，把静态文件返回给用户
    // 这会让您的网站正常显示出来！
    return env.ASSETS.fetch(request);
  },
};