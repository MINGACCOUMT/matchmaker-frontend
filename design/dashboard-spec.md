# 心动 App - 登录后首页 (Dashboard) 设计规范

> 版本: v1.0  
> 日期: 2026-05-09  
> 对应页面: `/dashboard` (登录后首页)  
> 技术栈: React 19 + Vite + TailwindCSS 3 + Framer Motion + lucide-react

---

## 1. 设计概述

### 1.1 设计目标
为「心动」相亲交友 App 设计一个登录后的首页 Dashboard，汇总用户的核心数据、快捷入口、每日推荐和最近匹配，作为用户登录后的第一站，而非直接进入 Discover 卡片滑动页面。

### 1.2 设计原则
- **温暖浪漫**: 以粉红品牌色点缀，营造婚恋社交的温馨氛围
- **信息聚合**: 一屏展示核心数据，减少用户跳转成本
- **微交互丰富**: 悬停、点击、脉冲动画提升情感化体验
- **移动端优先**: 所有设计基于 430px 宽度容器（max-w-md）

---

## 2. 色彩系统

### 2.1 品牌色
| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `primary-500` | `#FF4081` | `#FF4081` | 主按钮、高亮、图标、徽标 |
| `primary-50` | `#FFF0F5` | `#FF4081` / 20% opacity | 浅粉背景、hover 态 |
| `secondary-500` | `#9C27B0` | `#9C27B0` | 辅助色、渐变终点、匹配相关 |
| `secondary-50` | `#F3E5F5` | `#9C27B0` / 20% opacity | 浅紫背景 |

### 2.2 中性色
| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| 页面背景 | `#F8F9FA` | `#0F0F0F` | 页面底层背景 |
| 卡片背景 | `#FFFFFF` | `#1A1A1A` | 卡片、浮层背景 |
| 主文字 | `#111827` | `#FFFFFF` | 标题、重要文字 |
| 次文字 | `#6B7280` | `#9CA3AF` | 描述、辅助文字 |
| 边框 | `#F3F4F6` | `#374151` | 分割线、卡片边框 |

### 2.3 功能色
| 颜色 | Hex | 用途 |
|------|-----|------|
| 绿色 | `#22C55E` | 在线状态、成功提示 |
| 橙色 | `#F97316` | 消息中心图标背景 |
| 青色 | `#14B8A6` | 完善资料图标背景 |
| 红色 | `#EF4444` | 未读徽标、紧急提示 |

---

## 3. 字体系统

### 3.1 字体栈
```css
font-family: 'Noto Sans SC', system-ui, -apple-system, sans-serif;
```

### 3.2 字号规范
| 级别 | 大小 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| Display | 24px | 700 | 1.2 | 大数字统计 |
| H1 | 18px | 700 | 1.4 | 页面标题、区块标题 |
| H2 | 16px | 600 | 1.4 | 卡片标题 |
| Body | 14px | 400 | 1.5 | 正文、描述 |
| Caption | 12px | 400 | 1.4 | 辅助说明、标签 |
| Micro | 10px | 500 | 1.2 | 徽标文字、底部导航 |

---

## 4. 间距系统

基于 4px 网格：

| Token | 值 | 用途 |
|-------|-----|------|
| `space-1` | 4px | 图标与文字间距、紧凑内边距 |
| `space-2` | 8px | 小元素间距 |
| `space-3` | 12px | 卡片内边距、按钮间距 |
| `space-4` | 16px | 区块间距、页面水平边距 |
| `space-5` | 20px | 大区块间距 |
| `space-6` | 24px | 模块间大间距 |

### 圆角规范
| Token | 值 | 用途 |
|-------|-----|------|
| `rounded-lg` | 8px | 小按钮、标签 |
| `rounded-xl` | 12px | 统计卡片、按钮 |
| `rounded-2xl` | 16px | 大卡片、快捷入口 |
| `rounded-full` | 9999px | 头像、圆形按钮 |

---

## 5. 阴影系统

### 5.1 Light Mode
```css
box-shadow: 0 2px 12px rgba(255, 64, 129, 0.08), 
            0 1px 4px rgba(0, 0, 0, 0.04);
```

### 5.2 Dark Mode
```css
box-shadow: 0 2px 12px rgba(255, 64, 129, 0.12), 
            0 1px 4px rgba(0, 0, 0, 0.3);
```

### 5.3 Hover 增强阴影
```css
box-shadow: 0 4px 20px rgba(255, 64, 129, 0.15), 
            0 2px 8px rgba(0, 0, 0, 0.06);
```

---

## 6. 组件规范

### 6.1 Header 顶部栏
- **高度**: 56px
- **背景**: `bg-white/80 dark:bg-[#1A1A1A]/80` + `backdrop-blur-xl`
- **边框**: 底部 1px `border-gray-100 dark:border-gray-800`
- **定位**: `sticky top-0 z-50`
- **内容**: 左侧头像(40px) + 昵称/问候语，右侧通知铃铛图标 + 未读红点

### 6.2 快捷入口区 (QuickActions)
- **布局**: 4 列网格 `grid-cols-4`
- **间距**: `gap-3`
- **单个按钮**:
  - 尺寸: 自适应宽度，垂直 flex 布局
  - 图标容器: 48px × 48px，圆角 12px，渐变背景
  - 文字: 12px，字重 500，居中对齐
  - 背景: 白色卡片 + card-shadow
  - 交互: hover `scale(1.05)`, active `scale(0.95)`

#### 图标配色映射
| 入口 | 渐变起点 | 渐变终点 | 图标 |
|------|---------|---------|------|
| 每日推荐 | `#FF6B9D` | `#FF4081` | Heart |
| 我的匹配 | `#AB47BC` | `#9C27B0` | Users |
| 消息中心 | `#FFB74D` | `#F97316` | MessageCircle |
| 完善资料 | `#4DB6AC` | `#14B8A6` | User |

### 6.3 统计卡片 (StatCards)
- **布局**: 3 列网格 `grid-cols-3`
- **间距**: `gap-3`
- **卡片样式**:
  - 背景: 白色/深色卡片
  - 圆角: 16px
  - 内边距: 16px
  - 阴影: card-shadow
- **内部结构**:
  - 顶部: 图标(32px容器) + 增长标签(右上角badge)
  - 中部: 数字 24px bold
  - 底部: 描述 12px 灰色
- **交互**: hover `translateY(-2px)` + 增强阴影

### 6.4 推荐用户卡片 (RecommendCard)
- **尺寸**: 固定宽度 200px，高度自适应
- **布局**: 横向滚动容器 `overflow-x-auto`
- **图片区**: 高度 220px，底部渐变遮罩
- **信息浮层**: 绝对定位底部，白色文字
  - 昵称 + VIP/在线 badge
  - 年龄/职业/城市
- **匹配度标签**: 右上角，白色背景 + 毛玻璃，粉色文字
- **底部操作区**:
  - 左侧: 兴趣标签 (10px 圆角 pill)
  - 右侧: 心形喜欢按钮 (32px 圆形，primary-500)
- **交互**: hover `scale(1.03)` + 增强阴影

### 6.5 最近匹配区 (RecentMatches)
- **布局**: 单行卡片，内部 flex
- **头像组**: 重叠头像 `-space-x-3`，每个 48px
  - 外圈: 渐变边框 avatar-ring
  - 状态指示: 右下角 14px 圆点 (绿色在线/灰色离线)
- **文字区**: 标题 + 描述
- **操作按钮**: "打招呼" primary 按钮，圆角 12px

### 6.6 底部导航 (BottomNav)
- **高度**: 64px + safe-area-inset-bottom
- **背景**: 白色/深色 + 毛玻璃 + 顶部边框
- **定位**: `fixed bottom-0`
- **项目**: 4 个等分，垂直 flex (图标 + 文字)
- **激活态**: 粉色图标 + 粉色文字 + 浅粉背景
- **未激活**: 灰色图标 + 灰色文字
- **消息徽标**: 右上角 16px 圆形，primary-500 背景，白色数字

---

## 7. 动效规范

### 7.1 入场动画 (Framer Motion)
```typescript
// 页面入场
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  }
};

// 卡片 stagger
const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
  }
};
```

### 7.2 微交互
| 元素 | 触发 | 效果 | 时长 |
|------|------|------|------|
| 快捷入口按钮 | hover | scale(1.05) | 200ms |
| 快捷入口按钮 | active | scale(0.95) | 100ms |
| 统计卡片 | hover | translateY(-2px) + 阴影增强 | 300ms |
| 推荐卡片 | hover | scale(1.03) + 阴影增强 | 300ms |
| 喜欢按钮 | click | scale(0.9) → scale(1.1) → scale(1) | 400ms |
| 通知红点 | 持续 | pulse 动画 (opacity + scale) | 2000ms 循环 |
| 心形 emoji | 持续 | heartFloat (translateY) | 3000ms 循环 |

### 7.3 过渡曲线
- 标准: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- 弹性: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce)

---

## 8. 布局规范

### 8.1 页面结构
```
┌─────────────────────────────┐  ← max-w-md mx-auto
│  Header (sticky, 56px)        │
├─────────────────────────────┤
│  Quick Actions (4 cols)       │
├─────────────────────────────┤
│  Stat Cards (3 cols)          │
├─────────────────────────────┤
│  Daily Recommend (horizontal)   │
├─────────────────────────────┤
│  Recent Matches               │
├─────────────────────────────┤
│  BottomNav (fixed, 64px+)     │
└─────────────────────────────┘
```

### 8.2 安全区域
- 顶部: 状态栏高度由 sticky header 自动处理
- 底部: `env(safe-area-inset-bottom)` 适配 iPhone 刘海
- 水平边距: 16px (px-4)

---

## 9. Dark Mode 策略

### 9.1 切换方式
- 使用 Tailwind `class` 策略
- 通过 `document.documentElement.classList.toggle('dark')` 切换
- 用户偏好持久化到 localStorage

### 9.2 映射规则
| Light | Dark |
|-------|------|
| `#FFFFFF` 卡片 | `#1A1A1A` 卡片 |
| `#F8F9FA` 背景 | `#0F0F0F` 背景 |
| `#111827` 文字 | `#FFFFFF` 文字 |
| `#6B7280` 次要文字 | `#9CA3AF` 次要文字 |
| `#F3F4F6` 边框 | `#374151` 边框 |
| 粉色阴影 8% | 粉色阴影 12% |
| 黑色阴影 4% | 黑色阴影 30% |

---

## 10. 响应式说明

本页面为移动端专属，容器固定 `max-w-md` (448px)。在桌面端浏览时：
- 页面居中显示
- 两侧留灰色背景 `#E5E7EB` (dark: `#111827`)
- 内容区域保持移动端比例

---

## 11. 图标映射 (lucide-react)

| 位置 | 图标名称 | 尺寸 |
|------|---------|------|
| 通知铃铛 | `Bell` | 20px |
| 每日推荐 | `Heart` | 24px |
| 我的匹配 | `Users` | 24px |
| 消息中心 | `MessageCircle` | 24px |
| 完善资料 | `User` | 24px |
| 浏览统计 | `Eye` | 16px |
| 匹配统计 | `Heart` | 16px |
| 消息统计 | `MessageCircle` | 16px |
| 底部首页 | `Home` | 24px |
| 底部发现 | `Search` | 24px |
| 底部消息 | `MessageCircle` | 24px |
| 底部我的 | `User` | 24px |
| 查看更多箭头 | `ChevronRight` | 16px |
| 喜欢按钮 | `Heart` | 16px |

---

## 12. 图片资源

### 12.1 头像图片
- 用户头像: 100×100px，圆形裁剪
- 推荐卡片图片: 400×500px，面部居中裁剪
- 格式: WebP (优先) / JPEG
- 加载: 懒加载 + 模糊占位

### 12.2 占位策略
```html
<img 
  src="image.webp" 
  loading="lazy"
  class="w-full h-full object-cover"
  alt="用户头像"
/>
```

---

## 13. 交付物清单

| 文件 | 路径 | 说明 |
|------|------|------|
| 设计图 | `/data/workspace/matchmaker-frontend/design/dashboard-design.png` | 高保真渲染图 (860×2200px @2x) |
| HTML 原型 | `/data/workspace/matchmaker-frontend/design/dashboard-design.html` | 可直接浏览器预览，含 dark mode 切换 |
| 设计规范 | `/data/workspace/matchmaker-frontend/design/dashboard-spec.md` | 本文档 |

---

## 14. 实现建议

### 14.1 组件拆分建议
```
src/pages/Dashboard/
├── index.tsx              # 页面入口
├── Header.tsx             # 顶部栏
├── QuickActions.tsx       # 快捷入口
├── StatCards.tsx          # 统计卡片
├── DailyRecommend.tsx     # 每日推荐
├── RecentMatches.tsx      # 最近匹配
└── BottomNav.tsx          # 底部导航 (复用现有)
```

### 14.2 状态管理
- 用户数据: React Context / Zustand
- 统计数据: SWR / React Query 轮询
- 未读消息: WebSocket 实时推送

### 14.3 性能优化
- 推荐卡片图片使用 `loading="lazy"`
- 统计数字使用 `CountUp` 动画增强
- 底部导航使用 `will-change: transform`
- 头像使用 `decoding="async"`

---

*本规范由 Agent-Design 编制，供前端开发参考使用。*
