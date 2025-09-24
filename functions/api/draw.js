// 文件: functions/api/draw.js (V3 - 使用 Authorization Header)

export async function onRequestPost(context) {
  try {
    const apiToken = context.env.POLLINATIONS_API_TOKEN;

    if (!apiToken) {
      console.error("错误：服务器未能从环境变量中读取 POLLINATIONS_API_TOKEN。");
      return new Response(JSON.stringify({ error: '服务器未配置API Token。' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    const requestData = await context.request.json();

    if (!requestData.prompt || !requestData.width || !requestData.height) {
      return new Response(JSON.stringify({ error: '缺少必要的参数(prompt, width, height)。' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // [核心修改 1] 构建 URL 时，不再需要 'referrer' 参数了
    const params = new URLSearchParams({
      width: requestData.width,
      height: requestData.height,
      seed: requestData.seed || Math.floor(Math.random() * 1000000),
      nologo: 'true',
      safe: 'false',
    });
    
    // 动态添加其他参数 (保持不变)
    if (requestData.model) params.append('model', requestData.model);
    if (requestData.enhance) params.append('enhance', 'true');
    if (requestData.style) params.append('style', requestData.style);
    if (requestData.image) params.append('image', requestData.image);
    if (requestData.strength) params.append('strength', requestData.strength);
    if (requestData.negative_prompt) params.append('negative_prompt', requestData.negative_prompt);

    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(requestData.prompt)}?${params.toString()}`;

    console.log(`正在请求的URL (不含Token): ${apiUrl}`);

    // [核心修改 2] 在 fetch 请求中，通过 Authorization Header 发送 Token
    const aiResponse = await fetch(apiUrl, {
        method: 'GET', // API 依然是 GET 请求
        headers: {
            // 这是最标准的 API Token 验证方式
            'Authorization': `Bearer ${apiToken}`
        }
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error(`AI 接口返回错误: ${errorText}`);
      return new Response(JSON.stringify({ error: `AI接口错误: ${errorText}` }), {
        status: aiResponse.status, headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(aiResponse.body, {
      status: 200,
      headers: {
        'Content-Type': aiResponse.headers.get('Content-Type') || 'image/png',
      },
    });

  } catch (error) {
    console.error(`服务器内部错误: ${error.message}`);
    return new Response(JSON.stringify({ error: `服务器内部错误: ${error.message}` }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}