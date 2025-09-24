/**
 * [安全版] Cloudflare Function
 * 使用环境变量中的 API Token 来作为 Pollinations AI API 的代理。
 */
export async function onRequestPost(context) {
  try {
    // 从环境变量中安全地获取 API Token
    // 'POLLINATIONS_API_TOKEN' 就是你在 Cloudflare Dashboard 中设置的变量名
    const apiToken = context.env.POLLINATIONS_API_TOKEN;

    if (!apiToken) {
      return new Response(JSON.stringify({ error: 'API token not configured on the server.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const requestData = await context.request.json();
    const { prompt, width, height, image, strength, seed, model } = requestData;

    if (!prompt || !width || !height || !image) {
      return new Response(JSON.stringify({ error: 'Missing required parameters.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // [修改点 1] 移除 referrer 参数
    const params = new URLSearchParams({
      width,
      height,
      image,
      strength: strength || 0.6,
      seed: seed || Math.floor(Math.random() * 1000000),
      model: model || 'kontext',
      nologo: 'true',
      safe: 'false',
    });

    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;

    // [修改点 2] 创建带有认证头的请求
    // 大多数 API 使用 'Authorization' 请求头来传递密钥
    const apiRequest = new Request(apiUrl, {
      method: 'GET', // Pollinations API 仍然是 GET 请求
      headers: {
        // 这是最标准的 API Token 认证方式
        'Authorization': `Bearer ${apiToken}`
      }
    });

    // 从 Cloudflare 服务器向目标 API 发起带有认证的请求
    const aiResponse = await fetch(apiRequest);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      return new Response(JSON.stringify({ error: `AI API Error: ${errorText}` }), {
        status: aiResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 将图片数据流式返回给前端
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