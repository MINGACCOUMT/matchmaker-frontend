# 心动 App - Matches / Login / Register 设计规范

> 版本: v1.0  
> 日期: 2026-05-09  
> 对应页面: `Matches.tsx` / `Login.tsx` / `Register.tsx`  
> 技术栈: React 19 + Vite + TailwindCSS 3 + Framer Motion + lucide-react  
> 前置规范: `/data/workspace/matchmaker-frontend/design/dashboard-spec.md`

---

## 1. 设计概述

### 1.1 设计目标
为「心动」App 重新设计 Matches（匹配列表）、Login（登录）、Register（注册）三个页面，与 Dashboard 首页及 Chat/Profile 模块保持统一设计语言。

### 1.2 模块清单
| 模块 | 页面 | 文件 | 说明 |
|------|------|------|------|
| 匹配列表 | Matches | `matches-design.html` | 卡片式匹配列表 + 快捷聊天入口 |
| 登录 | Login | `login-design.html` | 品牌渐变背景 + 邮箱密码表单 + 社交登录 |
| 注册 | Register | `register-design.html` | 品牌渐变背景 + 头像上传 + 分组表单 + 兴趣标签 |

---

## 2. 色彩系统

### 2.1 品牌渐变
```css
.gradient-bg {
  background: linear-gradient(135deg, #FF4081 0%, #9C27B0 100%);
}
```
所有 Auth 页面（Login/Register）使用统一的品牌渐变作为页面背景。

### 2.2 毛玻璃卡片
```css
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.dark .glass-card {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 2.3 模块专属色彩
| 元素 | Light | Dark | 说明 |
|------|-------|------|------|
| 匹配度标签-高 | `#FF4081` | `#FF4081` | 90%+ 匹配度 |
| 匹配度标签-中 | `#9C27B0` | `#9C27B0` | 80-89% 匹配度 |
| 在线状态点 | `#22C55E` | `#22C55E` | 绿色 |
| 离线状态点 | `#9CA3AF` | `#6B7280` | 灰色 |
| 社交按钮边框 | `#E5E7EB` | `#374151` | 浅色边框 |

---

## 3. Matches（匹配列表页）组件规范

### 3.1 页面结构
```
┌─────────────────────────────┐
│  Header (sticky)            │ ← 标题"我的匹配(6)" + 筛选按钮
├─────────────────────────────┤
│  最近匹配头像栏 (横向滚动)     │ ← 6 个头像 + 昵称 + 在线状态
├─────────────────────────────┤
│  匹配卡片列表 (垂直滚动)        │
│  ├─ 左侧照片区 (112×112)      │
│  │   └─ 匹配度标签            │
│  └─ 右侧信息区                 │
│      ├─ 昵称 + 在线状态点      │
│      ├─ 年龄/城市/匹配时间      │
│      ├─ 最后消息预览           │
│      └─ 聊天按钮 + 资料按钮     │
├─────────────────────────────┤
│  BottomNav (fixed)            │ ← "匹配" 激活态
└─────────────────────────────┘
```

### 3.2 最近匹配头像栏
- **布局**: flex 横向，`overflow-x-auto`
- **每项**: 垂直布局，最小宽度 72px
- **头像**: 56px 圆形，avatar-ring 渐变边框
- **在线状态**: 右下角 14px 圆点（绿色/灰色）
- **昵称**: 12px  medium，单行，居中对齐

### 3.3 匹配卡片 (MatchCard)
- **布局**: flex 横向
- **圆角**: 16px
- **阴影**: card-shadow
- **交互**: hover `translateY(-3px)` + 阴影增强，active `scale(0.98)`
- **动画**: slideIn 入场，stagger 0.08s

#### 左侧照片区
- **尺寸**: 固定 112×112px (w-28 h-28)
- **图片**: object-cover 填充
- **匹配度标签**: 左上角，10px 圆角 pill
  - 90%+: `bg-primary-500`
  - 80-89%: `bg-secondary-500`

#### 右侧信息区
- **内边距**: p-3
- **昵称**: 16px bold + 在线状态点（8px 圆点）
- **元信息**: 12px `text-gray-500`，格式 "年龄 · 城市 · 匹配时间"
- **消息预览**: 14px，单行截断
  - 未读: `text-gray-600`
  - 已读: `text-gray-500`
- **操作按钮**:
  - 聊天: 粉色填充按钮，flex-1，12px 文字
  - 资料: 边框按钮，px-3，12px 文字

### 3.4 空状态（预留）
- 居中显示大心形图标 + 文案
- 文案: "还没有匹配哦，去发现页滑动卡片寻找缘分吧～"
- CTA: "去发现" primary 按钮

---

## 4. Login（登录页）组件规范

### 4.1 页面结构
```
┌─────────────────────────────┐
│  品牌渐变背景 (全屏)            │
│  ├─ 背景装饰圆 (blur)         │
│  ├─ Logo (心形 + 脉冲动画)     │
│  ├─ 标题"心动"               │
│  ├─ 副标题                   │
│  └─ 毛玻璃表单卡片             │
│      ├─ "欢迎回来"            │
│      ├─ 邮箱输入框            │
│      ├─ 密码输入框            │
│      ├─ 忘记密码链接           │
│      ├─ 登录按钮              │
│      ├─ 分隔线 + 社交登录       │
│      │   ├─ GitHub 按钮       │
│      │   └─ Google 按钮       │
│      └─ 注册引导              │
└─────────────────────────────┘
```

### 4.2 Logo 区
- **容器**: 80px 圆形，白色背景，阴影
- **图标**: 40px 心形，`fill-primary-500`
- **动画**: heartFloat (上下浮动 + 微旋转)
- **装饰**: 外层脉冲环动画 (pulseRing)

### 4.3 表单输入框
- **背景**: `bg-gray-50 dark:bg-gray-800`
- **边框**: 1px，`border-gray-200 dark:border-gray-700`
- **圆角**: 12px
- **内边距**: py-3 pl-10 pr-4
- **左侧图标**: 20px 灰色图标
- **Focus**: `border-primary-500` + `shadow-[0_0_0_3px_rgba(255,64,129,0.15)]`
- **文字**: 14px

### 4.4 登录按钮
- **背景**: `bg-primary-500`
- **文字**: 白色，semibold
- **圆角**: 12px
- **阴影**: `shadow-lg shadow-primary-500/30`
- **Hover**: `bg-primary-600` + 阴影增强 + `translateY(-0.5px)`

### 4.5 社交登录按钮
- **布局**: 两列等分
- **样式**: 边框按钮，圆角 12px
- **内容**: 图标(20px) + 文字(14px medium)
- **Hover**: `bg-gray-50 dark:bg-gray-800`

---

## 5. Register（注册页）组件规范

### 5.1 页面结构
```
┌─────────────────────────────┐
│  品牌渐变背景 (全屏)            │
│  ├─ 返回按钮 + 步骤指示器       │
│  ├─ Logo                     │
│  ├─ 标题"创建账号"            │
│  └─ 毛玻璃表单卡片 (可滚动)      │
│      ├─ 头像上传区             │
│      ├─ 基本信息分组            │
│      │   ├─ 邮箱               │
│      │   ├─ 密码               │
│      │   └─ 昵称               │
│      ├─ 个人资料分组            │
│      │   ├─ 性别选择 (👩/👨)   │
│      │   ├─ 生日 + 城市         │
│      │   └─ 个人介绍 (textarea) │
│      ├─ 兴趣标签               │
│      ├─ 创建账号按钮            │
│      ├─ 分隔线 + 社交注册        │
│      └─ 登录引导               │
└─────────────────────────────┘
```

### 5.2 步骤指示器
- **位置**: 顶部居中
- **样式**: 3 个圆点，10px
- **激活态**: `bg-primary-500` + `scale(1.2)`
- **未激活**: `bg-white/40`

### 5.3 头像上传区
- **容器**: 96px 圆形，虚线边框 `border-dashed`
- **默认**: 相机图标 32px，`text-gray-400`
- **添加按钮**: 右下角 32px 圆形，`bg-primary-500`，白色加号
- **提示文字**: 12px `text-gray-400`

### 5.4 性别选择
- **布局**: 两列等分
- **选中态**: `border-2 border-primary-500` + `bg-primary-50` + 粉色文字
- **未选中**: `border-2 border-gray-200` + 灰色文字
- **内容**: emoji + 文字

### 5.5 兴趣标签
- **布局**: flex wrap
- **标签样式**: 
  - 默认: `bg-gray-100 dark:bg-gray-800` + 灰色文字 + 边框
  - 选中: `bg-primary-500` + 白色文字 + `border-primary-500`
- **圆角**: pill (rounded-full)
- **内边距**: px-3 py-1.5
- **字号**: 12px medium
- **交互**: hover `scale(1.05)`，点击切换选中态

---

## 6. 动效规范

### 6.1 Matches 入场动画
```typescript
const matchCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: [0.4, 0, 0.2, 1] }
  })
};
```

### 6.2 Auth 页面动画
| 元素 | 动画 | 时长 |
|------|------|------|
| Logo | heartFloat (上下+旋转) | 3s 循环 |
| Logo 外环 | pulseRing (扩散淡出) | 2s 循环 |
| 表单卡片 | 页面加载时 fadeIn + translateY(20→0) | 0.5s |
| 输入框 focus | border 变色 + shadow 扩散 | 0.3s |
| 按钮 hover | translateY(-0.5px) + 阴影增强 | 0.3s |

### 6.3 兴趣标签交互
```typescript
const tagVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};
```

---

## 7. 图标映射 (lucid-react)

### 7.1 Matches 模块
| 位置 | 图标 | 尺寸 |
|------|------|------|
| 筛选 | `Filter` | 20px |
| 聊天按钮 | `MessageCircle` | 14px (隐含) |
| 资料按钮 | `User` | 14px (隐含) |

### 7.2 Auth 模块
| 位置 | 图标 | 尺寸 |
|------|------|------|
| 邮箱 | `Mail` | 20px |
| 密码 | `Lock` | 20px |
| 密码可见切换 | `Eye` / `EyeOff` | 20px |
| 昵称 | `User` | 20px |
| 生日 | `Calendar` | 20px |
| 城市 | `MapPin` | 20px |
| 头像上传 | `Camera` | 32px |
| 添加头像 | `Plus` | 16px |
| 返回 | `ChevronLeft` | 20px |

---

## 8. Dark Mode 映射

| 元素 | Light | Dark |
|------|-------|------|
| Auth 页面背景 | 渐变 #FF4081 → #9C27B0 | 同左 |
| 表单卡片 | 白色 95% 透明度 | #1A1A1A 95% 透明度 |
| 输入框背景 | #F3F4F6 | #374151 |
| 输入框边框 | #E5E7EB | #4B5563 |
| 社交按钮边框 | #E5E7EB | #374151 |
| 标签默认背景 | #F3F4F6 | #374151 |
| 标签默认文字 | #4B5563 | #D1D5DB |
| 匹配卡片背景 | #FFFFFF | #1A1A1A |
| 消息预览(已读) | #6B7280 | #9CA3AF |

---

## 9. 交付物清单

| 文件 | 路径 | 说明 |
|------|------|------|
| 匹配列表设计图 | `/data/workspace/matchmaker-frontend/design/matches-design.png` | 高保真渲染图 (860×2200px) |
| 匹配列表原型 | `/data/workspace/matchmaker-frontend/design/matches-design.html` | 可浏览器预览 |
| 登录页设计图 | `/data/workspace/matchmaker-frontend/design/login-design.png` | 高保真渲染图 (860×2000px) |
| 登录页原型 | `/data/workspace/matchmaker-frontend/design/login-design.html` | 可浏览器预览 |
| 注册页设计图 | `/data/workspace/matchmaker-frontend/design/register-design.png` | 高保真渲染图 (860×2400px) |
| 注册页原型 | `/data/workspace/matchmaker-frontend/design/register-design.html` | 可浏览器预览 |
| 设计规范 | `/data/workspace/matchmaker-frontend/design/auth-matches-spec.md` | 本文档 |

---

## 10. 实现建议

### 10.1 组件拆分建议
```
src/pages/
├── Matches/
│   ├── index.tsx
│   ├── MatchCard.tsx
│   ├── RecentMatchBar.tsx
│   └── EmptyState.tsx
├── Login/
│   ├── index.tsx
│   └── AuthLayout.tsx      # 复用渐变背景 + Logo
└── Register/
    ├── index.tsx
    ├── AvatarUpload.tsx
    ├── GenderSelect.tsx
    └── InterestTags.tsx
```

### 10.2 AuthLayout 复用
Login 和 Register 共享统一布局组件：
- 渐变背景 + 装饰 blur 圆形
- Logo + 标题区
- 毛玻璃卡片容器
- Dark Mode 切换兼容

### 10.3 表单验证建议
- 邮箱: 正则验证 + 实时反馈
- 密码: 8 位以上 + 强度指示条
- 昵称: 2-20 字符 + 敏感词过滤
- 兴趣标签: 最少选 3 个，最多 10 个

---

*本规范由 Agent-Design 编制，与 Dashboard / Chat / Profile 设计规范配套使用。*
