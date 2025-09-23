// /_worker.js (调用Cloudflare内置模型版)

export default {
  async fetch(request, env, ctx) {
    // 检查请求路径和方法
    if (request.method === 'POST' && new URL(request.url).pathname === '/api/remove-background') {
      try {
        // 定义要使用的Cloudflare内置模型
        const model = '@cf/img/background-removal-upernet-resnet50';

        // 从请求中获取用户上传的图片数据
        const imageBlob = await request.blob();
        const imageArrayBuffer = await imageBlob.arrayBuffer();

        // 关键一步：调用 Workers AI 运行内置模型！
        // 输入是图片数据，输出直接就是抠好图的PNG图片流
        const response = await env.AI.run(model, {
          image: [...new Uint8Array(imageArrayBuffer)],
        });

        // 将模型返回的图片流直接作为响应发送回浏览器
        return new Response(response, {
          headers: {
            'content-type': 'image/png',
          },
        });

      } catch (e) {
        console.error("Workers AI 运行内置模型出错:", e);
        return new Response('调用内置AI模型时发生错误', { status: 500 });
      }
    }

    // 对于其他所有请求，正常返回网站的静态文件
    return env.ASSETS.fetch(request);
  },
};