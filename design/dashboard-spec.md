# 心动 App - Dashboard 首页设计规范 v2.0

> 版本: v2.0  
> 日期: 2026-05-09  
> 对应页面: `Dashboard.tsx`  
> 技术栈: React 19 + Vite + TailwindCSS 3 + Framer Motion + lucide-react  
> 前置规范: `/data/workspace/matchmaker-frontend/design/dashboard-spec.md`

---

## 1. 设计概述

### 1.1 设计目标
对 Dashboard 首页进行全面视觉升级，参考 Tinder/Bumble 等头部交友 App 的信息密度与质感，在保留全部 6 个功能模块的前提下，提升现代感、视觉冲击力和交互精致度。

### 1.2 升级要点
| 模块 | 升级前 | 升级后 |
|------|--------|--------|
| Header | 纯白毛玻璃 | 渐变背景 + 更强毛玻璃层次感 |
| 快速入口 | 48px 扁平图标 | 56px 3D 阴影图标 + hover 上浮 |
| 统计数据 | 纯数字卡片 | 数字 + SVG 环形进度条 |
| 每日推荐 | 200×220 卡片 | 210×260 更大照片 + 精致匹配标签 |
| 最近匹配 | 简单头像堆叠 | 脉冲光环 + NEW 徽标 + 紧迫感文案 |

---

## 2. 色彩系统

### 2.1 Header 渐变背景
```css
.header-gradient {
  background: linear-gradient(
    135deg, 
    rgba(255, 64, 129, 0.08) 0%, 
    rgba(156, 39, 176, 0.06) 50%, 
    rgba(255, 255, 255, 0) 100%
  );
}
.dark .header-gradient {
  background: linear-gradient(
    135deg, 
    rgba(255, 64, 129, 0.15) 0%, 
    rgba(156, 39, 176, 0.10) 50%, 
    rgba(0, 0, 0, 0) 100%
  );
}
```

### 2.2 统计卡片环形进度条配色
| 统计项 | 主色 | 进度条颜色 | 背景色 |
|--------|------|-----------|--------|
| 今日浏览 | sky-500 | `#0EA5E9` | sky-50 / sky-900/30 |
| 新匹配 | primary-500 | `#FF4081` | primary-50 / primary-900/30 |
| 未读消息 | orange-500 | `#F97316` | orange-50 / orange-900/30 |

---

## 3. Header 组件规范

### 3.1 结构升级
- **高度**: 自适应（py-3）
- **背景**: header-gradient + `backdrop-blur-xl` + `bg-white/60 dark:bg-[#1A1A1A]/60`
- **边框**: 底部 1px `border-gray-100/50 dark:border-gray-800/50`
- **定位**: sticky top-0 z-50

### 3.2 左侧用户区
- 头像: 44px (w-11 h-11)，avatar-ring 渐变边框
- 在线状态: 14px 圆点，绿色，白色边框
- 文案: "Welcome back" 12px 灰色 + "Hi, {nickname}" 16px bold

### 3.3 右侧通知铃铛
- 按钮: 40px 圆形，`bg-white/80 dark:bg-[#2A2A2A]/80` + shadow-sm
- 图标: Bell，20px
- 未读红点: 10px 圆形，`bg-primary-500` + pulse 动画（2s 循环，scale 1→1.3）
- Hover: shadow-md 增强

---

## 4. 快速入口区 (QuickActions) 升级规范

### 4.1 图标容器升级
- **尺寸**: 56×56px (w-14 h-14)，rounded-2xl
- **3D 阴影**: `box-shadow: 0 8px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)`
- **Hover 效果**:
  - 整体 translateY(-4px)
  - 图标 scale(1.08)
  - 阴影增强: `0 12px 28px rgba(0,0,0,0.2)`
- **Active**: scale(0.95)

### 4.2 图标配色（保持不变）
| 入口 | 渐变起点 | 渐变终点 |
|------|---------|---------|
| 每日推荐 | `#FF6B9D` | `#FF4081` |
| 我的匹配 | `#AB47BC` | `#9C27B0` |
| 消息中心 | `#FFB74D` | `#F97316` |
| 完善资料 | `#4DB6AC` | `#14B8A6` |

### 4.3 文字
- 11px semibold，`text-gray-700 dark:text-gray-200`

---

## 5. 统计数据区 (Stats) 升级规范

### 5.1 卡片结构升级
- **布局**: 数字 + SVG 环形进度条并排
- **环形进度条**:
  - 尺寸: 32×32px (w-8 h-8)
  - 背景环: 当前颜色 20% 透明度
  - 进度环: 实际颜色，stroke-dasharray 根据数值比例
  - 旋转: -90deg (从顶部开始)
  - 示例比例: 浏览 75/100，匹配 60/100，消息 40/100

### 5.2 数字展示
- 24px extrabold，`text-gray-900 dark:text-white`

### 5.3 Delta 标签
- 10px bold，emerald-500，rounded-full pill，emerald-50 背景

---

## 6. 每日推荐区 (DailyRecommend) 升级规范

### 6.1 卡片尺寸升级
- **宽度**: 210px（原 200px）
- **照片高度**: 260px（原 220px）
- **圆角**: 16px

### 6.2 照片展示
- 更大占比，渐变遮罩从底部 70% 到顶部透明
- 减少文字干扰，信息集中在底部

### 6.3 匹配分数标签升级
- **样式**: `bg-white/92` + `backdrop-blur(8px)` + rounded-full
- **Dark**: `bg-black/70`
- **文字**: 12px bold，`text-primary-500`
- **位置**: 右上角，更精致

### 6.4 底部信息
- 昵称: 18px bold 白色
- VIP/在线 badge: 10px，粉色/绿色背景
- 年龄/城市: 12px 白色/80%

### 6.5 兴趣标签
- 更小更精致: 10px medium，灰色 pill

### 6.6 喜欢按钮
- 已喜欢: `bg-primary-500` + 填充心形 + shadow
- 未喜欢: `bg-primary-50 dark:bg-primary-900/30` + 空心心形
- Hover: 背景变 primary-500，图标变白

---

## 7. 最近匹配区 (RecentMatches) 升级规范

### 7.1 紧迫感设计
- **卡片背景**: 右上角装饰性渐变圆 `from-primary-500/10`
- **第一个头像**: urgency-glow 脉冲光环动画（2s 循环，shadow 扩散消失）
- **NEW 徽标**: primary-500 背景，白色文字，10px，rounded-full

### 7.2 文案升级
- 标题: "3 位新匹配" + NEW 徽标
- 描述: "现在去打个招呼吧，别让缘分溜走～"（更有情感化）

### 7.3 打招呼按钮
- 更大更突出: px-5 py-2.5，semibold
- shadow-lg shadow-primary-500/30

---

## 8. 动效规范

### 8.1 页面入场 stagger
```typescript
const slideIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: { delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  })
};
```
- 快速入口: delay 0s
- 统计数据: delay 0.08s
- 每日推荐: delay 0.16s
- 最近匹配: delay 0.24s

### 8.2 微交互
| 元素 | 触发 | 效果 | 时长 |
|------|------|------|------|
| 快速入口图标 | hover | translateY(-4px) + scale(1.08) + 阴影增强 | 300ms |
| 统计卡片 | hover | translateY(-3px) + 径向渐变光晕 | 300ms |
| 推荐卡片 | hover | scale(1.03) + 阴影增强 | 300ms |
| 通知红点 | 持续 | pulse (scale 1→1.3) | 2000ms 循环 |
| 匹配头像 | 持续 | urgency-glow (shadow 扩散) | 2000ms 循环 |
| 心形 emoji | 持续 | heartFloat (translateY) | 3000ms 循环 |

---

## 9. 图标映射 (lucide-react)

| 位置 | 图标 | 尺寸 |
|------|------|------|
| 通知铃铛 | `Bell` | 20px |
| 每日推荐 | `Heart` | 28px |
| 我的匹配 | `Users` | 28px |
| 消息中心 | `MessageCircle` | 28px |
| 完善资料 | `User` | 28px |
| 浏览统计 | `Eye` | 20px |
| 匹配统计 | `Heart` | 20px |
| 消息统计 | `MessageCircle` | 20px |
| 底部首页 | `Home` | 24px |
| 底部发现 | `Search` | 24px |
| 底部消息 | `MessageCircle` | 24px |
| 底部我的 | `User` | 24px |
| 查看更多 | `ChevronRight` | 16px |
| 喜欢按钮(填充) | `Heart` (fill) | 16px |
| 喜欢按钮(空心) | `Heart` | 16px |

---

## 10. 交付物

| 文件 | 路径 | 说明 |
|------|------|------|
| HTML 原型 | `/data/workspace/matchmaker-frontend/design/dashboard-design.html` | 完整可交互原型，含 Dark Mode 切换 |
| 设计规范 | `/data/workspace/matchmaker-frontend/design/dashboard-spec.md` | 本文档 |

---

*本规范由 Agent-Design 编制，与 Chat/Profile/Matches/Login/Register 设计规范配套使用。*
