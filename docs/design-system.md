# Matchmaker 前端设计规范

> 版本：v1.0  
> 项目：`/data/workspace/matchmaker-frontend`  
> 技术栈：React + TypeScript + TailwindCSS + Vite  
> 适配：移动端优先（Mobile First），桌面端响应式

---

## 1. 色彩系统（Color System）

### 1.1 主色（Primary）

| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `--color-primary-50` | `#FFF0F5` | `#2D1B2E` | 极浅背景 |
| `--color-primary-100`| `#FFD6E8` | `#4A2A4D` | 浅背景/悬停 |
| `--color-primary-200`| `#FFADD1` | `#6B3A70` | 边框/分割线 |
| `--color-primary-300`| `#FF85BA` | `#8F4A96` | 次要元素 |
| `--color-primary-400`| `#FF5DA3` | `#B35DBA` | 强调文字 |
| `--color-primary-500`| `#FF4081` | `#FF4081` | **主品牌色** |
| `--color-primary-600`| `#E91E63` | `#E91E63` | 按钮按下 |
| `--color-primary-700`| `#C2185B` | `#C2185B` | 深强调 |
| `--color-primary-800`| `#AD1457` | `#AD1457` | 深色文字 |
| `--color-primary-900`| `#880E4F` | `#880E4F` | 最深色 |

### 1.2 辅色（Secondary）

| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `--color-secondary-50` | `#F3E5F5` | `#2E1B33` | 极浅背景 |
| `--color-secondary-100`| `#E1BEE7` | `#4A2A52` | 浅背景 |
| `--color-secondary-500`| `#9C27B0` | `#BA68C8` | 辅品牌色 |
| `--color-secondary-600`| `#8E24AA` | `#AB47BC` | 按钮按下 |
| `--color-secondary-700`| `#7B1FA2` | `#9C27B0` | 深强调 |

### 1.3 中性色（Neutral / Gray Scale）

| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `--color-gray-50` | `#FAFAFA` | `#121212` | 页面背景 |
| `--color-gray-100`| `#F5F5F5` | `#1E1E1E` | 卡片背景 |
| `--color-gray-200`| `#EEEEEE` | `#2C2C2C` | 边框/分割线 |
| `--color-gray-300`| `#E0E0E0` | `#3D3D3D` | 禁用边框 |
| `--color-gray-400`| `#BDBDBD` | `#616161` | 占位符文字 |
| `--color-gray-500`| `#9E9E9E` | `#757575` | 次要文字 |
| `--color-gray-600`| `#757575` | `#9E9E9E` | 辅助文字 |
| `--color-gray-700`| `#616161` | `#BDBDBD` | 正文文字 |
| `--color-gray-800`| `#424242` | `#E0E0E0` | 标题文字 |
| `--color-gray-900`| `#212121` | `#F5F5F5` | 最深文字 |

### 1.4 语义色（Semantic Colors）

| 语义 | Light Mode | Dark Mode | 用途 |
|------|-----------|-----------|------|
| **成功 Success** | `#4CAF50` | `#66BB6A` | 匹配成功、操作成功 |
| **警告 Warning** | `#FF9800` | `#FFA726` | 提示注意 |
| **错误 Error** | `#F44336` | `#EF5350` | 表单错误、拒绝操作 |
| **信息 Info** | `#2196F3` | `#42A5F5` | 提示信息 |
| **爱心 Love** | `#E91E63` | `#F06292` | 喜欢按钮、心动状态 |

### 1.5 背景与表面色（Background & Surface）

| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `--bg-page` | `#FFFFFF` | `#121212` | 页面底层背景 |
| `--bg-card` | `#FFFFFF` | `#1E1E1E` | 卡片/浮层背景 |
| `--bg-elevated` | `#FFFFFF` | `#2C2C2C` | 弹窗/抽屉背景 |
| `--bg-overlay` | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.7)` | 遮罩层 |
| `--bg-gradient-start` | `#FF4081` | `#FF4081` | 渐变起始 |
| `--bg-gradient-end` | `#9C27B0` | `#9C27B0` | 渐变结束 |

---

## 2. 字体层级（Typography）

### 2.1 字体栈

```css
--font-sans: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;
--font-display: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

### 2.2 字号层级

| 层级 | 字号 | 字重 | 行高 | 字间距 | 用途 |
|------|------|------|------|--------|------|
| **Display** | 32px / 2rem | 700 | 1.2 | -0.02em | 首页大标题、匹配成功弹窗 |
| **H1** | 24px / 1.5rem | 700 | 1.3 | -0.01em | 页面标题 |
| **H2** | 20px / 1.25rem | 600 | 1.4 | 0 | 区块标题 |
| **H3** | 18px / 1.125rem | 600 | 1.4 | 0 | 卡片标题 |
| **H4** | 16px / 1rem | 600 | 1.5 | 0 | 小标题 |
| **Body** | 16px / 1rem | 400 | 1.6 | 0 | 正文内容 |
| **Body Small** | 14px / 0.875rem | 400 | 1.5 | 0 | 次要正文 |
| **Caption** | 12px / 0.75rem | 400 | 1.4 | 0.01em | 辅助说明 |
| **Label** | 11px / 0.6875rem | 500 | 1.3 | 0.02em | 标签、徽章 |
| **Button** | 16px / 1rem | 600 | 1 | 0.01em | 按钮文字 |
| **Nav** | 12px / 0.75rem | 500 | 1 | 0 | 底部导航 |

### 2.3 文字颜色规范

| 场景 | Light Mode | Dark Mode |
|------|-----------|-----------|
| 主标题 | `gray-900` | `gray-900`（即 `#F5F5F5`）|
| 正文 | `gray-700` | `gray-700`（即 `#E0E0E0`）|
| 次要文字 | `gray-500` | `gray-500`（即 `#757575`）|
| 禁用文字 | `gray-400` | `gray-400`（即 `#616161`）|
| 链接/可点击 | `primary-500` | `primary-500` |
| 反白文字（彩色背景上）| `#FFFFFF` | `#FFFFFF` |

---

## 3. 间距系统（Spacing Scale）

基于 **4px** 基准单位的 8 点网格系统：

| Token | 值 | Tailwind 类 | 用途 |
|-------|-----|------------|------|
| `--space-1` | 4px | `p-1` / `m-1` | 极紧凑间距 |
| `--space-2` | 8px | `p-2` / `m-2` | 图标与文字间距 |
| `--space-3` | 12px | `p-3` / `m-3` | 小间距 |
| `--space-4` | 16px | `p-4` / `m-4` | 标准间距 |
| `--space-5` | 20px | `p-5` / `m-5` | 卡片内边距 |
| `--space-6` | 24px | `p-6` / `m-6` | 区块间距 |
| `--space-8` | 32px | `p-8` / `m-8` | 大区块间距 |
| `--space-10`| 40px | `p-10` / `m-10`| 页面级间距 |
| `--space-12`| 48px | `p-12` / `m-12`| 大留白 |
| `--space-16`| 64px | `p-16` / `m-16`| 超大留白 |

### 3.1 常用组合

| 场景 | 水平内边距 | 垂直内边距 |
|------|-----------|-----------|
| 页面内容区 | `px-4` (16px) | `py-6` (24px) |
| 卡片 | `p-5` (20px) | `p-5` (20px) |
| 按钮 | `px-6` (24px) | `py-3` (12px) |
| 输入框 | `px-4` (16px) | `py-3` (12px) |
| 列表项 | `px-4` (16px) | `py-3` (12px) |
| 底部安全区 | - | `pb-safe` (env(safe-area-inset-bottom)) |

---

## 4. 圆角与阴影（Border Radius & Shadows）

### 4.1 圆角规范

| Token | 值 | Tailwind 类 | 用途 |
|-------|-----|------------|------|
| `--radius-none` | 0 | `rounded-none` | 无圆角 |
| `--radius-sm` | 4px | `rounded-sm` | 标签、徽章 |
| `--radius-md` | 8px | `rounded-md` | 按钮、输入框 |
| `--radius-lg` | 12px | `rounded-lg` | 小卡片 |
| `--radius-xl` | 16px | `rounded-xl` | 标准卡片 |
| `--radius-2xl`| 20px | `rounded-2xl` | 大卡片 |
| `--radius-3xl`| 24px | `rounded-3xl` | 弹窗 |
| `--radius-full` | 9999px | `rounded-full` | 头像、圆形按钮 |

### 4.2 阴影规范

| Token | 值 | 用途 |
|-------|-----|------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | 轻微提升 |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` | 卡片 |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)` | 弹窗、抽屉 |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)` | 模态框 |
| `--shadow-glow` | `0 0 20px rgba(255,64,129,0.3)` | 主色光晕（匹配成功）|
| `--shadow-inner` | `inset 0 2px 4px rgba(0,0,0,0.06)` | 内阴影 |

---

## 5. 动画规范（Animation System）

使用 **Framer Motion** 作为动画库。

### 5.1 动画曲线（Easing）

```typescript
// 动画曲线定义
export const easings = {
  // 标准缓出
  easeOut: [0, 0, 0.2, 1],
  // 标准缓入
  easeIn: [0.4, 0, 1, 1],
  // 标准缓入缓出
  easeInOut: [0.4, 0, 0.2, 1],
  // 弹性（用于庆祝动画）
  spring: { type: "spring", stiffness: 400, damping: 25 },
  // 柔和弹性（卡片滑动）
  springSoft: { type: "spring", stiffness: 300, damping: 30 },
  // 弹跳（匹配成功）
  bounce: { type: "spring", stiffness: 500, damping: 15 },
};
```

### 5.2 持续时间

```typescript
export const durations = {
  instant: 0.1,    // 100ms - 按钮按下
  fast: 0.15,      // 150ms - 颜色过渡
  normal: 0.25,    // 250ms - 标准过渡
  slow: 0.35,      // 350ms - 页面切换
  slower: 0.5,     // 500ms - 弹窗出现
  celebratory: 0.8,// 800ms - 庆祝动画
};
```

### 5.3 页面过渡动画

```typescript
// 页面进入
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.35, ease: easings.easeOut },
};

// 页面切换（带滑动）
export const slideTransition = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: 0.35, ease: easings.easeInOut },
};
```

### 5.4 卡片滑动动画（Tinder 式）

```typescript
export const cardSwipe = {
  // 拖动中
  drag: {
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 0.9,
  },
  // 向左滑（不喜欢）
  swipeLeft: {
    x: -500,
    opacity: 0,
    rotate: -30,
    transition: { duration: 0.4, ease: easings.easeOut },
  },
  // 向右滑（喜欢）
  swipeRight: {
    x: 500,
    opacity: 0,
    rotate: 30,
    transition: { duration: 0.4, ease: easings.easeOut },
  },
  // 回弹
  snapBack: {
    x: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};
```

### 5.5 按钮交互动画

```typescript
export const buttonTap = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 },
  transition: { duration: 0.1 },
};

export const buttonPress = {
  whileTap: { scale: 0.92, y: 2 },
  transition: { duration: 0.1 },
};
```

### 5.6 匹配成功庆祝动画

```typescript
export const matchCelebration = {
  // 背景遮罩
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  // 弹窗容器
  modal: {
    initial: { scale: 0.5, opacity: 0, y: 50 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 20, delay: 0.1 }
    },
  },
  // 文字 "匹配成功"
  title: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3, duration: 0.4 },
  },
  // 头像对撞
  avatarLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 },
  },
  avatarRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 },
  },
  // 粒子/心形漂浮
  floatingHearts: {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [0, -100],
    },
    transition: { duration: 1.5, repeat: Infinity, delay: 0.5 },
  },
};
```

### 5.7 列表项进入动画

```typescript
export const listItem = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.25 },
};

export const staggerList = {
  animate: {
    transition: { staggerChildren: 0.05 },
  },
};
```

### 5.8 骨架屏动画

```typescript
export const skeletonPulse = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};
```

---

## 6. 图标规范（Icon System）

### 6.1 图标库

**推荐使用**：`lucide-react`

```bash
npm install lucide-react
```

备选：`react-icons`（如需更多品牌图标）

### 6.2 图标尺寸规范

| 场景 | 尺寸 |  strokeWidth |
|------|------|-------------|
| 导航栏图标 | 24px | 2 |
| 按钮内图标 | 20px | 2 |
| 列表项图标 | 18px | 2 |
| 徽章/标签图标 | 14px | 2 |
| 大图标（空状态）| 48px | 1.5 |
| 超大图标（庆祝）| 64px | 1.5 |

### 6.3 各页面图标映射表

| 页面/场景 | 图标名称（Lucide）| 用途 |
|-----------|------------------|------|
| **首页** | `Heart` | Logo/品牌 |
| **发现** | `Compass` | 底部导航 |
| **匹配列表** | `MessageCircle` | 底部导航 |
| **个人资料** | `User` | 底部导航 |
| **喜欢** | `Heart` | 喜欢按钮 |
| **不喜欢** | `X` | 拒绝按钮 |
| **超级喜欢** | `Star` | 超级喜欢 |
| **返回** | `ChevronLeft` | 返回上一页 |
| **设置** | `Settings` | 设置入口 |
| **编辑** | `Pencil` | 编辑资料 |
| **位置** | `MapPin` | 位置信息 |
| **工作** | `Briefcase` | 职业信息 |
| **学历** | `GraduationCap` | 教育信息 |
| **照片** | `Image` | 相册 |
| **发送消息** | `Send` | 聊天发送 |
| **更多选项** | `MoreVertical` | 菜单 |
| **通知** | `Bell` | 消息通知 |
| **搜索** | `Search` | 搜索用户 |
| **筛选** | `SlidersHorizontal` | 筛选条件 |
| **退出** | `LogOut` | 退出登录 |
| **加载中** | `Loader2` + spin | 加载状态 |
| **空状态-无匹配** | `Inbox` | 空列表 |
| **空状态-无消息** | `MessageSquare` | 空聊天 |
| **成功** | `CheckCircle2` | 操作成功 |
| **错误** | `AlertCircle` | 错误提示 |
| **信息** | `Info` | 提示信息 |

---

## 7. 组件规范（Component Specifications）

### 7.1 Button 按钮

#### 变体（Variants）

| 变体 | 背景 | 文字 | 边框 | 用途 |
|------|------|------|------|------|
| **primary** | `primary-500` | 白色 | 无 | 主要操作 |
| **secondary** | `secondary-500` | 白色 | 无 | 次要操作 |
| **outline** | 透明 | `primary-500` | `primary-500` 1px | 边框按钮 |
| **ghost** | 透明 | `gray-700` | 无 | 低强调 |
| **danger** | `error` | 白色 | 无 | 删除/拒绝 |
| **love** | `love` | 白色 | 无 | 喜欢按钮 |

#### 尺寸（Sizes）

| 尺寸 | 高度 | 水平内边距 | 圆角 | 字号 |
|------|------|-----------|------|------|
| **sm** | 32px | 12px | `radius-md` | 14px |
| **md** | 40px | 24px | `radius-md` | 16px |
| **lg** | 48px | 32px | `radius-lg` | 16px |
| **xl** | 56px | 40px | `radius-xl` | 18px |
| **icon** | 48px | 0 | `radius-full` | - |

#### 状态

- **Default**: 基础样式
- **Hover**: `brightness(1.1)` + `scale(1.02)`
- **Active/Pressed**: `scale(0.95)` + `brightness(0.95)`
- **Disabled**: `opacity: 0.5` + `cursor: not-allowed`
- **Loading**: 显示 `Loader2` 旋转图标，文字隐藏

### 7.2 Input 输入框

| 属性 | 值 |
|------|-----|
| 高度 | 48px |
| 水平内边距 | 16px |
| 圆角 | `radius-md` (8px) |
| 边框 | 1px solid `gray-300` |
| 背景 | `bg-page` |
| 字号 | 16px |
| 占位符颜色 | `gray-400` |

#### 状态

| 状态 | 边框 | 阴影 |
|------|------|------|
| **Default** | `gray-300` | 无 |
| **Focus** | `primary-500` | `0 0 0 3px rgba(255,64,129,0.15)` |
| **Error** | `error` | `0 0 0 3px rgba(244,67,54,0.15)` |
| **Disabled** | `gray-200` | 无，背景 `gray-100` |

### 7.3 Card 卡片

#### 发现卡片（Profile Card）

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │                       │  │
│  │      照片区域          │  │  ← 宽高比 3:4，圆角 radius-xl
│  │   (支持滑动切换)       │  │
│  │                       │  │
│  └───────────────────────┘  │
│  姓名, 年龄                   │  ← H3 + primary-500 徽章
│  📍 位置  💼 职业             │  ← Caption + 图标
│  个人简介文字...              │  ← Body Small，2行截断
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │  ❌  │ │  💙  │ │  ⭐  │  │  ← 操作按钮行
│  └─────┘ └─────┘ └─────┘  │
└─────────────────────────────┘
```

| 属性 | 值 |
|------|-----|
| 宽度 | 100%（移动端），max-width 400px（桌面端）|
| 照片圆角 | `radius-xl` (16px) |
| 卡片圆角 | `radius-2xl` (20px) |
| 卡片阴影 | `shadow-lg` |
| 卡片背景 | `bg-card` |
| 内边距 | 16px |
| 照片指示器 | 底部小圆点，当前项 `primary-500`，其他 `gray-300` |

#### 列表卡片（Match List Item）

| 属性 | 值 |
|------|-----|
| 高度 | 72px |
| 头像 | 48px × 48px，`radius-full` |
| 内边距 | `px-4 py-3` |
| 分割线 | 底部 1px `gray-200` |
| 未读标记 | 右上角 8px 红点 |

### 7.4 Avatar 头像

| 尺寸 | 大小 | 用途 |
|------|------|------|
| **xs** | 24px | 消息气泡内 |
| **sm** | 32px | 列表项 |
| **md** | 48px | 标准头像 |
| **lg** | 64px | 个人资料页 |
| **xl** | 96px | 个人资料顶部 |
| **2xl** | 128px | 匹配成功弹窗 |

| 状态 | 样式 |
|------|------|
| **在线** | 右下角 10px 绿点 (`success`)，边框 2px 白色 |
| **离线** | 无标记 |
| **故事中** | 外圈 2px `primary-500` 渐变环 |

### 7.5 Badge 徽章

| 变体 | 背景 | 文字 | 用途 |
|------|------|------|------|
| **primary** | `primary-500` | 白色 | 主标签 |
| **secondary** | `secondary-500` | 白色 | 次标签 |
| **outline** | 透明 | `primary-500` | 边框标签 |
| **ghost** | `gray-100` | `gray-700` | 中性标签 |
| **success** | `success` | 白色 | 成功状态 |
| **warning** | `warning` | 白色 | 警告状态 |
| **error** | `error` | 白色 | 错误状态 |

| 属性 | 值 |
|------|-----|
| 高度 | 20px |
| 水平内边距 | 8px |
| 圆角 | `radius-sm` (4px) |
| 字号 | 11px |

### 7.6 Tag 标签

与 Badge 类似，但更轻量：

| 属性 | 值 |
|------|-----|
| 背景 | `gray-100` |
| 文字 | `gray-600` |
| 圆角 | `radius-md` (8px) |
| 内边距 | 6px 12px |
| 可删除 | 右侧带 `X` 图标 |

### 7.7 Modal 弹窗

| 属性 | 值 |
|------|-----|
| 遮罩 | `bg-overlay` |
| 背景 | `bg-elevated` |
| 圆角 | `radius-3xl` (24px) |
| 阴影 | `shadow-xl` |
| 宽度 | 90%，max-width 360px |
| 内边距 | 24px |
| 动画 | `matchCelebration.modal` |

### 7.8 Toast 轻提示

| 属性 | 值 |
|------|-----|
| 位置 | 顶部居中，距顶 64px |
| 背景 | `gray-900`（Light）/ `gray-100`（Dark）|
| 文字 | 白色（Light）/ `gray-900`（Dark）|
| 圆角 | `radius-lg` (12px) |
| 阴影 | `shadow-lg` |
| 内边距 | 12px 20px |
| 动画 | 滑入 `y: -20 → 0`，停留 3s，滑出 |
| 图标 | 左侧状态图标（成功/错误/信息）|

---

## 8. 页面结构规范（Layout System）

### 8.1 布局网格

```
┌─────────────────────────────┐
│     状态栏（系统）           │  ← 24-44px，透明
├─────────────────────────────┤
│  ┌─────┐  页面标题    ┌───┐ │  ← 高度 56px
│  │返回 │            │ ⋮ │ │
│  └─────┘            └───┘ │
├─────────────────────────────┤
│                             │
│        内容区域              │  ← 可滚动
│     （安全区域内）            │
│                             │
│                             │
├─────────────────────────────┤
│  🏠    🔍    💬    👤      │  ← 底部导航，高度 64px + safe-area
│  首页   发现   消息   我的   │
└─────────────────────────────┘
```

### 8.2 安全区域

```css
/* 顶部安全区 */
--safe-area-top: env(safe-area-inset-top);
/* 底部安全区 */
--safe-area-bottom: env(safe-area-inset-bottom);
```

```tsx
// React 组件中使用
<div className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
```

### 8.3 导航栏（Header）

| 属性 | 值 |
|------|-----|
| 高度 | 56px |
| 背景 | `bg-page` + 底部 1px `gray-200` |
| 标题对齐 | 居中 |
| 标题样式 | H3 |
| 左侧 | 返回按钮（条件显示）|
| 右侧 | 操作按钮/菜单 |
| 固定 | `sticky top-0 z-50` |

### 8.4 底部导航栏（Tab Bar）

| 属性 | 值 |
|------|-----|
| 高度 | 64px + safe-area-bottom |
| 背景 | `bg-card` + 顶部 1px `gray-200` |
| 固定 | `fixed bottom-0 z-50` |
| 图标尺寸 | 24px |
| 文字尺寸 | 12px |
| 未选中 | `gray-400` |
| 选中 | `primary-500` |
| 动画 | 图标 `scale(1.1)` + 文字颜色过渡 |

### 8.5 内容区域

| 属性 | 值 |
|------|-----|
| 最小高度 | `100vh - 56px - 64px` |
| 水平内边距 | `px-4` (16px) |
| 滚动行为 | `overflow-y-auto` + `-webkit-overflow-scrolling: touch` |
| 下拉刷新 | 顶部 64px 弹性区域 |

### 8.6 空状态（Empty State）

```
┌─────────────────────────────┐
│                             │
│         ┌─────────┐          │
│         │  大图标  │          │  ← 48-64px，gray-300
│         └─────────┘          │
│                             │
│        标题文字              │  ← H3，gray-700
│      辅助说明文字             │  ← Body Small，gray-500
│                             │
│    ┌─────────────────┐      │
│    │    操作按钮      │      │  ← primary 按钮
│    └─────────────────┘      │
│                             │
└─────────────────────────────┘
```

---

## 9. 页面特定规范

### 9.1 首页 Landing

- **背景**：`bg-gradient-start` → `bg-gradient-end` 对角渐变
- **Logo**：居中，白色，64px
- **标题**：Display 尺寸，白色，居中
- **副标题**：Body，白色 80% 透明度
- **按钮组**：纵向排列，间距 16px
  - 主按钮：白色背景，`primary-500` 文字
  - 次按钮：透明背景，白色边框，白色文字

### 9.2 发现页 Discover

- **卡片堆叠**：最多显示 3 张卡片，后面卡片缩小 + 降低透明度
- **卡片间距**：后一张卡片偏移 8px 向下，缩放 95%
- **滑动阈值**：水平偏移 > 100px 触发喜欢/不喜欢
- **操作按钮行**：底部固定，3 个圆形按钮
  - 不喜欢：白色背景，`error` 图标，shadow-md
  - 喜欢：`love` 背景，白色图标，shadow-lg
  - 超级喜欢：`warning` 背景，白色图标，shadow-md

### 9.3 聊天页 Chat

- **消息气泡**：
  - 自己：右侧，`primary-500` 背景，白色文字，`radius-lg` 左下直角
  - 对方：左侧，`gray-100` 背景，`gray-800` 文字，`radius-lg` 右下直角
- **时间戳**：居中，`gray-400`，12px
- **输入框**：底部固定，高度 56px，带 `Send` 按钮
- **键盘适配**：输入框随键盘上推

### 9.4 个人资料页 Profile

- **封面**：顶部照片区域，高度 40vh，渐变遮罩
- **头像**：底部重叠，96px，`border-4 white`，`shadow-lg`
- **信息区**：居中对齐，姓名 + 年龄 + 位置
- **标签组**：横向滚动，间距 8px
- **照片墙**：2 列网格，间距 8px，圆角 `radius-lg`

---

## 10. 暗色模式（Dark Mode）

### 10.1 切换方式

```tsx
// 使用 Tailwind dark mode
// tailwind.config.js
darkMode: 'class',

// 切换逻辑
document.documentElement.classList.toggle('dark');
```

### 10.2 关键变化

| 元素 | Light | Dark |
|------|-------|------|
| 页面背景 | `#FFFFFF` | `#121212` |
| 卡片背景 | `#FFFFFF` | `#1E1E1E` |
| 主文字 | `#424242` | `#E0E0E0` |
| 边框 | `#E0E0E0` | `#3D3D3D` |
| 占位符 | `#BDBDBD` | `#616161` |
| 主色 | `#FF4081` | `#FF4081`（不变）|
| 阴影 | 黑色透明度 | 降低透明度 |

### 10.3 图片适配

- 暗色模式下图片区域增加轻微遮罩：`linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))`
- 头像边框保持白色（在暗色中更突出）

---

## 11. 响应式断点

| 断点 | 宽度 | 布局变化 |
|------|------|---------|
| **xs** | < 375px | 最小屏适配，减小间距 |
| **sm** | >= 640px | 手机横屏 |
| **md** | >= 768px | 平板，卡片宽度 400px 居中 |
| **lg** | >= 1024px | 桌面端，左右分栏 |
| **xl** | >= 1280px | 大屏，最大内容宽 1200px |

---

## 12. Z-Index 层级

| 层级 | Z-Index | 用途 |
|------|---------|------|
| 背景 | 0 | 页面内容 |
| 内容 | 10 | 滚动内容 |
| 粘性头部 | 50 | 导航栏 |
| 底部导航 | 50 | Tab bar |
| 下拉菜单 | 100 | 下拉面板 |
| 遮罩层 | 200 | 半透明背景 |
| 弹窗 | 300 | Modal/Dialog |
| Toast | 400 | 轻提示 |
| 加载层 | 500 | 全屏加载 |

---

## 13. 设计 Token 汇总（Tailwind 配置参考）

```javascript
// tailwind.config.js 扩展
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF0F5', 100: '#FFD6E8', 200: '#FFADD1',
          300: '#FF85BA', 400: '#FF5DA3', 500: '#FF4081',
          600: '#E91E63', 700: '#C2185B', 800: '#AD1457', 900: '#880E4F',
        },
        secondary: {
          50: '#F3E5F5', 100: '#E1BEE7', 500: '#9C27B0',
          600: '#8E24AA', 700: '#7B1FA2',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        love: '#E91E63',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px', 'md': '8px', 'lg': '12px',
        'xl': '16px', '2xl': '20px', '3xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255,64,129,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
};
```

---

## 附录 A：中文文案规范

| 英文原文 | 中文替换 |
|---------|---------|
| "Its a Match!" | "匹配成功！" |
| "Loading..." | "加载中..." |
| "No more profiles" | "没有更多推荐啦" |
| "Send a message" | "发送消息" |
| "Edit Profile" | "编辑资料" |
| "Settings" | "设置" |
| "Log Out" | "退出登录" |
| "Matches" | "匹配" |
| "Discover" | "发现" |
| "Messages" | "消息" |
| "Profile" | "我的" |
| "Like" | "喜欢" |
| "Nope" | "不喜欢" |
| "Super Like" | "超级喜欢" |
| "Online" | "在线" |
| "Offline" | "离线" |

---

*文档版本：v1.0*  
*最后更新：2026-05-08*  
*维护人：Agent-Design*
