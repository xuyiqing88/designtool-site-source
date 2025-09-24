/**
 * [最终通用版] Cloudflare Pages Function - AI 绘图统一代理
 *
 * 部署方式:
 * 将此文件放置在 Cloudflare Pages 项目的 functions 目录下，例如 /functions/api/generate-image.js
 * 文件名和路径决定了它将响应 /api/generate-image 的请求。
 * 函数名 `onRequestPost` 决定了它只响应 POST 方法的请求。
 */
export async function onRequestPost(context) {
  try {
    // 从环境变量中安全地获取 API Token
    // `context.env.POLLINATIONS_API_TOKEN` 会读取你在 Pages 项目设置中配置的同名环境变量
    const apiToken = context.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      return new Response(JSON.stringify({ error: 'API token not configured on the server.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 解析前端发送的 JSON 数据
    const requestData = await context.request.json();
    
    // 验证所有请求都必须包含的基础参数
    const { prompt, width, height } = requestData;
    if (!prompt || !width || !height) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: prompt, width, or height.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 动态构建 API 参数
    const params = new URLSearchParams({
      width,
      height,
      seed: requestData.seed || Math.floor(Math.random() * 1000000),
      nologo: 'true',
      safe: 'false',
    });

    // ---- 智能模式判断 ----
    if (requestData.image) {
      // 模式 A: 图生图 或 扩图
      params.append('model', requestData.model || 'kontext');
      params.append('image', requestData.image);
      params.append('strength', requestData.strength || 0.7);
      if (requestData.negative_prompt) {
        params.append('negative_prompt', requestData.negative_prompt);
      }
    } 
    else {
      // 模式 B: 文生图
      params.append('model', requestData.model || 'flux');
      if (requestData.style) {
        params.append('style', requestData.style);
      }
      if (requestData.enhance) {
        params.append('enhance', 'true');
      }
    }

    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;

    const apiRequest = new Request(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });

    const aiResponse = await fetch(apiRequest);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      return new Response(JSON.stringify({ error: `AI API Error: ${errorText}` }), {
        status: aiResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(aiResponse.body, {
      status: 200,
      headers: {
        'Content-Type': aiResponse.headers.get('Content-Type') || 'image/png',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}