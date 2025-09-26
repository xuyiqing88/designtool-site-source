    document.addEventListener('DOMContentLoaded', function() {
        // 使用 fetch API 加载通用模块
        fetch('related-articles.html')
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('网络响应错误。');
            })
            .then(html => {
                // 将加载的 HTML 内容注入到占位符中
                document.getElementById('related-articles-placeholder').innerHTML = html;
            })
            .catch(error => {
                console.error('加载相关文章模块失败:', error);
                // 可以在这里处理错误，例如隐藏占位符
                document.getElementById('related-articles-placeholder').style.display = 'none';
            });
    });