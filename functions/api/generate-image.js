/**
 * [最终通用版] Cloudflare Worker - AI 绘图代理
 * * 功能:
 * 1. 作为 Pollinations.ai 的安全代理，使用环境变量隐藏 API Token。
 * 2. 统一处理来自前端的多种绘图请求：
 * - 文生图 (Text-to-Image): 从 draw.html 调用
 * - 图生图 (Image-to-Image): 从 draw.html 调用
 * - 扩图 (Image Expansion): 从 expand.html 调用
 * 3. 智能判断请求类型并构建相应的 API URL。
 */
export default {
  async fetch(request, env, ctx) {
    // 确保只接受 POST 请求，这是前端调用此 Worker 的唯一方式
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Expected POST method' }), {
        status: 405, // Method Not Allowed
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // 1. 安全地从环境变量中获取 API Token
      const apiToken = env.POLLINATIONS_API_TOKEN;
      if (!apiToken) {
        // 如果服务器未配置 Token，返回服务器错误
        return new Response(JSON.stringify({ error: 'API token not configured on the server.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 2. 解析前端发送的 JSON 数据
      const requestData = await request.json();
      
      // 3. 验证所有请求都必须包含的基础参数
      const { prompt, width, height } = requestData;
      if (!prompt || !width || !height) {
        return new Response(JSON.stringify({ error: 'Missing required parameters: prompt, width, or height.' }), {
          status: 400, // Bad Request
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 4. 动态构建 API 参数
      const params = new URLSearchParams({
        width,
        height,
        seed: requestData.seed || Math.floor(Math.random() * 1000000),
        nologo: 'true', // 默认不带logo
        safe: 'false',   // 默认不过滤内容
      });

      // ---- 智能模式判断 ----
      // 通过检查请求中是否包含 'image' 字段来区分不同模式
      if (requestData.image) {
        // [模式 A]: 图生图 或 扩图
        // 这两种模式的 API 调用结构完全相同
        params.append('model', requestData.model || 'kontext'); // 图生图/扩图通常使用 kontext 模型
        params.append('image', requestData.image);
        params.append('strength', requestData.strength || 0.7);
        if (requestData.negative_prompt) {
          params.append('negative_prompt', requestData.negative_prompt);
        }
      } 
      else {
        // [模式 B]: 文生图
        params.append('model', requestData.model || 'flux'); // 文生图可选用 flux 或 turbo
        if (requestData.style) {
          params.append('style', requestData.style);
        }
        if (requestData.enhance) {
          params.append('enhance', 'true');
        }
      }

      // 5. 拼接最终的 API URL
      const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;

      // 6. 创建带有认证头的请求，发往 Pollinations.ai
      const apiRequest = new Request(apiUrl, {
        method: 'GET',
        headers: {
          // 使用 Bearer Token 认证方式
          'Authorization': `Bearer ${apiToken}`
        }
      });

      // 从 Cloudflare 服务器发起真实请求
      const aiResponse = await fetch(apiRequest);

      // 7. 处理来自 Pollinations.ai 的响应
      if (!aiResponse.ok) {
        // 如果 AI 服务返回错误，将错误信息透传给前端
        const errorText = await aiResponse.text();
        return new Response(JSON.stringify({ error: `AI API Error: ${errorText}` }), {
          status: aiResponse.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 8. 成功后，将图片数据流式返回给前端
      return new Response(aiResponse.body, {
        status: 200,
        headers: {
          'Content-Type': aiResponse.headers.get('Content-Type') || 'image/png',
        },
      });

    } catch (error) {
      // 捕获意外错误
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};