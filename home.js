// --- 1. 工具列表数据 ---
const tools = [
    {
        title: "批量条形码生成",
        description: "用于平面设计包装条形码，支持自定义数量、格式、内容",
        category: "design",
        link: "lotbar.html",
        icon: "img/lotbar.webp",
        badge: "更新"
    },
    {
        title: "AI生成UI界面",
        description: "AI一键生成原型UI界面，支持下载源文件",
        category: "design",
        link: "AI-UI.html",
        icon: "img/AI-UI.webp",
        badge: ""
    },
    {
        title: "图片对比工具",
        description: "滑动分割线对比两张图片差异",
        category: "design",
        link: "diff.html",
        icon: "img/diff.webp",
        badge: ""
    },
    {
        title: "图片压缩工具",
        description: "免费在线图片压缩工具，支持JPG/PNG格式，不限尺寸数量",
        category: "design",
        link: "comp.html",
        icon: "img/comp.webp",
        badge: ""
    },
    {
        title: "UI设计数据生成器",
        description: "快速生成各类测试数据，用于表单填充和UI设计验证",
        category: "design",
        link: "data.html",
        icon: "img/数据模拟.webp",
        badge: ""
    },
    {
        title: "在线PS",
        description: "免费的在线版Photoshop，无惧版权风险问题",
        category: "design",
        link: "PS.html",
        icon: "img/PS.webp",
        badge: "荐"
    },
    {
        title: "矢量花朵生成器",
        description: "创建漂亮独特的矢量花朵，包括玫瑰、雏菊、郁金香，支持下载svg矢量源文件",
        category: "design",
        link: "flower.html",
        icon: "img/flower.webp",
        badge: ""
    },
    {
        title: "城市天际线生成器",
        description: "创建独特的扁平矢量化的城市天际线，支持下载svg矢量源文件",
        category: "design",
        link: "city.html",
        icon: "img/city.webp",
        badge: ""
    },
    {
        title: "AI一键扩图",
        description: "无需复杂操作，上传图片即可一键扩展图片",
        category: "dev",
        link: "expand.html",
        icon: "img/expand.webp",
        badge: "NEW"
    },
    {
        title: "AI高清放大",
        description: "使用开源 AI 模型，支持2倍-4倍放大，保留更多细节",
        category: "dev",
        link: "scale.html",
        icon: "img/scale.webp",
        badge: ""
    },
    {
        title: "AI一键抠图",
        description: "支持批量一键抠图、一键打包下载",
        category: "dev",
        link: "rembg.html",
        icon: "img/rembg.webp",
        badge: "更新"
    },
    {
        title: "AI绘画",
        description: "AI绘图，支持文生图、图生图、历史记录查看，出图无水印",
        category: "dev",
        link: "draw.html",
        icon: "img/draw.webp",
        badge: ""
    },
    {
        title: "免费版ChatGPT",
        description: "无需API，可进行AI对话（支持图片上传）、提示词扩写、图像识别、文本转语音等功能",
        category: "dev",
        link: "freeAI.html",
        icon: "img/freeAI.webp",
        badge: ""
    },
    {
        title: "AI数字人(API版)",
        description: "AI对话、提示词扩写、图像识别等功能，支持文件上传、模型切换",
        category: "dev",
        link: "AI.html",
        icon: "img/AI.webp",
        badge: ""
    },
    {
        title: "lora训练数据集编辑",
        description: "整理和编辑模型训练数据集，支持批量AI反推提示词、一键翻译、修改尺寸、修改背景、打包下载等功能",
        category: "dev",
        link: "model.html",
        icon: "img/model.webp",
        badge: "更新"
    },
    {
        title: "AI画风提示词大全",
        description: "588种风格，支持SDXL及以上版本大模型，可筛选和一键复制提示词",
        category: "dev",
        link: "SDXL.html",
        icon: "img/SDXL.webp",
        badge: ""
    },
    {
        title: "HDR灯光编辑器",
        description: "支持导入外部模型，提供多种灯光选择，4k HDR格式导出",
        category: "3D",
        link: "hdr.html",
        icon: "img/hdr.webp",
        badge: ""
    },
    {
        title: "PBR贴图生成",
        description: "全流程贴图生成。一键生成多种PBR贴图，支持法线、置换、AO、反射、光泽度",
        category: "3D",
        link: "normal.html",
        icon: "img/法线.webp",
        badge: "荐"
    },
    {
        title: "无缝贴图制作",
        description: "无缝贴图制作工具，支持PNG、JPG、TIFF等格式",
        category: "3D",
        link: "texture.html",
        icon: "img/texture.webp",
        badge: ""
    },
    {
        title: "AI生成无缝贴图",
        description: "AI工作流生成无缝贴图、生成法线图、曲率图和深度图",
        category: "3D",
        link: "aimap.html",
        icon: "img/AI无缝.webp",
        badge: ""
    },
    {
        title: "无缝贴图预览",
        description: "预览和测试无缝贴图效果，支持百分比缩放",
        category: "3D",
        link: "map.html",
        icon: "img/贴图.webp",
        badge: ""
    },
    {
        title: "ORM游戏贴图生成",
        description: "上传AO、粗糙度和金属度贴图自动合成ORM纹理贴图，或上传ORM贴图拆解为独立通道",
        category: "3D",
        link: "ORM.html",
        icon: "img/body4orm.webp",
        badge: ""
    },
    {
        title: "C4D地板预设",
        description: "包含五种场景地板排列类型，可以修改长宽、密度、缝隙、圆角、细分等参数",
        category: "3D",
        link: "floor.html",
        icon: "img/floor.webp",
        badge: ""
    },
    {
        title: "C4D测量工具",
        description: "C4D测量标注插件免费下载，包括测量工具和量角工具",
        category: "3D",
        link: "c4drule.html",
        icon: "img/c4drule.webp",
        badge: ""
    },
    {
        title: "C4D编织预设",
        description: "C4D编织预设免费下载,可以做出微观世界的布料编织效果",
        category: "3D",
        link: "weaving.html",
        icon: "img/weaving.webp",
        badge: ""
    },
    {
        title: "C4D色偏散景预设",
        description: "C4D色偏散景预设免费下载,可以模拟显示世界的色偏散景效果",
        category: "3D",
        link: "shift.html",
        icon: "img/shift.webp",
        badge: ""
    },
    {
        title: "音视频格式转换",
        description: "支持常见视频格式、音频格式转换、音频格式提取",
        category: "cover",
        link: "video/mp4mp3.html",
        icon: "img/mp4mp3.webp",
        badge: ""
    },
    {
        title: "图片格式转换",
        description: "支持HEIC、TIF、JPG、PNG、BMP、GIF、WEBP、SVG格式",
        category: "cover",
        link: "conver.html",
        icon: "img/conver.webp",
        badge: ""
    },
    {
        title: "线性颜色转换",
        description: "非线性颜色转线性颜色，用于C4D、blender，颜色格式互转（HEX, RGB, HSL, HSV）",
        category: "cover",
        link: "color.html",
        icon: "img/颜色.webp",
        badge: ""
    },
    {
        title: "BASE64图片转换器",
        description: "将图片转换为Base64编码，或从Base64编码还原为图片",
        category: "cover",
        link: "BASE64.html",
        icon: "img/base64.webp",
        badge: ""
    },
    {
        title: "青艺云广播",
        description: "在线收听收音机，精选全球优质音乐电台",
        category: "utility",
        link: "radio.html",
        icon: "img/radio.webp",
        badge: ""
    },
    {
        title: "在线视频剪辑",
        description: "开源视频剪辑工具，浏览器在线剪辑。功能逐步完善中",
        category: "utility",
        link: "opencut.html",
        icon: "img/opencut.webp",
        badge: ""
    },
    {
        title: "在线ikun小游戏",
        description: "ikun躲避球小游戏，移动坤坤躲避砸下来的篮球",
        category: "utility",
        link: "jntm.html",
        icon: "img/ikun.webp",
        badge: ""
    },
    {
        title: "朋友圈九宫格制作",
        description: "上传图片裁剪成九宫格，按照9张图顺序进行排列",
        category: "utility",
        link: "9img.html",
        icon: "img/9img.webp",
        badge: ""
    },
    {
        title: "高级翻译工具",
        description: "支持30多种语言互译，根据文本匹配度提供其他建议",
        category: "utility",
        link: "translation.html",
        icon: "img/翻译.webp",
        badge: ""
    },
];


// --- 2. 分类信息映射 ---
const categoryMap = {
    'design': { name: '轻易设计工具', icon: '#compass-drafting-solid-full', scripts: 'UI设计/Adobe全家桶/图片压缩/在线PS', gradient: '#5c79ff;' , background: '#ebecfe, #ecf2fd'},
    'dev': { name: '轻易AI工具', icon: '#microchip-solid-full', scripts: '高清放大/AI抠图/ChatGPT/AI绘画/LORA训练', gradient: '#9062ff' , background: '#e5def9, #e8e4f9'},
    '3D': { name: '轻易3D工具', icon: '#codepen-brands-solid-full', scripts: 'PBR贴图/无缝贴图/ORM贴图/HDR', gradient: '#0cbecb' , background: '#def8f9, #e2f9f7'},
    'cover': { name: '轻易格式转换', icon: '#camera-rotate-solid-full', scripts: '图片转换/音频转换/视频转换/颜色转换', gradient: '#ef565c' , background: '#fde5eb, #fceff6'},
    'utility': { name: '轻易实用工具', icon: '#swatchbook-solid-full', scripts: '游戏/视频剪辑/广播/九宫格/翻译', gradient: '#ffba15' , background: '#fbf6e3, #fff9e9'},
};


// --- 3. 打赏数据 ---
const donationData = [
    { id: "🐛🐛", amount: "20.00", data: "2025-09-29", message: "匿名用户：虫*哥" },
    { id: "BJM", amount: "10.00", data: "2025-09-29", message: "求合作 大佬*****" },
    { id: "匿名", amount: "10.00", data: "2025-09-25", message: "牛逼！太好用了" },
    { id: "强", amount: "1.00", data: "2025-09-20", message: "6啊" },
    { id: "🐛🐛", amount: "5.00", data: "2025-09-18", message: "" },
    { id: "M", amount: "6.66", data: "2025-09-18", message: "牛逼的设计师🧑‍🎨" },
    { id: "L", amount: "0.01", data: "2025-09-18", message: "我是奥德乌木维尔耶尔吐温威乌温穆本欧萨斯" },
    { id: "洛小菜", amount: "3.00", data: "2025-09-13", message: "兄弟，你真是好人" },
    { id: "心兰相随", amount: "1.00", data: "2025-08-25", message: "艺青弟弟😎" },
    { id: "匿名", amount: "1.00", data: "2025-08-25", message: "网站不错，加油！" },
    { id: "年华", amount: "3.00", data: "2025-08-25", message: "艺青哥哥👦🏻" },
    { id: "静候TEL", amount: "3.00", data: "2025-08-18", message: "您好，方便请教一下生成无缝工作流的问题吗？" },
    { id: "修悠盖（射哥）", amount: "0.01", data: "2025-07-08", message: "射哥打赏" },
    { id: "修悠盖（射哥）", amount: "0.01", data: "2025-07-08", message: "射哥打赏" },
    { id: "宇宙无敌柠檬王🍋", amount: "1.00", data: "2025-06-26", message: "恭喜发财" },
];
const changelogData = [
    {
        date: "2025-09-30",
        content: [
            "优化一键扩图UI布局。",
        ]
    },
    {
        date: "2025-09-28",
        content: [
            "一键抠图新增欢迎页和加载过程图标；",
            "调整首页、图片转换、视频转换布局；",
            "优化404页面显示。",
        ]
    },
    {
        date: "2025-09-27",
        content: [
            "文章侧栏新增相关下载推荐。",
        ]
    },
    {
        date: "2025-09-25",
        content: [
            "优化域名DNS解析，支持www和https访问；",
            "优化桌面快捷图标显示；",
            "新增关于我们页面。",
        ]
    },
    {
        date: "2025-09-24",
        content: [
            "数据从github迁移到cloudflare，优化网站速度；",
            "新增AI一键扩图工具，无需复杂操作，上传图片即可一键扩展图片。",
        ]
    },
    {
        date: "2025-09-23",
        content: [
            "LORA训练集编辑器，新增Gemini模型版本切换；",
            "网站首页新增“更新日志”。",
        ]
    },
    {
        date: "2025-09-22",
        content: [
            "批量条形码生成，新增条数统计功能；",
            "AI高清放大，支持图片1:1放大查看；",
            "优化网站速度。",
        ]
    },
    {
        date: "2025-09-18",
        content: [
            "上线 “批量条形码生成” 工具；",
            "AI一键抠图新增模型加载过程，优化抠图速度。",
        ]
    },
];
