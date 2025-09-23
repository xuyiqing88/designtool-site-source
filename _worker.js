// /_worker.js (带有详细错误报告的版本)

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST' && new URL(request.url).pathname === '/api/remove-background') {
      try {
        // 步骤1：检查AI绑定是否存在
        if (!env.AI) {
          // 如果绑定不存在，抛出一个明确的错误
          throw new Error("Workers AI binding ('AI') is missing. Please check the `wrangler.toml` file and the project settings in the Cloudflare dashboard.");
        }

        const model = '@cf/img/background-removal-upernet-resnet50';
        const imageArrayBuffer = await request.arrayBuffer();

        // 步骤2：运行AI模型
        const response = await env.AI.run(model, {
          image: [...new Uint8Array(imageArrayBuffer)],
        });

        // 步骤3：返回成功结果
        return new Response(response, {
          headers: {
            'content-type': 'image/png',
          },
        });

      } catch (e) {
        // 关键：捕获任何发生的错误
        console.error("Worker caught an exception:", e);

        // 将详细的错误信息打包成JSON格式，返回给浏览器
        const errorBody = {
          message: e.message,
          stack: e.stack,
          cause: e.cause ? e.cause.toString() : null, // 有些平台错误会包含cause
        };
        
        return new Response(JSON.stringify(errorBody, null, 2), { // 格式化JSON以便阅读
          status: 500, // 仍然是500错误
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    // 其他请求照常由Pages处理
    return env.ASSETS.fetch(request);
  },
};