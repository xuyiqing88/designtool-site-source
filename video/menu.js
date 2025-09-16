
// 创建并注入菜单样式
const menuStyles = document.createElement('style');
menuStyles.textContent = `
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
    min-height: 100vh;
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
    z-index: 1001;
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
	display: flex;
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

/* 遮罩层样式 */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 999;
    display: none;
}

@media (max-width: 768px) {
    #global-sidebar.expanded ~ .sidebar-overlay {
        display: block;
    }
}

/* 移动端菜单开关 */
.menu-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1000;
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
    display: none;
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
        display: flex;
	top: 10px;
        left: 10px;
    }
}
`;
document.head.appendChild(menuStyles);

// 创建并注入Font Awesome
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesomeLink);

// 菜单数据结构
const menuData = [
    {
        title: "首页",
        icon: "fa-solid fa-house-chimney",
        link: "../index.html",
        active: true
    },
    {
        title: "轻易设计",
        icon: "fa-solid fa-compass-drafting",
        submenu: [
            { title: "AI生成UI界面", link: "../AI-UI.html" },
            { title: "图片对比工具", link: "../diff.html" },
            { title: "图片压缩工具", link: "../comp.html" },
            { title: "UI设计数据生成器", link: "../data.html"},
            { title: "在线PS", link: "../PS.html" },
            { title: "矢量花朵生成器", link: "../flower.html" },
            { title: "城市天际线生成器", link: "../city.html" },
            { title: "Adobe 全家桶下载", link: "../adobe.html" },
        ]
    },

    {
        title: "轻易AI",
        icon: "fa-solid fa-microchip",
        submenu: [
            { title: "AI高清放大", link: "scale.html" },
            { title: "AI一键抠图", link: "rembg.html" },
	        { title: "AI绘画", link: "../draw.html" },
	        { title: "AI数字人（免费版）", link: "../freeAI.html" },
	        { title: "AI数字人（API版）", link: "../AI.html" },
            { title: "lora训练数据集编辑", link: "../model.html" },
            { title: "AI画风提示词大全", link: "../SDXL.html" },
        ]
    },
    {
        title: "轻易3D",
        icon: "fa-brands fa-codepen",
        submenu: [
            { title: "HDR编辑器", link: "../hdr.html" },
            { title: "PBR贴图生成", link: "../normal.html" },
            { title: "无缝贴图制作", link: "../texture.html" },
            { title: "AI生成无缝贴图", link: "../aimap.html" },
            { title: "无缝贴图预览", link: "../map.html" },
            { title: "ORM贴图合成与拆解", link: "../ORM.html" },
            { title: "C4D地板预设下载", link: "../floor.html" },
            { title: "C4D测量工具下载", link: "../c4drule.html" },
            { title: "C4D编织预设下载", link: "../weaving.html" },

        ]
    },
    {
        title: "轻易转换",
        icon: "fa-solid fa-camera-rotate",
        submenu: [
            { title: "音视频格式转换", link: "mp4mp3.html" },
            { title: "图片格式转换", link: "../conver.html" },
	    { title: "线性颜色转换", link: "../color.html" },
            { title: "BASE64图片转换器", link: "../BASE64.html" },
        ]
    },
    {
        title: "轻易实用",
        icon: "fa-solid fa-swatchbook",
        submenu: [
            { title: "青艺云广播", link: "../radio.html" },
            { title: "在线视频剪辑", link: "../opencut.html" },
            { title: "在线ikun小游戏", link: "../jntm.html" },
            { title: "朋友圈九宫格制作", link: "../9img.html" },
            { title: "高级翻译工具", link: "../translation.html" },
        ]
    },

];

// 创建移动端菜单开关
const menuToggle = document.createElement('div');
menuToggle.className = 'menu-toggle';
menuToggle.id = 'menuToggle';
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.body.appendChild(menuToggle);

// 初始化菜单
function initMenu() {
    const sidebar = document.getElementById('global-sidebar');
    const currentPage = window.location.pathname.split('/').pop();
    
    // 创建遮罩层 - 移动到菜单初始化之后
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // 创建菜单结构
    let menuHTML = `
        <div class="sidebar-header">
            <div class="logo-icon">
                <img src="../img/gongjuxiang.svg" alt="logo" style="width: 30px;">
            </div>
            <div class="logo-text">青艺设计</div>
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
    const menuToggleBtn = document.getElementById('menuToggle');
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('expanded');
        });
    }
    
    // 遮罩层点击事件
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('expanded');
    });
    
    // 全局点击事件（移动端点击外部关闭菜单）
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('expanded') &&
            !sidebar.contains(e.target) &&
            e.target !== menuToggleBtn) {
            sidebar.classList.remove('expanded');
        }
    });
    
    // 窗口大小变化时重置菜单
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('expanded');
        }
    });

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
document.addEventListener('DOMContentLoaded', function() {
    // 确保菜单容器存在
    if (!document.getElementById('global-sidebar')) {
        const sidebar = document.createElement('div');
        sidebar.id = 'global-sidebar';
        document.body.insertBefore(sidebar, document.body.firstChild);
    }
    
    initMenu();
});