
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
    margin-right: 15px;
    transition: transform 0.2s;
}
/* 在下方添加这段新的CSS */
.menu-icon svg {
    width: 18px;
    height: 18px;
    fill: currentColor; /* 关键！让SVG颜色继承父元素的color属性 */
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

/* 在下方添加这段新的CSS */
.menu-arrow svg {
    width: 12px;
    height: 12px;
    fill: currentColor; /* 同样让箭头颜色可变 */
    transition: transform 0.3s; /* 将旋转动画移到SVG上效果更平滑 */
}

/* 同时，可以把原先的 transform 移到这里 */
.menu-item.active > .menu-link > .menu-arrow svg {
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
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: none;
    fill: currentColor;
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
        padding: 6px;
    }
}
`;
document.head.appendChild(menuStyles);
// 在这里新增以下代码
const svgSpriteHTML = `
<svg width="0" height="0" class="hidden">
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="arrow-up-solid-full">
    <path d="M342.6 81.4C330.1 68.9 309.8 68.9 297.3 81.4L137.3 241.4C124.8 253.9 124.8 274.2 137.3 286.7C149.8 299.2 170.1 299.2 182.6 286.7L288 181.3L288 552C288 569.7 302.3 584 320 584C337.7 584 352 569.7 352 552L352 181.3L457.4 286.7C469.9 299.2 490.2 299.2 502.7 286.7C515.2 274.2 515.2 253.9 502.7 241.4L342.7 81.4z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="bars-solid-full">
    <path d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="camera-rotate-solid-full">
    <path d="M202.7 160L213.1 128.8C219.6 109.2 237.9 96 258.6 96L381.4 96C402.1 96 420.4 109.2 426.9 128.8L437.3 160L512 160C547.3 160 576 188.7 576 224L576 480C576 515.3 547.3 544 512 544L128 544C92.7 544 64 515.3 64 480L64 224C64 188.7 92.7 160 128 160L202.7 160zM160 369.9C160 373.8 161.4 377.6 164 380.5L212 434.5C218.4 441.7 229.6 441.7 235.9 434.5L283.9 380.5C286.5 377.6 287.9 373.8 287.9 369.9L287.9 368C287.9 359.2 280.7 352 271.9 352L247.9 352C247.9 312.2 280.1 280 319.9 280C324.3 280 328.6 280.4 332.8 281.2L367.7 241.9C353.1 235.5 336.9 232 319.9 232C253.6 232 199.9 285.7 199.9 352L175.9 352C167.1 352 159.9 359.2 159.9 368L159.9 369.9zM356 323.4C353.4 326.3 352 330.1 352 334L352 335.9C352 344.7 359.2 351.9 368 351.9L392 351.9C392 391.7 359.8 423.9 320 423.9C315.6 423.9 311.3 423.5 307.1 422.7L272.2 462C286.9 468.4 303 471.9 320 471.9C386.3 471.9 440 418.2 440 351.9L464 351.9C472.8 351.9 480 344.7 480 335.9L480 334C480 330.1 478.6 326.3 476 323.4L428 269.4C421.6 262.2 410.4 262.2 404.1 269.4L356.1 323.4z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="chart-bar-solid-full">
    <path d="M96 96C113.7 96 128 110.3 128 128L128 464C128 472.8 135.2 480 144 480L544 480C561.7 480 576 494.3 576 512C576 529.7 561.7 544 544 544L144 544C99.8 544 64 508.2 64 464L64 128C64 110.3 78.3 96 96 96zM192 160C192 142.3 206.3 128 224 128L416 128C433.7 128 448 142.3 448 160C448 177.7 433.7 192 416 192L224 192C206.3 192 192 177.7 192 160zM224 240L352 240C369.7 240 384 254.3 384 272C384 289.7 369.7 304 352 304L224 304C206.3 304 192 289.7 192 272C192 254.3 206.3 240 224 240zM224 352L480 352C497.7 352 512 366.3 512 384C512 401.7 497.7 416 480 416L224 416C206.3 416 192 401.7 192 384C192 366.3 206.3 352 224 352z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="chevron-right-solid-full">
    <path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="codepen-brands-solid-full">
    <path d="M566.3 223.7L332.3 67.7C324.3 62.8 315.8 62.7 307.7 67.7L73.7 223.7C67.7 227.7 64 234.8 64 242L64 398C64 405.1 67.7 412.3 73.7 416.3L307.7 572.3C315.7 577.2 324.2 577.3 332.3 572.3L566.3 416.3C572.3 412.3 576 405.2 576 398L576 242C576 234.9 572.3 227.7 566.3 223.7zM342 127.1L514.3 242L437.4 293.4L342 229.7L342 127.1zM298 127.1L298 229.7L202.6 293.4L125.7 242L298 127.1zM108 283.1L163.1 320L108 356.8L108 283.1zM298 512.8L125.7 398L202.6 346.6L298 410.3L298 512.8zM320 372L242.3 320L320 268L397.7 320L320 372zM342 512.9L342 410.3L437.4 346.6L514.3 398L342 512.9zM532 356.9L476.9 320L532 283.1L532 356.8z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="compass-drafting-solid-full">
    <path d="M163.3 320.1L232.7 200.2C227.1 188 223.9 174.4 223.9 160C223.9 107 266.9 64 319.9 64C372.9 64 415.9 107 415.9 160C415.9 174.3 412.8 187.9 407.1 200.2L451.5 276.9C428.4 302.9 397.8 322 363.1 330.7L320 255.9L251.9 373.5C273.4 380.3 296.2 384 320 384C390.7 384 453.8 351.3 494.9 300C506 286.2 526.1 284 539.9 295C553.7 306 555.9 326.2 544.9 340C492.2 405.8 411 448 320.1 448C284.7 448 250.7 441.6 219.4 429.9L162.7 527.7C158 535.8 151 542.4 142.6 546.6L87.2 574.3C82.2 576.8 76.3 576.5 71.6 573.6C66.9 570.7 64 565.5 64 560L64 504.6C64 496.2 66.2 487.9 70.5 480.5L130.5 376.8C117.7 365.6 105.9 353.3 95.2 340C84.1 326.2 86.4 306.1 100.2 295C114 283.9 134.1 286.2 145.2 300C150.9 307.1 157 313.8 163.4 320.1zM445.1 471.9C477.6 458.9 507.5 440.9 534 419L569.6 480.5C573.8 487.8 576.1 496.1 576.1 504.6L576.1 560C576.1 565.5 573.2 570.7 568.5 573.6C563.8 576.5 557.9 576.8 552.9 574.3L497.5 546.6C489.1 542.4 482.1 535.8 477.4 527.7L445.1 471.9zM320 192C337.7 192 352 177.7 352 160C352 142.3 337.7 128 320 128C302.3 128 288 142.3 288 160C288 177.7 302.3 192 320 192z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="glasses-solid-full">
    <path d="M175.3 160C161.3 160 148.8 169.2 144.7 182.6L102.4 320L256 320C273.7 320 288 334.3 288 352L352 352C352 334.3 366.3 320 384 320L537.6 320L495.3 182.6C491.2 169.2 478.8 160 464.7 160L432 160C414.3 160 400 145.7 400 128C400 110.3 414.3 96 432 96L464.7 96C506.8 96 544.1 123.5 556.5 163.8L601.9 311.3C606 324.5 608 338.2 608 352L608 448C608 501 565 544 512 544L448 544C395 544 352 501 352 448L352 416L288 416L288 448C288 501 245 544 192 544L128 544C75 544 32 501 32 448L32 352C32 338.2 34.1 324.5 38.1 311.3L83.5 163.8C95.9 123.5 133.1 96 175.3 96L208 96C225.7 96 240 110.3 240 128C240 145.7 225.7 160 208 160L175.3 160zM96 384L96 448C96 465.7 110.3 480 128 480L192 480C209.7 480 224 465.7 224 448L224 384L96 384zM512 480C529.7 480 544 465.7 544 448L544 384L416 384L416 448C416 465.7 430.3 480 448 480L512 480z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="house-chimney-solid-full">
    <path d="M298.2 72.6C310.5 61.2 329.5 61.2 341.7 72.6L432 156.3L432 144C432 126.3 446.3 112 464 112L496 112C513.7 112 528 126.3 528 144L528 245.5L565.8 280.6C575.4 289.6 578.6 303.5 573.8 315.7C569 327.9 557.2 336 544 336L528 336L528 512C528 547.3 499.3 576 464 576L176 576C140.7 576 112 547.3 112 512L112 336L96 336C82.8 336 71 327.9 66.2 315.7C61.4 303.5 64.6 289.5 74.2 280.6L298.2 72.6zM304 384C277.5 384 256 405.5 256 432L256 528L384 528L384 432C384 405.5 362.5 384 336 384L304 384z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="location-arrow-solid-full">
    <path d="M541.9 139.5C546.4 127.7 543.6 114.3 534.7 105.4C525.8 96.5 512.4 93.6 500.6 98.2L84.6 258.2C71.9 263 63.7 275.2 64 288.7C64.3 302.2 73.1 314.1 85.9 318.3L262.7 377.2L321.6 554C325.9 566.8 337.7 575.6 351.2 575.9C364.7 576.2 376.9 568 381.8 555.4L541.8 139.4z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="magnifying-glass-solid-full">
    <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="microchip-solid-full">
    <path d="M240 88C240 74.7 229.3 64 216 64C202.7 64 192 74.7 192 88L192 128C156.7 128 128 156.7 128 192L88 192C74.7 192 64 202.7 64 216C64 229.3 74.7 240 88 240L128 240L128 296L88 296C74.7 296 64 306.7 64 320C64 333.3 74.7 344 88 344L128 344L128 400L88 400C74.7 400 64 410.7 64 424C64 437.3 74.7 448 88 448L128 448C128 483.3 156.7 512 192 512L192 552C192 565.3 202.7 576 216 576C229.3 576 240 565.3 240 552L240 512L296 512L296 552C296 565.3 306.7 576 320 576C333.3 576 344 565.3 344 552L344 512L400 512L400 552C400 565.3 410.7 576 424 576C437.3 576 448 565.3 448 552L448 512C483.3 512 512 483.3 512 448L552 448C565.3 448 576 437.3 576 424C576 410.7 565.3 400 552 400L512 400L512 344L552 344C565.3 344 576 333.3 576 320C576 306.7 565.3 296 552 296L512 296L512 240L552 240C565.3 240 576 229.3 576 216C576 202.7 565.3 192 552 192L512 192C512 156.7 483.3 128 448 128L448 88C448 74.7 437.3 64 424 64C410.7 64 400 74.7 400 88L400 128L344 128L344 88C344 74.7 333.3 64 320 64C306.7 64 296 74.7 296 88L296 128L240 128L240 88zM224 192L416 192C433.7 192 448 206.3 448 224L448 416C448 433.7 433.7 448 416 448L224 448C206.3 448 192 433.7 192 416L192 224C192 206.3 206.3 192 224 192zM240 240L240 400L400 400L400 240L240 240z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="swatchbook-solid-full">
    <path d="M64 112C64 85.5 85.5 64 112 64L208 64C234.5 64 256 85.5 256 112L256 480C256 533 213 576 160 576C107 576 64 533 64 480L64 112zM304 473.6L304 202.1L352.1 154C370.8 135.3 401.2 135.3 420 154L487.9 221.9C506.6 240.6 506.6 271 487.9 289.8L304 473.6zM269.5 576L461.5 384L528.1 384C554.6 384 576.1 405.5 576.1 432L576.1 528C576.1 554.5 554.6 576 528.1 576L269.6 576zM144 128C135.2 128 128 135.2 128 144L128 176C128 184.8 135.2 192 144 192L176 192C184.8 192 192 184.8 192 176L192 144C192 135.2 184.8 128 176 128L144 128zM128 272L128 304C128 312.8 135.2 320 144 320L176 320C184.8 320 192 312.8 192 304L192 272C192 263.2 184.8 256 176 256L144 256C135.2 256 128 263.2 128 272zM160 504C173.3 504 184 493.3 184 480C184 466.7 173.3 456 160 456C146.7 456 136 466.7 136 480C136 493.3 146.7 504 160 504z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" id="up-right-from-square-solid-full">
    <path d="M354.4 83.8C359.4 71.8 371.1 64 384 64L544 64C561.7 64 576 78.3 576 96L576 256C576 268.9 568.2 280.6 556.2 285.6C544.2 290.6 530.5 287.8 521.3 278.7L464 221.3L310.6 374.6C298.1 387.1 277.8 387.1 265.3 374.6C252.8 362.1 252.8 341.8 265.3 329.3L418.7 176L361.4 118.6C352.2 109.4 349.5 95.7 354.5 83.7zM64 240C64 195.8 99.8 160 144 160L224 160C241.7 160 256 174.3 256 192C256 209.7 241.7 224 224 224L144 224C135.2 224 128 231.2 128 240L128 496C128 504.8 135.2 512 144 512L400 512C408.8 512 416 504.8 416 496L416 416C416 398.3 430.3 384 448 384C465.7 384 480 398.3 480 416L480 496C480 540.2 444.2 576 400 576L144 576C99.8 576 64 540.2 64 496L64 240z"></path>
  </symbol>
</svg>
`;

// 创建一个临时的div容器来承载SVG字符串
const svgContainer = document.createElement('div');
svgContainer.innerHTML = svgSpriteHTML.trim();
// 将容器中的SVG元素本身（而不是div容器）添加到body的开头
document.body.insertBefore(svgContainer.firstChild, document.body.firstChild);


// 菜单数据结构
const menuData = [
    {
        title: "首页",
        icon: "house-chimney-solid-full",
        link: "../index.html",
        active: true
    },
    {
        title: "轻易设计",
        icon: "compass-drafting-solid-full",
        submenu: [
            { title: "批量条形码生成", link: "../lotbar.html" },
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
        icon: "microchip-solid-full",
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
        icon: "codepen-brands-solid-full",
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
        icon: "camera-rotate-solid-full",
        submenu: [
            { title: "音视频格式转换", link: "mp4mp3.html" },
            { title: "图片格式转换", link: "../conver.html" },
	    { title: "线性颜色转换", link: "../color.html" },
            { title: "BASE64图片转换器", link: "../BASE64.html" },
        ]
    },
    {
        title: "轻易实用",
        icon: "swatchbook-solid-full",
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
menuToggle.innerHTML = '<svg class="icon"><use xlink:href="#bars-solid-full"></use></svg>';
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
                         <svg><use xlink:href="#${item.icon}"></use></svg>
                    </div>
                    <div class="menu-text">${item.title}</div>
                    ${item.submenu ? '<div class="menu-arrow"><svg class="icon"><use xlink:href="#chevron-right-solid-full"></use></svg></div>' : ''}
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