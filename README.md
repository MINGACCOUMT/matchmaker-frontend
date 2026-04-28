# Matchmaker Frontend

相亲网站前端项目 - 基于 Vue 3 + Vite + TailwindCSS

## 技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **样式**: TailwindCSS
- **部署**: Vercel

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 环境变量

创建 `.env.local` 文件：

```env
VITE_API_URL=https://matchmaker-api-bi2k.onrender.com
```

## 项目结构

```
src/
├── api/              # API 封装
├── components/       # Vue 组件
├── views/           # 页面
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
├── utils/           # 工具函数
└── assets/          # 静态资源
```

## 部署

### 部署到 Vercel

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量：
   - `VITE_API_URL`: `https://matchmaker-api-bi2k.onrender.com`
3. 自动部署

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/register` | POST | 用户注册 |
| `/api/v1/login` | POST | 用户登录 |
| `/api/v1/profile/{id}` | GET | 获取用户资料 |
| `/api/v1/profile/{id}` | PUT | 更新用户资料 |
| `/api/v1/find` | POST | 查找匹配 |
| `/api/v1/like/{user}/{target}` | POST | 喜欢用户 |

## 开发计划

### 已完成
- [x] 项目结构搭建
- [x] 路由配置
- [x] API 封装
- [x] 页面组件
- [x] 状态管理

### 进行中
- [ ] 真实登录实现
- [ ] 用户资料管理
- [ ] 匹配算法优化
- [ ] WebSocket 实时聊天

### 待开发
- [ ] 照片上传
- [ ] 实时通知
- [ ] 消息推送
- [ ] 管理后台

## License

MIT
