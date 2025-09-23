// /_worker.js (带有调试日志的版本)

import * as ort from 'onnxruntime-web';

// 删除或注释掉这行，因为它在worker中不需要
// ort.env.wasm.wasmPaths = '...';

let session;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/remove-background' && request.method === 'POST') {
      try {
        console.log("[1] 收到抠图请求...");

        if (!session) {
          console.log("[2] AI会话未缓存，准备从R2加载模型...");
          const modelObject = await env.MY_MODEL_BUCKET.get('u2netp.onnx'); // 确认是小模型
          if (modelObject === null) {
            console.error("错误：在R2中未找到 u2netp.onnx");
            return new Response('模型文件 u2netp.onnx 未在R2中找到', { status: 404 });
          }
          const modelBuffer = await modelObject.arrayBuffer();
          console.log(`[3] 模型加载成功 (大小: ${(modelBuffer.byteLength / 1024 / 1024).toFixed(2)} MB)，准备创建AI会话...`);
          
          session = await ort.InferenceSession.create(modelBuffer);
          console.log("[4] AI会话创建成功!");
        } else {
          console.log("[1a] 使用已缓存的AI会话。");
        }

        const { input, dims } = await request.json();
        const inputTensor = new ort.Tensor('float32', Float32Array.from(Object.values(input)), dims);
        const feeds = { [session.inputNames[0]]: inputTensor };
        
        console.log("[5] 准备运行模型 (这是最消耗计算资源的一步)...");
        const results = await session.run(feeds);
        console.log("[6] 模型运行成功！");

        const outputData = results[session.outputNames[0]].data;
        
        console.log("[7] 准备返回处理结果...");
        return new Response(JSON.stringify({ mask: Array.from(outputData) }), {
          headers: { 'Content-Type': 'application/json' },
        });

      } catch (e) {
        console.error("Worker处理出错 (Caught Exception):", e);
        return new Response('Worker在处理图片时发生错误: ' + e.message, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};