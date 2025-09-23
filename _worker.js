export default {
  async fetch(request, env, ctx) {
    // env.MY_MODEL_BUCKET 就是你在 toml 文件里绑定的 R2 仓库
    // 'u2netp.onnx' 是你在R2里存储的文件名
    const object = await env.MY_MODEL_BUCKET.get('u2netp.onnx');

    if (object === null) {
      return new Response('模型文件未在R2中找到', { status: 404 });
    }

    // 这里只是简单地返回一个成功信息
    // 实际上你会在这里把 object 的内容传递给你的AI库
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    console.log("成功从R2加载模型！");

    // 你可以根据需要修改这里的返回内容
    // 比如，你可能希望它继续处理静态网站的请求
    // return env.ASSETS.fetch(request); // 如果是纯静态网站+函数模式
    return new Response("Worker成功启动并能访问R2模型！");
  },
};