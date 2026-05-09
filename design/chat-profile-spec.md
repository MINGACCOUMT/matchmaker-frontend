# 心动 App - 消息 & 个人资料模块 设计规范

> 版本: v1.0  
> 日期: 2026-05-09  
> 对应页面: `ChatList.tsx` / `ChatDetail.tsx` / `Profile.tsx`  
> 技术栈: React 19 + Vite + TailwindCSS 3 + Framer Motion + lucide-react  
> 前置规范: `/data/workspace/matchmaker-frontend/design/dashboard-spec.md`

---

## 1. 设计概述

### 1.1 设计目标
为「心动」App 重新设计「消息」和「我的」两大核心模块，与 Dashboard 首页保持统一的设计语言，提升整体视觉品质与用户体验。

### 1.2 模块清单
| 模块 | 页面 | 文件 | 说明 |
|------|------|------|------|
| 消息列表 | ChatList | `chatlist-design.html` | 会话列表、未读徽标、消息预览 |
| 聊天详情 | ChatDetail | `chatdetail-design.html` | 聊天气泡、输入框、图片消息 |
| 个人资料 | Profile | `profile-design.html` | 头像区、资料卡、兴趣标签、设置 |

---

## 2. 色彩系统（继承 Dashboard 规范）

沿用 Dashboard 设计规范中的完整色彩系统，本节仅补充模块专属色彩用法。

### 2.1 消息模块专属
| 元素 | Light | Dark | 说明 |
|------|-------|------|------|
| 自己消息气泡 | `#FF4081` | `#FF4081` | 品牌粉色，白色文字 |
| 对方消息气泡 | `#FFFFFF` | `#1A1A1A` | 白色/深色卡片背景 |
| 已读标记 | `#FF4081` | `#FF4081` | 单勾灰色，双勾粉色 |
| 时间分隔 | `#F3F4F6` | `#374151` | 圆角 pill 背景 |
| 输入框背景 | `#F3F4F6` | `#374151` | 圆角全圆输入框 |

### 2.2 个人资料模块专属
| 元素 | Light | Dark | 说明 |
|------|-------|------|------|
| 顶部背景 | `linear-gradient(135deg, #FF4081, #9C27B0)` | 同左 | 粉紫渐变装饰区 |
| 统计数字-获赞 | `#FF4081` | `#FF4081` | primary-500 |
| 统计数字-匹配 | `#9C27B0` | `#9C27B0` | secondary-500 |
| 统计数字-访客 | `#F59E0B` | `#F59E0B` | amber-500 |
| 退出登录 | `#EF4444` | `#EF4444` | 红色警示 |

---

## 3. 消息列表页 (ChatList) 组件规范

### 3.1 页面结构
```
┌─────────────────────────────┐
│  Header (sticky)              │ ← 标题"消息" + 搜索 + 通知
├─────────────────────────────┤
│  会话列表 (垂直滚动)            │
│  ├─ 头像 + 在线状态             │
│  ├─ 昵称 + 时间                │
│  ├─ 最后消息预览               │
│  └─ 未读徽标 / 已读标记         │
├─────────────────────────────┤
│  BottomNav (fixed)            │ ← "消息" 激活态
└─────────────────────────────┘
```

### 3.2 Header 规范
- 与 Dashboard Header 保持一致
- 标题: "消息"，18px bold
- 右侧: 搜索图标 + 通知铃铛（带脉冲红点）

### 3.3 会话项 (ChatItem)
- **布局**: flex 横向，gap-3
- **内边距**: px-4 py-3.5
- **分隔**: 底部 1px `border-gray-100 dark:border-gray-800`
- **交互**: hover `bg-primary-500/4`, active `bg-primary-500/8`
- **动画**: slideIn 入场，stagger 0.05s

#### 会话项内部结构
| 区域 | 规范 |
|------|------|
| 头像 | 48px 圆形，avatar-ring 渐变边框，右下角 14px 在线状态点 |
| 昵称 | 14px semibold，单行截断 |
| 时间 | 12px，未读时 `text-primary-500`，已读时 `text-gray-400` |
| 消息预览 | 14px，单行截断，未读 `text-gray-600`，已读 `text-gray-500` |
| 未读徽标 | 20px 圆形，`bg-primary-500`，白色 10px 数字 |
| 已读标记 | 16px 对勾图标，`text-gray-400` |

### 3.4 空状态（预留）
- 居中显示大图标 + 文案
- 图标: MessageCircle, 48px, `text-gray-300`
- 文案: "还没有消息哦，去发现页遇见更多人吧～"
- CTA: "去发现" primary 按钮

---

## 4. 聊天详情页 (ChatDetail) 组件规范

### 4.1 页面结构
```
┌─────────────────────────────┐
│  Header (sticky)              │ ← 返回 + 头像 + 昵称 + 在线状态 + 更多
├─────────────────────────────┤
│  消息区 (垂直滚动，flex-1)      │
│  ├─ 时间分隔线                 │
│  ├─ 对方消息 (左对齐)          │
│  │   └─ 头像 + 气泡 + 时间      │
│  └─ 自己消息 (右对齐)          │
│      └─ 气泡 + 时间 + 已读标记   │
├─────────────────────────────┤
│  输入区 (sticky bottom)        │ ← 图片按钮 + 输入框 + 发送按钮
└─────────────────────────────┘
```

### 4.2 Header 规范
- 左侧: 返回箭头按钮（36px 触摸区）
- 中部: 对方头像(36px) + 昵称(14px bold) + 在线状态(12px green)
- 右侧: 更多菜单按钮（竖三点）

### 4.3 消息气泡规范

#### 对方消息（左对齐）
```
┌────────┐ ┌────────────────────┐
│ 头像   │ │ 消息内容            │
│(32px)  │ │                    │
└────────┘ └────────────────────┘
           14:21
```
- 气泡: `bg-white dark:bg-[#1A1A1A]`
- 圆角: `border-radius: 16px 16px 16px 4px`（左下尖角）
- 内边距: px-3.5 py-2.5
- 文字: 14px, `text-gray-800 dark:text-gray-100`
- 时间: 10px, `text-gray-400`, 位于气泡左下方

#### 自己消息（右对齐）
```
┌────────────────────┐ ┌────────┐
│ 消息内容            │ │ 头像   │
│                    │ │(32px)  │
└────────────────────┘ └────────┘
           14:23 ✓
```
- 气泡: `bg-primary-500`
- 圆角: `border-radius: 16px 16px 4px 16px`（右下尖角）
- 内边距: px-3.5 py-2.5
- 文字: 14px, 白色
- 阴影: `shadow-lg shadow-primary-500/20`
- 时间 + 已读: 10px, 右对齐，对勾图标 12px

### 4.4 时间分隔线
- 样式: 圆角 pill，背景 `bg-gray-100 dark:bg-gray-800`
- 文字: 12px, `text-gray-400`
- 内容格式: "今天 14:20" / "昨天" / "2026-05-01"

### 4.5 图片消息
- 气泡内嵌图片，宽度 70%，高度自适应
- 圆角继承气泡圆角
- 点击可预览（预留）

### 4.6 输入区规范
- **背景**: `bg-white/90 dark:bg-[#1A1A1A]/90` + backdrop-blur
- **边框**: 顶部 1px
- **布局**: flex 横向，gap-2
- **图片按钮**: 40px 圆形，hover 背景变化
- **输入框**: 
  - 背景 `bg-gray-100 dark:bg-gray-800`
  - 圆角全圆
  - 文字 14px
  - focus ring: `ring-2 ring-primary-500/50`
- **发送按钮**: 
  - 40px 圆形，`bg-primary-500`
  - 白色纸飞机图标
  - 阴影: `shadow-lg shadow-primary-500/30`

---

## 5. 个人资料页 (Profile) 组件规范

### 5.1 页面结构
```
┌─────────────────────────────┐
│  渐变背景装饰区 (h-48)        │ ← 粉紫渐变 + 圆形装饰
│  ├─ 设置按钮 (右上角)          │
├─────────────────────────────┤
│  头像卡片区 (-mt-16 叠加)      │
│  ├─ 大图头像 (88px)           │
│  ├─ 昵称 + ID + VIP 徽标       │
│  └─ 个性签名                   │
├─────────────────────────────┤
│  数据统计 (3 列)               │
├─────────────────────────────┤
│  基本资料卡片                  │
│  ├─ 年龄 / 性别 / 城市 / 职业   │
├─────────────────────────────┤
│  兴趣标签区                    │
├─────────────────────────────┤
│  设置入口列表                  │
│  ├─ 编辑资料 / 隐私 / 通知      │
│  ├─ 帮助 / 退出登录            │
├─────────────────────────────┤
│  BottomNav (fixed)            │ ← "我的" 激活态
└─────────────────────────────┘
```

### 5.2 顶部渐变背景区
- **高度**: 192px (h-48)
- **背景**: `linear-gradient(135deg, #FF4081 0%, #9C27B0 100%)`
- **装饰**: 半透明白色圆形 SVG，营造浪漫氛围
- **设置按钮**: 右上角，白色半透明背景 + 毛玻璃

### 5.3 头像卡片区
- **定位**: 负 margin `-mt-16` 叠加在渐变区上
- **卡片**: 白色/深色圆角卡片，card-shadow
- **头像**: 88px，avatar-ring 渐变边框，负 margin 突出卡片
- **昵称**: 18px bold
- **ID + VIP**: 12px 灰色 + VIP badge (primary-500 背景)
- **签名**: 14px，最多 2 行

### 5.4 数据统计区
- **布局**: 3 列网格
- **卡片**: 与 Dashboard StatCards 一致
- **数字**: 24px bold，分别使用 primary/secondary/amber
- **标签**: 12px 灰色

### 5.5 基本资料卡片
- **布局**: 2×2 网格
- **每项**: 图标(32px容器) + 标签(12px灰色) + 值(14px medium)
- **图标配色**: 年龄-primary / 性别-secondary / 城市-amber / 职业-teal

### 5.6 兴趣标签区
- **布局**: flex wrap
- **标签样式**: 
  - 圆角 pill (rounded-full)
  - 背景: 对应颜色的 50 色调 (light) / 900/30 (dark)
  - 文字: 对应颜色的 600 (light) / 300 (dark)
  - 字号: 12px medium
  - 内边距: px-3 py-1.5
- **示例标签**: 📸 摄影 / ✈️ 旅行 / 🎨 绘画 / 🧘 瑜伽 / 🎵 音乐 / 📚 阅读 / ☕ 咖啡

### 5.7 设置入口列表
- **容器**: 白色/深色圆角卡片
- **每项**: flex 横向，gap-3，内边距 py-3.5
- **结构**: 图标区(36px圆角) + 文字区(标题+描述) + 右箭头
- **图标配色**: 
  - 编辑资料: primary
  - 隐私设置: secondary
  - 通知设置: amber
  - 帮助反馈: teal
  - 退出登录: red (文字也红色)
- **分隔**: 底部 1px 边框，最后一项无分隔
- **交互**: hover `bg-primary-500/4`, active `bg-primary-500/8`

---

## 6. 动效规范

### 6.1 消息列表入场
```typescript
const chatItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  })
};
```

### 6.2 消息气泡入场
```typescript
const messageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }
};
```

### 6.3 发送按钮交互
- hover: `bg-primary-600`
- active: `scale(0.95)`
- 发送成功: 纸飞机图标向右位移 + 淡出动画

### 6.4 个人资料页
- 统计卡片: hover `translateY(-2px)` + 阴影增强
- 设置项: hover `bg-primary-500/4`
- 头像区: 页面入场时头像 `scale(0.9) → scale(1)` 弹性动画

---

## 7. 图标映射 (lucide-react)

### 7.1 消息模块
| 位置 | 图标 | 尺寸 |
|------|------|------|
| 搜索 | `Search` | 20px |
| 通知 | `Bell` | 20px |
| 返回 | `ChevronLeft` | 20px |
| 更多菜单 | `MoreVertical` | 20px |
| 图片发送 | `Image` | 20px |
| 发送按钮 | `Send` | 20px |
| 已读标记 | `Check` | 12px |

### 7.2 个人资料模块
| 位置 | 图标 | 尺寸 |
|------|------|------|
| 设置 | `Settings` | 20px |
| 编辑资料 | `Edit3` | 20px |
| 隐私 | `Lock` | 20px |
| 通知 | `Bell` | 20px |
| 帮助 | `HelpCircle` | 20px |
| 退出 | `LogOut` | 20px |
| 年龄 | `Clock` | 16px |
| 性别 | `User` | 16px |
| 城市 | `MapPin` | 16px |
| 职业 | `Zap` | 16px |
| 右箭头 | `ChevronRight` | 16px |

---

## 8. Dark Mode 映射补充

| 元素 | Light | Dark |
|------|-------|------|
| 自己消息气泡 | `#FF4081` | `#FF4081` (保持不变) |
| 对方消息气泡 | `#FFFFFF` | `#1A1A1A` |
| 消息文字(对方) | `#1F2937` | `#F3F4F6` |
| 输入框背景 | `#F3F4F6` | `#374151` |
| 时间分隔背景 | `#F3F4F6` | `#374151` |
| 资料卡片背景 | `#FFFFFF` | `#1A1A1A` |
| 兴趣标签背景 | `*-50` | `*-900/30` |
| 兴趣标签文字 | `*-600` | `*-300` |
| 设置项 hover | `bg-primary-500/4` | `bg-primary-500/4` |

---

## 9. 交付物清单

| 文件 | 路径 | 说明 |
|------|------|------|
| 消息列表设计图 | `/data/workspace/matchmaker-frontend/design/chatlist-design.png` | 高保真渲染图 |
| 消息列表原型 | `/data/workspace/matchmaker-frontend/design/chatlist-design.html` | 可浏览器预览 |
| 聊天详情设计图 | `/data/workspace/matchmaker-frontend/design/chatdetail-design.png` | 高保真渲染图 |
| 聊天详情原型 | `/data/workspace/matchmaker-frontend/design/chatdetail-design.html` | 可浏览器预览 |
| 个人资料设计图 | `/data/workspace/matchmaker-frontend/design/profile-design.png` | 高保真渲染图 |
| 个人资料原型 | `/data/workspace/matchmaker-frontend/design/profile-design.html` | 可浏览器预览 |
| 设计规范 | `/data/workspace/matchmaker-frontend/design/chat-profile-spec.md` | 本文档 |

---

## 10. 实现建议

### 10.1 组件拆分建议
```
src/pages/
├── ChatList/
│   ├── index.tsx
│   ├── ChatItem.tsx
│   └── EmptyState.tsx
├── ChatDetail/
│   ├── index.tsx
│   ├── MessageBubble.tsx
│   ├── TimeDivider.tsx
│   └── ChatInput.tsx
└── Profile/
    ├── index.tsx
    ├── ProfileHeader.tsx
    ├── StatCards.tsx
    ├── InfoCard.tsx
    ├── InterestTags.tsx
    └── SettingsList.tsx
```

### 10.2 状态管理建议
- 消息列表: React Query / SWR 轮询 + WebSocket 实时更新
- 聊天详情: 本地状态管理消息列表，乐观更新
- 个人资料: Context / Zustand 存储用户数据

### 10.3 性能优化
- 消息列表: 虚拟滚动 (react-window) 处理大量会话
- 聊天详情: 图片懒加载 + 消息分页加载
- 头像: 统一尺寸裁剪，使用 WebP 格式

---

*本规范由 Agent-Design 编制，与 Dashboard 设计规范配套使用。*
