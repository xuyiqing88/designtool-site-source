<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>全局侧边菜单演示</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        }
        
        :root {
            --sidebar-width: 60px;
            --sidebar-expanded-width: 240px;
            --sidebar-bg: #1e1e2d;
            --sidebar-icon-color: #8c8ea4;
            --sidebar-hover-bg: #2a2a3c;
            --sidebar-active-bg: #3699ff;
            --sidebar-active-icon: #ffffff;
            --sidebar-text: #a2a3b7;
            --sidebar-hover-text: #ffffff;
            --sidebar-divider: #2d2d40;
            --transition-speed: 0.3s;
        }
        
        body {
            background: #f5f7fa;
            min-height: 100vh;
            display: flex;
            transition: margin-left var(--transition-speed);
        }
        
        /* 侧边菜单样式 */
        #global-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: var(--sidebar-width);
            background: var(--sidebar-bg);
            overflow-x: hidden;
            transition: width var(--transition-speed);
            z-index: 1000;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }
        
        #global-sidebar:hover {
            width: var(--sidebar-expanded-width);
        }
        
        #global-sidebar.expanded {
            width: var(--sidebar-expanded-width);
        }
        
        .sidebar-header {
            padding: 20px 15px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid var(--sidebar-divider);
        }
        
        .logo-icon {
            min-width: 30px;
            text-align: center;
            font-size: 24px;
            color: var(--sidebar-active-icon);
            margin-right: 15px;
        }
        
        .logo-text {
            color: white;
            font-weight: 600;
            font-size: 18px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        #global-sidebar:hover .logo-text,
        #global-sidebar.expanded .logo-text {
            opacity: 1;
        }
        
        .sidebar-menu {
            list-style: none;
            padding: 20px 0;
        }
        
        .menu-item {
            position: relative;
        }
        
        .menu-link {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            color: var(--sidebar-text);
            text-decoration: none;
            transition: all 0.2s;
            white-space: nowrap;
        }
        
        .menu-link:hover {
            background: var(--sidebar-hover-bg);
            color: var(--sidebar-hover-text);
        }
        
        .menu-link.active {
            background: var(--sidebar-active-bg);
            color: var(--sidebar-active-icon);
        }
        
        .menu-icon {
            min-width: 30px;
            text-align: center;
            font-size: 18px;
            margin-right: 15px;
            transition: transform 0.2s;
        }
        
        .menu-text {
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        #global-sidebar:hover .menu-text,
        #global-sidebar.expanded .menu-text {
            opacity: 1;
        }
        
        .menu-arrow {
            margin-left: auto;
            font-size: 12px;
            transition: transform 0.3s;
        }
        
        .menu-item.active > .menu-link > .menu-arrow {
            transform: rotate(90deg);
        }
        
        .submenu {
            list-style: none;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .menu-item.active > .submenu {
            max-height: 500px;
        }
        
        .submenu-item {
            padding-left: 45px;
        }
        
        .submenu-link {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            color: var(--sidebar-text);
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s;
            white-space: nowrap;
        }
        
        .submenu-link:hover {
            color: var(--sidebar-hover-text);
        }
        
        .submenu-link.active {
            color: var(--sidebar-active-icon);
            font-weight: 500;
        }
        
        .submenu-icon {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--sidebar-text);
            margin-right: 10px;
            transition: background 0.2s;
        }
        
        .submenu-link:hover .submenu-icon {
            background: var(--sidebar-hover-text);
        }
        
        .submenu-link.active .submenu-icon {
            background: var(--sidebar-active-icon);
        }
        
        .submenu-text {
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        #global-sidebar:hover .submenu-text,
        #global-sidebar.expanded .submenu-text {
            opacity: 1;
        }
        
        .content {
            flex: 1;
            padding: 30px;
            margin-left: var(--sidebar-width);
            transition: margin-left var(--transition-speed);
        }
        
        #global-sidebar:hover ~ .content,
        #global-sidebar.expanded ~ .content {
            margin-left: var(--sidebar-expanded-width);
        }
        
        .page-title {
            font-size: 28px;
            color: #2d3748;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-img {
            height: 180px;
            background: linear-gradient(45deg, #6a11cb, #2575fc);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
        }
        
        .card-content {
            padding: 20px;
        }
        
        .card-title {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 10px;
        }
        
        .card-desc {
            color: #718096;
            font-size: 14px;
            line-height: 1.6;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            #global-sidebar {
                width: 0;
            }
            
            #global-sidebar.expanded {
                width: var(--sidebar-expanded-width);
            }
            
            #global-sidebar:hover {
                width: var(--sidebar-expanded-width);
            }
            
            .content {
                margin-left: 0;
            }
            
            #global-sidebar.expanded ~ .content,
            #global-sidebar:hover ~ .content {
                margin-left: var(--sidebar-expanded-width);
            }
            
            .menu-toggle {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 999;
                background: var(--sidebar-bg);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }
        }
    </style>
</head>
<body>
    <!-- 移动端菜单开关 -->
    <div class="menu-toggle" id="menuToggle">
        <i class="fas fa-bars"></i>
    </div>
    
    <!-- 全局侧边菜单容器 -->
    <div id="global-sidebar">
        <!-- 菜单内容将通过JS动态生成 -->
    </div>
    
    <!-- 页面内容 -->
    <div class="content">
        <h1 class="page-title">UI设计数据生成器</h1>
        <p>快速生成各类测试数据，用于表单填充和UI设计验证</p>
        
        <div class="card-grid">
            <div class="card">
                <div class="card-img">
                    <i class="fas fa-user"></i>
                </div>
                <div class="card-content">
                    <h3 class="card-title">用户信息生成</h3>
                    <p class="card-desc">生成随机用户信息，包括姓名、邮箱、电话号码、地址等，用于测试用户表单。</p>
                </div>
            </div>
            
            <div class="card">
                <div class="card-img">
                    <i class="fas fa-credit-card"></i>
                </div>
                <div class="card-content">
                    <h3 class="card-title">支付信息生成</h3>
                    <p class="card-desc">生成信用卡号、有效期、CVV等支付信息，用于测试支付流程。</p>
                </div>
            </div>
            
            <div class="card">
                <div class="card-img">
                    <i class="fas fa-building"></i>
                </div>
                <div class="card-content">
                    <h3 class="card-title">公司数据生成</h3>
                    <p class="card-desc">生成公司名称、地址、行业类型等数据，用于企业应用测试。</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 菜单数据结构
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
        function initMenu() {
            const sidebar = document.getElementById('global-sidebar');
            const currentPage = window.location.pathname.split('/').pop();
            
            // 创建菜单结构
            let menuHTML = `
                <div class="sidebar-header">
                    <div class="logo-icon">
                        <i class="fas fa-toolbox"></i>
                    </div>
                    <div class="logo-text">设计工具集</div>
                </div>
                <ul class="sidebar-menu">`;
            
            menuData.forEach(item => {
                const isActive = item.submenu 
                    ? item.submenu.some(sub => sub.link === currentPage)
                    : (item.link === currentPage);
                
                menuHTML += `
                    <li class="menu-item ${isActive ? 'active' : ''}">
                        <a href="${item.link || '#'}" class="menu-link ${!item.submenu && item.link === currentPage ? 'active' : ''}">
                            <div class="menu-icon">
                                <i class="${item.icon}"></i>
                            </div>
                            <div class="menu-text">${item.title}</div>
                            ${item.submenu ? '<div class="menu-arrow"><i class="fas fa-chevron-right"></i></div>' : ''}
                        </a>`;
                
                if (item.submenu) {
                    menuHTML += `<ul class="submenu">`;
                    item.submenu.forEach(subItem => {
                        const isSubActive = subItem.link === currentPage;
                        menuHTML += `
                            <li class="submenu-item">
                                <a href="${subItem.link}" class="submenu-link ${isSubActive ? 'active' : ''}">
                                    <div class="submenu-icon"></div>
                                    <div class="submenu-text">${subItem.title}</div>
                                </a>
                            </li>`;
                    });
                    menuHTML += `</ul>`;
                }
                
                menuHTML += `</li>`;
            });
            
            menuHTML += `</ul>`;
            sidebar.innerHTML = menuHTML;
            
            // 添加事件监听
            document.querySelectorAll('.menu-item > .menu-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    if (this.parentElement.classList.contains('menu-item') && this.nextElementSibling) {
                        e.preventDefault();
                        const parent = this.parentElement;
                        const wasActive = parent.classList.contains('active');
                        
                        // 关闭所有菜单项
                        document.querySelectorAll('.menu-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        
                        // 切换当前项
                        if (!wasActive) {
                            parent.classList.add('active');
                        }
                    }
                });
            });
            
            // 移动端菜单切换
            const menuToggle = document.getElementById('menuToggle');
            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('expanded');
                });
            }
            
            // 检查存储的菜单状态
            const menuState = localStorage.getItem('menuState');
            if (menuState === 'expanded') {
                sidebar.classList.add('expanded');
            }
            
            // 存储菜单状态
            sidebar.addEventListener('mouseenter', function() {
                localStorage.setItem('menuState', 'expanded');
            });
            
            sidebar.addEventListener('mouseleave', function() {
                if (window.innerWidth > 768) {
                    localStorage.setItem('menuState', 'collapsed');
                    this.classList.remove('expanded');
                }
            });
        }
        
        // 页面加载时初始化菜单
        document.addEventListener('DOMContentLoaded', initMenu);
    </script>
</body>
</html>