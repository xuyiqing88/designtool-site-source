// /_worker.js

// 引入 onnxruntime-web 库，即使在worker里，我们也需要它来运行模型
// Cloudflare Workers 支持这种从 CDN 导入的方式
import * as ort from 'onnxruntime-web';

// 设置 WASM 文件的路径，这是 ONNX Runtime 运行需要的核心文件
// ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/'; // <--- 删除或注释掉这一行

// 在全局作用域缓存模型会话，避免每次请求都重新加载模型
let session;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 关键：我们定义一个新的API路径 /api/remove-background
    // 专门用来处理抠图请求
    if (url.pathname === '/api/remove-background' && request.method === 'POST') {
      try {
        // 1. 加载模型 (如果还没加载的话)
        if (!session) {
          console.log("正在从R2加载 u2net.onnx 模型...");
          // 从R2存储桶中获取大的、完整的模型文件
          const modelObject = await env.MY_MODEL_BUCKET.get('u2net.onnx');
          if (modelObject === null) {
            return new Response('模型文件 u2net.onnx 未在R2中找到', { status: 404 });
          }
          const modelBuffer = await modelObject.arrayBuffer();
          console.log("模型加载成功，正在创建AI会话...");
          session = await ort.InferenceSession.create(modelBuffer);
          console.log("AI会话创建成功!");
        }

        // 2. 运行模型
        const { input, dims } = await request.json(); // 从请求中获取浏览器处理好的图片数据
        const inputTensor = new ort.Tensor('float32', Float32Array.from(Object.values(input)), dims);
        const feeds = { [session.inputNames[0]]: inputTensor };
        const results = await session.run(feeds);
        const outputData = results[session.outputNames[0]].data;

        // 3. 返回处理结果
        return new Response(JSON.stringify({ mask: Array.from(outputData) }), {
          headers: { 'Content-Type': 'application/json' },
        });

      } catch (e) {
        console.error("Worker处理出错:", e);
        return new Response('Worker在处理图片时发生错误: ' + e.message, { status: 500 });
      }
    }

    // 对于所有其他请求 (访问网页、图片等)，还是交给Cloudflare Pages处理
    return env.ASSETS.fetch(request);
  },
};