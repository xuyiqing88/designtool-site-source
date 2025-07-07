        const menuData = [
            {
                title: "首页",
                icon: "fas fa-home",
                link: "index.html",
                active: true
            },
            {
                title: "3D工具",
                icon: "fas fa-cube",
                submenu: [
                    { title: "模型数据集编辑器", link: "模型数据集编辑器.html" },
                    { title: "无缝贴图预览工具", link: "无缝贴图预览工具.html" },
                    { title: "高级法线图转换器", link: "高级法线图转换器.html" },
                    { title: "ORM贴图生成工具", link: "ORM贴图生成工具.html" }
                ]
            },
            {
                title: "AI工具",
                icon: "fas fa-robot",
                submenu: [
                    { title: "提示词风格大全", link: "SDXL.html" },
                    { title: "AI图像生成器", link: "AI图像生成器.html" },
                    { title: "智能文案助手", link: "智能文案助手.html" },
                    { title: "数据增强工具", link: "数据增强工具.html" }
                ]
            },
            {
                title: "设计工具",
                icon: "fas fa-paint-brush",
                submenu: [
                    { title: "UI设计数据生成器", link: "数据模拟.html", active: true },
                    { title: "现代化城市生成器", link: "city_building.html" },
                    { title: "颜色转换工具", link: "颜色转换工具.html" },
                    { title: "在线版Photoshop", link: "PS.html" },
                    { title: "图标生成器", link: "图标生成器.html" }
                ]
            },
            {
                title: "实用工具",
                icon: "fas fa-wrench",
                submenu: [
                    { title: "BASE64图片转换器", link: "BASE64图片转换器.html" },
                    { title: "本地翻译工具", link: "本地翻译工具.html" },
                    { title: "代码格式化", link: "代码格式化.html" },
                    { title: "JSON可视化", link: "JSON可视化.html" }
                ]
            }
        ];
        
        // 初始化菜单
// menu.js
function initMenu() {
  const menuContainer = document.getElementById('menu-container');
  
  // 创建菜单结构
  menuContainer.innerHTML = `
    <div id="global-sidebar">
      <div class="sidebar-header">...</div>
      <ul class="sidebar-menu">...</ul>
    </div>
  `;
  
  // 添加事件监听器
  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', handleMenuClick);
  });
  
  // 移动端切换按钮
  const menuToggle = document.createElement('div');
  menuToggle.id = 'menuToggle';
  menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  document.body.appendChild(menuToggle);
  
  menuToggle.addEventListener('click', () => {
    document.getElementById('global-sidebar').classList.toggle('expanded');
  });
}

document.addEventListener('DOMContentLoaded', initMenu);