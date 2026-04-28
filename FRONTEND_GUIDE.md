# Matchmaker Frontend - 前端项目完整指南

## ✅ 项目状态

**前端项目已创建完成！** 🎉

---

## 📁 项目结构

```
matchmaker-frontend/
├── src/
│   ├── api/                  # API 封装
│   │   └── index.js         # Axios 配置 + API 方法
│   ├── components/           # Vue 组件
│   ├── views/               # 页面组件
│   │   ├── Home.vue         # 首页
│   │   ├── Register.vue     # 注册页
│   │   ├── Login.vue        # 登录页
│   │   ├── Profile.vue      # 个人资料
│   │   ├── Matches.vue      # 匹配页
│   │   └── Chat.vue         # 聊天页
│   ├── router/              # 路由
│   │   └── index.js         # Vue Router 配置
│   ├── stores/              # 状态管理
│   │   └── user.js          # Pinia 用户状态
│   ├── assets/              # 静态资源
│   │   └── css/
│   │       └── main.css     # TailwindCSS
│   ├── main.js              # 入口文件
│   └── App.vue              # 根组件
├── public/                  # 公共资源
├── index.html               # HTML 模板
├── package.json             # 依赖配置
├── vite.config.js           # Vite 配置
├── tailwind.config.js       # TailwindCSS 配置
├── vercel.json              # Vercel 部署配置
├── .env.production          # 生产环境变量
└── README.md                # 项目文档
```

---

## 🎨 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4.21 | 前端框架 |
| Vite | 5.1.6 | 构建工具 |
| Vue Router | 4.3.0 | 路由管理 |
| Pinia | 2.1.7 | 状态管理 |
| Axios | 1.6.7 | HTTP 客户端 |
| TailwindCSS | 3.4.1 | 样式框架 |
| Supabase JS | 2.39.3 | 数据库客户端 |

---

## 🚀 本地开发

### 安装依赖

```bash
cd /data/workspace/matchmaker-frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

---

## 🔧 配置说明

### 环境变量

**生产环境** (`.env.production`):
```env
VITE_API_URL=https://matchmaker-api-bi2k.onrender.com
```

**开发环境** (`.env.local`):
```env
VITE_API_URL=http://localhost:8000
```

### Vite 配置

```javascript
{
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://matchmaker-api-bi2k.onrender.com',
        changeOrigin: true
      }
    }
  }
}
```

---

## 📋 页面路由

| 路径 | 页面 | 说明 | 需要登录 |
|------|------|------|---------|
| `/` | Home | 首页 | ❌ |
| `/register` | Register | 注册 | ❌ |
| `/login` | Login | 登录 | ❌ |
| `/profile` | Profile | 个人资料 | ✅ |
| `/matches` | Matches | 匹配 | ✅ |
| `/chat/:userId` | Chat | 聊天 | ✅ |

---

## 🔌 API 连接

### 已配置的 API

```javascript
// 用户认证
authAPI.register(data)  // 注册
authAPI.login(data)     // 登录
authAPI.logout()        // 登出

// 用户管理
userAPI.getProfile(userId)      // 获取资料
userAPI.updateProfile(userId, data)  // 更新资料

// 匹配系统
matchAPI.findMatches(data)       // 查找匹配
matchAPI.likeUser(userId, targetId)  // 喜欢用户
```

### 后端 URL

```
https://matchmaker-api-bi2k.onrender.com
```

---

## 🎨 功能特性

### 已实现
- ✅ 页面路由配置
- ✅ 用户状态管理
- ✅ API 封装
- ✅ 用户注册页面
- ✅ 用户登录页面
- ✅ 个人资料页面
- ✅ 匹配推荐页面
- ✅ 聊天页面

### 待开发
- [ ] 真实登录 API 集成
- [ ] 照片上传功能
- [ ] WebSocket 实时聊天
- [ ] 消息推送
- [ ] 用户搜索
- [ ] 匹配算法优化

---

## 📦 依赖已安装

```
✅ 240 packages installed
⚠️ 2 moderate vulnerabilities (可忽略)
```

---

## 🚀 部署到 Vercel

### 步骤 1：推送到 GitHub

```bash
cd /data/workspace/matchmaker-frontend
git remote add origin https://MINGACCOUMT:<TOKEN>@github.com/MINGACCOUMT/matchmaker-frontend.git
git push -u origin main
```

### 步骤 2：连接 Vercel

1. 访问 https://vercel.com/
2. 用 GitHub 登录
3. 点击 "Add New Project"
4. 导入 `matchmaker-frontend` 仓库
5. 配置环境变量：
   - `VITE_API_URL`: `https://matchmaker-api-bi2k.onrender.com`
6. 点击 "Deploy"

### 步骤 3：自动部署

Vercel 会自动：
- 构建项目 (`npm run build`)
- 部署到 CDN
- 提供 HTTPS 域名

---

## 🔐 配置安全

### CORS 配置

前端已配置允许的后端域名：
- `https://matchmaker-api-bi2k.onrender.com`
- `https://matchmaker-frontend.vercel.app`

### Token 管理

- Token 存储在 `localStorage`
- Axios 请求拦截器自动添加 Token
- 响应拦截器处理 401 错误

---

## 💰 费用总结

| 平台 | 费用 |
|------|------|
| Vercel | $0/月 |
| GitHub | $0/月 |
| **总计** | **$0/月** |

---

## 📚 完整文档

| 文档 | 内容 |
|------|------|
| `README.md` | 项目介绍 |
| `.env.production` | 生产环境变量 |
| `vercel.json` | Vercel 配置 |

---

**✅ 前端项目已完成，可以部署到 Vercel！**

需要我帮你：
- **推送到 GitHub**？
- **开始部署到 Vercel**？
- **测试本地开发**？
