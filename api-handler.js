// 文件: api-handler.js

/**
 * 将服务器返回的图片数据(Blob)转换为可以在网页上显示的格式(Data URL)。
 * @param {Blob} blob - 图片的 Blob 数据。
 * @returns {Promise<string>} - 返回一个 Data URL 字符串。
 */
function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * 这是前端唯一的 API 调用函数。
 * 它负责将生成图片所需的所有参数打包，通过 POST 请求发送到我们自己的安全后端代理。
 * @param {object} params - 包含生成图像所需参数的对象 (例如: prompt, width, height, model等)。
 * @returns {Promise<string>} - 成功时，返回一个解析为图像 Data URL 的 Promise。
 */
async function generateImageViaProxy(params) {
    // 这个是我们要调用的后端函数的地址
    const proxyUrl = '/api/draw';

    // 发起网络请求到我们的后端
    const response = await fetch(proxyUrl, {
        method: 'POST', // 使用 POST 方法来发送复杂的参数
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params), // 将所有参数打包成 JSON 字符串发送
    });

    // 如果后端返回错误（比如Token没配置对），则解析错误信息并抛出异常
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `请求失败，状态码: ${response.status}`);
    }

    // 如果成功，后端会返回图片数据
    const blob = await response.blob();
    if (blob.size < 1000) { // 简单的验证，防止返回空图片
        throw new Error("API 返回了无效或空的图像数据");
    }

    // 将图片数据转换为可以在<img>标签中显示的格式
    return await blobToDataURL(blob);
}