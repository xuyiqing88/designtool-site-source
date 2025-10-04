/**
 * [最终修正版] Cloudflare Pages Function - AI 绘图统一代理
 *
 * 修正:
 * - 将对 Pollinations.ai 的请求从 GET 改为 POST。
 * - 将包括 Data URI 在内的所有参数放入 POST 请求的 Body 中，以解决 "414 URI Too Large" 的问题。
 */
export async function onRequestPost(context) {
  try {
    // 1. 从环境变量安全获取 API Token
    const apiToken = context.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      return new Response(JSON.stringify({ error: 'API token not configured on the server.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. 解析前端发来的 JSON 数据
    const requestData = await context.request.json();
    
    // 3. 基础参数验证
    const { prompt, width, height } = requestData;
    if (!prompt || !width || !height) {
      return new Response(JSON.stringify({ error: 'Missing required parameters.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // [关键修改 1]: 构建要 POST 给 Pollinations.ai 的 JSON payload
    // 不再使用 URLSearchParams，而是创建一个包含所有参数的对象
    const payload = {
      prompt: requestData.prompt,
      width: requestData.width,
      height: requestData.height,
      seed: requestData.seed || Math.floor(Math.random() * 1000000),
      nologo: true,
      safe: false,
    };

    // 智能判断并添加特定模式的参数
    if (requestData.image) {
      // 模式 A: 图生图 或 扩图
      payload.model = requestData.model || 'kontext';
      payload.image = requestData.image; // 图片的 Data URI
      payload.strength = requestData.strength || 0.7;
      if (requestData.negative_prompt) {
        payload.negative_prompt = requestData.negative_prompt;
      }
    } else {
      // 模式 B: 文生图
      payload.model = requestData.model || 'flux';
      if (requestData.style) {
        payload.style = requestData.style;
      }
      if (requestData.enhance) {
        payload.enhance = true;
      }
    }

    // [关键修改 2]: API URL 简化
    // Pollinations.ai 接收 POST 请求的地址就是 /prompt
    const apiUrl = `https://image.pollinations.ai/prompt`;

    // [关键修改 3]: 将请求从 GET 变为 POST
    const apiRequest = new Request(apiUrl, {
      method: 'POST', // 使用 POST 方法
      headers: {
        'Content-Type': 'application/json', // 声明 Body 是 JSON 格式
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify(payload) // 将所有参数作为 JSON 字符串放入 Body
    });

    const aiResponse = await fetch(apiRequest);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      return new Response(JSON.stringify({ error: `AI API Error: ${errorText}` }), { status: aiResponse.status, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(aiResponse.body, { status: 200, headers: { 'Content-Type': aiResponse.headers.get('Content-Type') || 'image/png' } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}