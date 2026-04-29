# UkiUki 风格设计规范

## 参考图
`/home/ubuntu/.hermes/profiles/ops/cache/images/img_e8deeb6f4f7b.png`

## 整体风格
- 少女风 / 治愈系 / 可爱风 (Kawaii)
- 粉紫色调
- 大量圆角、柔软元素
- 毛玻璃效果
- 插画独立区域

## 配色方案

```css
:root {
  --color-primary: #FF8FAB;        /* 樱花粉 */
  --color-primary-dark: #FF6B9D;   /* 深粉 */
  --color-primary-light: #FFE4EC;  /* 浅粉 */
  --color-purple: #D4BBFC;         /* 淡紫色 */
  --color-purple-light: #F3E8FF;   /* 浅紫色 */
  --color-bg-start: #FFF5F7;       /* 背景渐变开始 */
  --color-bg-end: #F8F0FC;         /* 背景渐变结束 */
  --color-card: rgba(255,255,255,0.95); /* 卡片背景 */
  --color-text-primary: #2D2D2D;   /* 主文字 */
  --color-text-secondary: #9CA3AF; /* 次要文字 */
  --color-text-muted: #D1D5DB;     /* 提示文字 */
  --color-text-accent: #FF8FAB;    /* 强调文字 */
}
```

## 背景
```css
background: linear-gradient(180deg, #FFF5F7 0%, #F8F0FC 100%);
```

## 卡片样式
```css
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 24px;
}
```

## 按钮样式

### 主按钮（登录等）
```css
.btn-primary {
  background: linear-gradient(90deg, #FFB6C1, #FF69B4);
  color: white;
  border-radius: 24px;
  padding: 14px 32px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 8px 20px rgba(255, 107, 157, 0.4);
  border: none;
}
```

### 编边按钮（关注、注册）
```css
.btn-outline {
  border: 1px solid #FF8FAB;
  color: #FF8FAB;
  background: transparent;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 14px;
}
```

### 第三方登录按钮
```css
.btn-social {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## 输入框样式
```css
.input {
  background: white;
  border: 1px solid #F3F4F6;
  border-radius: 16px;
  padding: 14px 16px;
  font-size: 15px;
  color: #2D2D2D;
}
.input::placeholder {
  color: #D1D5DB;
}
```

## 标签 Pill 样式
```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
}
.tag-blue   { background: #E0F2FE; color: #0369A1; }
.tag-yellow { background: #FEF3C7; color: #B45309; }
.tag-pink   { background: #FFE4EC; color: #BE185D; }
.tag-purple { background: #F3E8FF; color: #7C3AED; }
.tag-green  { background: #DCFCE7; color: #15803D; }
```

## 圆角规范
- 大卡片: 32px
- 内容卡片: 16px
- 输入框: 16px
- 主按钮: 24px
- 头像: 50%
- 图片: 12px
- 标签: 999px (pill)

## 字体大小
- 品牌标题: 28-32px, bold
- 页面标题: 24px, bold
- 副标题: 14-16px
- 卡片标题: 18-20px, bold
- 输入框: 15px
- 按钮: 16px, bold
- 列表项: 14-16px
- 辅助文字: 12-13px

## 间距规范
- 页面边距: 16-20px
- 卡片内边距: 20-24px
- 组件间距: 12-16px
- 元素内间距: 8-12px

## 特殊要求
1. **登录页插画区域**：登录卡片上方需要有一个可爱的插画区域（可用 emoji 或简单图标代替），插画头部超出卡片边界，营造层次感
2. **毛玻璃效果**：登录卡片使用 backdrop-filter: blur(10px) 效果
3. **飘浮装饰**：可以在登录页面添加一些小星星、心形的 CSS 装饰元素
4. **粉色渐变按钮**：所有主操作按钮都要是粉色渐变
5. **Tab 切换**：登录方式 tab 切换，选中状态底部有粉色下划线或背景
