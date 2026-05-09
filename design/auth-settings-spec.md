# 心动 App - ForgotPassword / Settings 设计规范

> 版本: v1.0  
> 日期: 2026-05-09  
> 对应页面: `ForgotPassword.tsx` / `Settings.tsx`  
> 技术栈: React 19 + Vite + TailwindCSS 3 + Framer Motion + lucide-react  
> 前置规范: `/data/workspace/matchmaker-frontend/design/dashboard-spec.md`

---

## 1. 设计概述

### 1.1 设计目标
为「心动」App 设计 ForgotPassword（忘记密码）和 Settings（设置）两个页面，与 Login/Register/Profile 等现有页面保持统一设计语言。

### 1.2 模块清单
| 模块 | 页面 | 文件 | 说明 |
|------|------|------|------|
| 忘记密码 | ForgotPassword | `forgot-password-design.html` | 邮箱输入 + 发送重置链接 + 成功状态 |
| 设置 | Settings | `settings-design.html` | 分组卡片式设置列表（账户/隐私/通知/外观/关于） |

---

## 2. 色彩系统

### 2.1 品牌渐变（Auth 页面统一）
```css
.gradient-bg {
  background: linear-gradient(135deg, #FF4081 0%, #9C27B0 100%);
}
```

### 2.2 毛玻璃卡片
```css
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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
| 成功状态图标背景 | `#DCFCE7` | `green-900/30` | 浅绿背景 |
| 成功状态图标 | `#22C55E` | `#22C55E` | 绿色对勾 |
| Toggle 开启 | `#FF4081` | `#FF4081` | primary-500 |
| Toggle 关闭 | `#D1D5DB` | `#4B5563` | gray-300/600 |
| Radio 选中边框 | `#FF4081` | `#FF4081` | primary-500 |
| Radio 选中圆点 | `#FF4081` | `#FF4081` | primary-500 |
| 设置页背景 | `#F8F9FA` | `#0F0F0F` | 浅灰/深黑 |
| 设置卡片背景 | `#FFFFFF` | `#1A1A1A` | 白色/深灰 |

---

## 3. 忘记密码页 (ForgotPassword) 组件规范

### 3.1 页面结构
```
┌─────────────────────────────┐
│  品牌渐变背景 (全屏)            │
│  ├─ 装饰性 blur circles (3个) │
│  ├─ 返回按钮 (左上角)           │
│  ├─ Logo (心形 + 脉冲动画)     │
│  ├─ 标题"找回密码"            │
│  ├─ 副标题                    │
│  └─ 毛玻璃表单卡片             │
│      ├─ 邮箱输入框 (Mail图标)   │
│      ├─ 发送按钮              │
│      └─ 成功状态 (绿色对勾)     │
│  底部：返回登录链接             │
└─────────────────────────────┘
```

### 3.2 返回按钮
- **位置**: 左上角，absolute 定位
- **样式**: 40px 圆形，`bg-white/20` + backdrop-blur
- **图标**: ChevronLeft，20px，白色
- **Hover**: `bg-white/30`

### 3.3 Logo 区
- **容器**: 64px 圆形，白色背景
- **图标**: 32px 心形，`fill-primary-500`
- **动画**: heartFloat (3s 循环)
- **装饰**: 外层 pulseRing (2s 循环)

### 3.4 表单输入框
- **背景**: `bg-gray-50 dark:bg-gray-800`
- **边框**: 1px，`border-gray-200 dark:border-gray-700`
- **圆角**: 12px
- **高度**: 48px (h-12)
- **左侧图标**: Mail 图标，20px 灰色
- **Focus**: `border-primary-500` + `shadow-[0_0_0_3px_rgba(255,64,129,0.15)]`

### 3.5 发送按钮
- **背景**: `bg-primary-500`
- **文字**: 白色，semibold
- **高度**: 48px (h-12)
- **圆角**: 12px
- **阴影**: `shadow-lg shadow-primary-500/30`
- **Hover**: `bg-primary-600` + 阴影增强 + `translateY(-0.5px)`

### 3.6 成功状态
- **动画**: successPop (0.4s cubic-bezier(0.34, 1.56, 0.64, 1))
- **图标区**: 64px 圆形，`bg-green-100 dark:bg-green-900/30`
- **图标**: CheckCircle，32px，`text-green-500`
- **标题**: "重置邮件已发送"，18px bold
- **描述**: "请查收邮箱，点击链接完成密码重置\n链接有效期 30 分钟"，14px 灰色

### 3.7 入场动画
```typescript
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
};
```
- Logo: delay 0.1s
- 标题: delay 0.2s
- 副标题: delay 0.3s
- 卡片: delay 0.4s
- 底部链接: delay 0.5s

---

## 4. 设置页 (Settings) 组件规范

### 4.1 页面结构
```
┌─────────────────────────────┐
│  Header (sticky, h-14)      │ ← 返回 + "设置"标题
├─────────────────────────────┤
│  背景 bg-[#F8F9FA]          │
├─────────────────────────────┤
│  分组 1: 账户设置             │
│  ├─ 修改密码 (Lock + →)      │
│  └─ 绑定手机 (Smartphone + →)│
├─────────────────────────────┤
│  分组 2: 隐私设置             │
│  ├─ 资料可见性 (Eye + Toggle) │
│  └─ 黑名单 (Shield + →)       │
├─────────────────────────────┤
│  分组 3: 通知设置             │
│  ├─ 消息提醒 (Bell + Toggle)  │
│  └─ 匹配通知 (Heart + Toggle) │
├─────────────────────────────┤
│  分组 4: 外观设置             │
│  └─ 主题模式 (Palette + Radio)│
│      ├─ 浅色模式             │
│      ├─ 深色模式             │
│      └─ 跟随系统             │
├─────────────────────────────┤
│  分组 5: 关于                 │
│  ├─ 帮助反馈 (HelpCircle + →) │
│  ├─ 用户协议 (FileText + →)   │
│  ├─ 隐私政策 (Shield + →)     │
│  └─ 版本号 (Info + v1.0.0)     │
└─────────────────────────────┘
```

### 4.2 Header 规范
- **高度**: 56px (h-14)
- **背景**: `bg-white/80 dark:bg-[#1A1A1A]/80` + backdrop-blur-xl
- **边框**: 底部 1px
- **左侧**: 返回按钮，36px 触摸区
- **中间**: "设置"标题，16px bold，居中

### 4.3 分组卡片
- **背景**: `bg-white dark:bg-[#1A1A1A]`
- **圆角**: 16px (rounded-2xl)
- **阴影**: card-shadow (柔和阴影)
- **间距**: 每组之间 gap-4

### 4.4 分组标题
- **文字**: 14px semibold
- **颜色**: `text-gray-900 dark:text-white`
- **间距**: mb-3 px-1

### 4.5 设置项 (SettingItem)
- **布局**: flex 横向，gap-3
- **内边距**: px-4 py-3.5
- **分隔**: 底部 1px border（最后一项无分隔）
- **交互**: active `bg-primary-500/6`

#### 结构
| 区域 | 规范 |
|------|------|
| 图标区 | 36px 圆角矩形，对应颜色背景 |
| 文字区 | 标题 14px medium + 描述 12px 灰色（可选） |
| 右侧 | Toggle / ChevronRight / 版本号文字 |

### 4.6 Toggle 开关
- **轨道**: w-11 h-6，rounded-full
- **开启**: `bg-primary-500`
- **关闭**: `bg-gray-300 dark:bg-gray-600`
- **滑块**: 20px 圆形，白色，阴影
- **位置**: 开启时 right-0.5，关闭时 left-0.5
- **动画**: 300ms ease，滑块平移

### 4.7 Radio 单选
- **外圈**: w-5 h-5，rounded-full，border-2
- **未选中**: `border-gray-300 dark:border-gray-600`
- **选中**: `border-primary-500`
- **内点**: 10px 圆形，`bg-primary-500`，选中时显示
- **动画**: 200ms ease

### 4.8 图标配色映射
| 设置项 | 图标 | 背景色 | 图标色 |
|--------|------|--------|--------|
| 修改密码 | Lock | primary-50 | primary-500 |
| 绑定手机 | Smartphone | secondary-50 | secondary-500 |
| 资料可见性 | Eye | amber-50 | amber-500 |
| 黑名单 | Shield | teal-50 | teal-500 |
| 消息提醒 | Bell | rose-50 | rose-500 |
| 匹配通知 | Heart | pink-50 | pink-500 |
| 主题模式 | Palette | indigo-50 | indigo-500 |
| 帮助反馈 | HelpCircle | teal-50 | teal-500 |
| 用户协议 | FileText | blue-50 | blue-500 |
| 隐私政策 | Shield | purple-50 | purple-500 |
| 版本号 | Info | gray-50 | gray-500 |

---

## 5. 动效规范

### 5.1 ForgotPassword 入场
```typescript
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: { delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  })
};
```

### 5.2 成功状态动画
```typescript
const successPop = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
  }
};
```

### 5.3 Toggle 动画
- 轨道背景色: 300ms ease
- 滑块位移: 300ms cubic-bezier(0.4, 0, 0.2, 1)

### 5.4 Settings 列表项
- 无入场动画（保持页面简洁）
- 点击反馈: active 背景色变化 200ms

---

## 6. 图标映射 (lucide-react)

### 6.1 ForgotPassword
| 位置 | 图标 | 尺寸 |
|------|------|------|
| 返回 | `ChevronLeft` | 20px |
| Logo | `Heart` | 32px |
| 邮箱 | `Mail` | 20px |
| 成功 | `CheckCircle` | 32px |

### 6.2 Settings
| 位置 | 图标 | 尺寸 |
|------|------|------|
| 返回 | `ChevronLeft` | 20px |
| 修改密码 | `Lock` | 20px |
| 绑定手机 | `Smartphone` | 20px |
| 资料可见性 | `Eye` | 20px |
| 黑名单 | `Shield` | 20px |
| 消息提醒 | `Bell` | 20px |
| 匹配通知 | `Heart` | 20px |
| 主题模式 | `Palette` | 20px |
| 帮助反馈 | `HelpCircle` | 20px |
| 用户协议 | `FileText` | 20px |
| 隐私政策 | `Shield` | 20px |
| 版本号 | `Info` | 20px |
| 右箭头 | `ChevronRight` | 16px |

---

## 7. Dark Mode 映射

| 元素 | Light | Dark |
|------|-------|------|
| 渐变背景 | #FF4081 → #9C27B0 | 同左 |
| 玻璃卡片 | 白色 95% | #1A1A1A 95% |
| 设置页背景 | #F8F9FA | #0F0F0F |
| 设置卡片 | #FFFFFF | #1A1A1A |
| 分组标题 | #111827 | #FFFFFF |
| 设置项标题 | #111827 | #FFFFFF |
| 设置项描述 | #9CA3AF | #6B7280 |
| Toggle 关闭轨道 | #D1D5DB | #4B5563 |
| Radio 未选边框 | #D1D5DB | #4B5563 |
| 卡片阴影 | 浅色 | 深色增强 |

---

## 8. 交付物清单

| 文件 | 路径 | 说明 |
|------|------|------|
| 忘记密码原型 | `/data/workspace/matchmaker-frontend/design/forgot-password-design.html` | 可浏览器预览，含成功状态切换 |
| 设置页原型 | `/data/workspace/matchmaker-frontend/design/settings-design.html` | 可浏览器预览，含 Toggle/Radio 交互 |
| 设计规范 | `/data/workspace/matchmaker-frontend/design/auth-settings-spec.md` | 本文档 |

---

## 9. 实现建议

### 9.1 组件拆分建议
```
src/pages/
├── ForgotPassword/
│   ├── index.tsx
│   └── SuccessState.tsx
└── Settings/
    ├── index.tsx
    ├── SettingGroup.tsx
    ├── SettingItem.tsx
    ├── ToggleSwitch.tsx
    └── ThemeRadio.tsx
```

### 9.2 状态管理建议
- **ForgotPassword**: 本地 useState 管理表单状态和成功状态
- **Settings**: 
  - Toggle 状态: localStorage 持久化
  - Theme: localStorage + class 切换
  - 示例 key: `matchmaker_settings`, `matchmaker_theme`

### 9.3 localStorage 数据结构
```typescript
interface SettingsState {
  profileVisible: boolean;
  messageNotify: boolean;
  matchNotify: boolean;
  theme: 'light' | 'dark' | 'system';
}
```

---

*本规范由 Agent-Design 编制，与 Dashboard / Chat / Profile / Matches / Login / Register 设计规范配套使用。*
