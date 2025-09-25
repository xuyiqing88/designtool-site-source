// 等待整个网页的DOM结构加载完成后再执行
document.addEventListener("DOMContentLoaded", function() {
    
    // 找到占位符元素
    const footerContainer = document.getElementById('footer-container');
    
    // 只有在页面上存在这个占位符时才去加载
    if (footerContainer) {
        // 使用 fetch API 获取 footer.html 的内容
        fetch('footer.html')
            .then(response => {
                // 检查请求是否成功
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Network response was not ok.');
            })
            .then(html => {
                // 将获取到的HTML内容插入到占位符中
                footerContainer.innerHTML = html;
            })
            .catch(error => {
                // 如果加载失败，在控制台打印错误信息，方便排查问题
                console.error('加载底部信息失败:', error);
                footerContainer.innerHTML = '<p style="text-align:center;">页脚加载失败。</p>';
            });
    }

});