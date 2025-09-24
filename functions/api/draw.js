/**
 * Cloudflare 后端函数，作为 Pollinations AI 的安全代理
 */
export async function onRequestPost(context) {
  try {
    // 1. 从 Cloudflare 环境变量中安全地获取您的私人 API Token
    const apiToken = context.env.POLLINATIONS_API_TOKEN;

    if (!apiToken) {
      // 如果服务器没有配置 Token，返回服务器错误
      return new Response(JSON.stringify({ error: 'API token not configured on the server.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. 解析从前端发来的请求数据
    const requestData = await context.request.json();

    // 验证必要参数是否存在
    if (!requestData.prompt || !requestData.width || !requestData.height) {
      return new Response(JSON.stringify({ error: 'Missing required parameters.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. 构建发往 Pollinations AI 的 URLSearchParams
    const params = new URLSearchParams({
      width: requestData.width,
      height: requestData.height,
      seed: requestData.seed || Math.floor(Math.random() * 1000000),
      nologo: 'true',
      safe: 'false',
      // [核心修改] 使用从环境变量中获取的私密 Token 替换 referrer
      referrer: apiToken,
    });

    // 如果前端传来了其他可选参数，也一并添加
    if (requestData.model) params.append('model', requestData.model);
    if (requestData.enhance) params.append('enhance', requestData.enhance);
    if (requestData.style) params.append('style', requestData.style);
    if (requestData.image) params.append('image', requestData.image); // 用于图生图
    if (requestData.strength) params.append('strength', requestData.strength); // 用于图生图
    if (requestData.negative_prompt) params.append('negative_prompt', requestData.negative_prompt); // 用于图生图

    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(requestData.prompt)}?${params.toString()}`;

    // 4. 从 Cloudflare 服务器向 Pollinations AI 发起请求
    const aiResponse = await fetch(apiUrl);

    // 5. 检查来自 Pollinations AI 的响应
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      // 将外部 API 的错误信息转发给前端
      return new Response(JSON.stringify({ error: `AI API Error: ${errorText}` }), {
        status: aiResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 6. 成功后，将图片数据流式传输回前端
    return new Response(aiResponse.body, {
      status: 200,
      headers: {
        'Content-Type': aiResponse.headers.get('Content-Type') || 'image/png',
      },
    });

  } catch (error) {
    // 捕获内部代码的异常
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}