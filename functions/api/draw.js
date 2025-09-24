// 文件: functions/api/draw.js
export async function onRequestPost(context) {
  try {
    // 1. 安全地从 Cloudflare 环境变量中获取您的私人 API Token
    const apiToken = context.env.POLLINATIONS_API_TOKEN;

    if (!apiToken) {
      return new Response(JSON.stringify({ error: '服务器未配置API Token。' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. 解析从前端 (api-handler.js) 发来的 JSON 数据
    const requestData = await context.request.json();

    if (!requestData.prompt || !requestData.width || !requestData.height) {
      return new Response(JSON.stringify({ error: '缺少必要的参数(prompt, width, height)。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. 构建发往 Pollinations AI 的最终URL
    // URLSearchParams 会自动处理特殊字符的编码
    const params = new URLSearchParams({
      width: requestData.width,
      height: requestData.height,
      seed: requestData.seed || Math.floor(Math.random() * 1000000),
      nologo: 'true',
      safe: 'false',
      // [核心安全步骤] 在这里使用您储存在服务器的私密 Token
      referrer: apiToken,
    });
    
    // 动态添加前端传来的其他可选参数
    if (requestData.model) params.append('model', requestData.model);
    if (requestData.enhance) params.append('enhance', 'true');
    if (requestData.style) params.append('style', requestData.style);
    if (requestData.image) params.append('image', requestData.image);
    if (requestData.strength) params.append('strength', requestData.strength);
    if (requestData.negative_prompt) params.append('negative_prompt', requestData.negative_prompt);

    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(requestData.prompt)}?${params.toString()}`;

    // 4. 从后端服务器发起对 Pollinations AI 的请求
    const aiResponse = await fetch(apiUrl);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      return new Response(JSON.stringify({ error: `AI接口错误: ${errorText}` }), {
        status: aiResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. 成功后，将获取到的图片直接返回给前端
    return new Response(aiResponse.body, {
      status: 200,
      headers: {
        'Content-Type': aiResponse.headers.get('Content-Type') || 'image/png',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: `服务器内部错误: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}