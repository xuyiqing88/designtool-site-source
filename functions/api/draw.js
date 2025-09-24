// 文件路径: functions/api/draw.js
// 这是 draw.html 专用的后端，与 generate-image.js 完全无关。

export async function onRequestPost(context) {
  try {
    // 从环境变量中安全地获取 API Token
    const apiToken = context.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      return new Response(JSON.stringify({ error: '服务器未配置API Token。' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const requestData = await context.request.json();

    // 基础参数校验
    if (!requestData.prompt || !requestData.width || !requestData.height) {
      return new Response(JSON.stringify({ error: '缺少必要的参数(prompt, width, height)。' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // 构建URL参数，不包含referrer
    const params = new URLSearchParams({
      width: requestData.width,
      height: requestData.height,
      seed: requestData.seed || Math.floor(Math.random() * 1000000),
      nologo: 'true',
      safe: 'false',
    });
    
    // 动态添加所有从 draw.html 前端传来的可选参数
    const optionalParams = ['model', 'enhance', 'style', 'image', 'strength', 'negative_prompt'];
    optionalParams.forEach(param => {
      // 将 'enhance' 参数的值设为 'true' 字符串
      if (param === 'enhance' && requestData[param]) {
        params.append(param, 'true');
      } else if (requestData[param]) {
        params.append(param, requestData[param]);
      }
    });

    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(requestData.prompt)}?${params.toString()}`;

    // 使用 Authorization Header 发送 Token
    const aiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiToken}`
        }
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      return new Response(JSON.stringify({ error: `AI接口错误: ${errorText}` }), { status: aiResponse.status, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(aiResponse.body, {
      status: 200,
      headers: { 'Content-Type': aiResponse.headers.get('Content-Type') || 'image/png' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: `服务器内部错误: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}