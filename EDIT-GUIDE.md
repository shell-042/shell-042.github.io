# 修改指南 · 冷咏雪个人品牌站

这个站点是**纯静态 HTML/CSS/JS**，没有任何构建步骤、不依赖框架。
你改完直接用浏览器打开 `index.html` 就能看，或按文末方式起本地服务。

## 目录结构
```
site/
├─ index.html        ← 所有页面文字都在这里（搜 BLOCK 注释定位）
├─ css/
│  ├─ tokens.css     ← 颜色 / 字体 / 间距，改风格只动这一个文件
│  └─ style.css      ← 布局样式（一般不用改）
├─ js/main.js        ← 导航高亮 / 滚动动画 / 作品集筛选
├─ assets/
│  ├─ logo.svg       ← 顶部导航的贝壳标识（基于英文名 shell，蓝→珊瑚渐变）
│  ├─ cases/         ← 4 个案例封面（sensoro / ckgsb / aispeech / yunqing）
│  ├─ logos/         ← 媒体 logo 占位（placeholder-1..6）
│  ├─ portraits/     ← 形象照 / 简历 PDF 占位
│  └─ media/         ← 其他素材
├─ CONTENT-FOR-REVIEW.md  ← 最新文字版（唯一文字基准，改文案请基于它）
└─ EDIT-GUIDE.md     ← 本文件
```

## 一、改文字（最常见）
打开 `index.html`，搜索下面这些标记，直接改文字即可：

| 想改什么 | 搜索标记 |
|---|---|
| Hero 大标题 | `BLOCK · HERO_HEADLINE` |
| Hero 副标题 / Slogan | `BLOCK · HERO_TAGLINE` |
| 关于我 · 引言 | `BLOCK · ABOUT_LEAD` |
| 关于我 · 简介 | `BLOCK · ABOUT_BIO` |
| 专长标签 | `BLOCK · ABOUT_TAGS` |
| 职业经历时间线 | `BLOCK · EXP_ITEMS` |
| 能力分组 | `BLOCK · SKILLS_GROUPS` |
| 作品集筛选标签 | `BLOCK · PORTFOLIO_FILTER` |
| 四个案例内容 | `BLOCK · CASE_01` ~ `CASE_04` |
| 数据看板数字 | `BLOCK · IMPACT_STATS` |
| 自媒体平台 | `BLOCK · MEDIA_PLATFORMS` |
| 联系方式 | `BLOCK · CONTACT_BLOCK` |

> 注：「媒体·资源」板块（原合作媒体 logo / 署名清单）已在审阅稿阶段移除，
> 原文档里的 `BLOCK · MEDIA_LOGOS` / `BLOCK · MEDIA_CREDITS` 标记已不存在。

每个案例用 `背景 / 成果` 两段，照结构填即可。
「查看原文 →」「解决方案一张图 →」等链接现在是 `#` 或已填外链，
你给原文链接后替换对应 `<a href="...">` 即可（外链记得加 `target="_blank"`）。

## 二、改图片 / 图集轮播
每个案例的封面区是一个**图片轮播**，能放任意张图（v9 起按图片实际比例自适应，不用严格 16:9）。

**当前文件名 · 4 个案例 13 张原图**：
- CASE 01 升哲 SENSORO（5 张）：`sensoro-real-1.jpeg` ~ `sensoro-real-4.jpeg` + `sensoro-real-5.png`（第 5 张 v11/v12 均为 16:9，与前 4 张 1920×1080 比例一致）
- CASE 02 长江 MBA（2 张）：`ckgsb-real-1.png`、`ckgsb-real-2.png`
- CASE 03 思必驰（3 张）：`aispeech-real-1.jpg` ~ `aispeech-real-3.jpg`
- CASE 04 云清联盟（3 张）：`yunqing-real-1.jpeg`、`yunqing-real-2.jpeg`、`yunqing-real-3.jpg`

**换图**：用同名文件覆盖到 `assets/cases/` 即可，无需改代码；尺寸不必强求 16:9，会自动 contain 留白。

**加图 / 减图**：在 `index.html` 找到对应案例的 `<div class="case__track">`，
复制或删一行 `<div class="case__slide"><img src="…" alt="…" loading="lazy"></div>`。
轮播圆点**自动**按子图张数生成。单张图时左右箭头和圆点会自动隐藏。
**轮播框比例已静态化（v12 修复）**：不再由 JS 在图片 decode 后注入 aspect-ratio（那会导致滚动到末张时框体突变位移）。比例写死在 CSS——`.case__cover` 默认 16/9（升哲/长江）；思必驰加 `.case__cover--ar-1414`（1.414）；云清加 `.case__cover--ar-32`（3/2，cover 铺满）。换图若比例变化，改对应修饰类即可，无需改 JS。

**轮播行为**（如需改，在 `js/main.js` 第 4 块 `initCarousels`）：
- 进入视口自动播放，离开视口暂停（省性能）
- 鼠标悬停暂停，移开恢复
- 支持键盘 ← →、移动端左右滑动
- 尊重系统的「减少动态效果」偏好，开启时不自动播放
- 切换间隔 5 秒（改 `setInterval(..., 5000)` 里的数字）

其他图片：
- 顶部导航标识 → `assets/logo.svg`（贝壳图案，直接改这个 SVG 或整体替换即可换 Logo）
- 形象照 → `assets/portraits/portrait.jpg`（替换 HTML 里占位的 `<div>` 或改成 `<img>`）
- 媒体 logo → `assets/logos/placeholder-1.svg` 等
- 简历 PDF → `assets/portraits/resume.pdf`（已有下载入口）

> 注意：当前案例封面引用的是 `.svg` 占位图。若换成 `.jpg/.png`，
> 记得把 `index.html` 里 `<img src="assets/cases/xxx.svg">` 的后缀改掉。

## 三、改颜色 / 字体（一键换色）
打开 `css/tokens.css`，所有颜色都是顶部变量：
- `--blue-brand` 品牌主蓝
- `--warm-coral` 暖色冲撞（CTA、关键数字）
- `--warm-amber` 过渡暖色
- 渐变 `--grad-blue-warm`（蓝→暖的过渡路径）控制整体撞色走向

想整体偏暖一点：把 `--blue-brand` 调浅、把 `--warm-coral` 在渐变里的占比调高即可。
字体在 `--font-serif`（标题衬线）/ `--font-sans`（正文无衬线）两行改。

## 四、联系方式（现在按你要求留空）
`index.html` 末尾 `CONTACT_BLOCK` 区有四个占位槽（邮箱 / 微信 / LinkedIn / 简历）。
你把信息给我，或自己把 `[ 占位 ]` 换成真实文字、把 `href="#"` 换成链接即可。

## 五、本地预览
方式 A：直接双击 `index.html` 用浏览器打开。
方式 B（推荐，字体/动画更准）：在 `site/` 目录起个本地服务——
```bash
cd site && python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 六、后续可加
- 多语言（中英切换）
- 深色模式（tokens.css 已预留 `[data-theme]` 钩子）
- 作品集详情页（点案例跳二级页）
- 博客 / 文章列表

需要我做任何一项，直接说。
