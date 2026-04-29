# Matchmaker 前端开发大纲

> 技术栈：Vue 3 + Vite + Pinia + Vue Router + Tailwind CSS + Axios
> 部署目标：Render / Vercel
> 更新日期：2026-04-29

---

## 📊 当前进度总览

| Phase | 任务 | 状态 | 备注 |
|-------|------|------|------|
| Phase 1 | 页面框架搭建 | ✅ 已完成 | Home/Register/Login/Profile/Matches/Chat |
| Phase 2 | API 对接（Register/Login/Profile） | ⏳ 未开始 | 表单字段需调整 |
| Phase 3 | Matches 页面完整对接 | ⏳ 未开始 | 需等后端 matches 端点完成 |
| Phase 4 | Chat 页面完整对接 | ⏳ 未开始 | 需等后端 chat 测试通过 |
| Phase 5 | 联调与部署 | ⏳ 未开始 | |

---

## ✅ Phase 1：页面框架搭建（DONE）

**完成状态**：所有页面 UI 结构已搭建

### 已完成页面

| 页面 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 首页 | `src/views/Home.vue` | ✅ UI 完成 | 导航、CTA 按钮 |
| 注册 | `src/views/Register.vue` | ⚠️ UI 完成 | 但表单是**手机号**，后端是 **email** |
| 登录 | `src/views/Login.vue` | ⚠️ UI 完成 | 但表单是**手机号**，且 API 调用被注释（mock） |
| 资料 | `src/views/Profile.vue` | ⚠️ UI 完成 | API 调用被注释（mock） |
| 匹配 | `src/views/Matches.vue` | ⚠️ UI 完成 | 调用未实现的 API，likeUser 传参方式不对 |
| 聊天 | `src/views/Chat.vue` | ⚠️ UI 完成 | 只有 mock 消息，未连接后端 |

### 已完成基础设施

- ✅ Vue Router + 导航守卫（`meta.requiresAuth`）
- ✅ Pinia Store（`src/stores/user.js`）
- ✅ Axios 封装（`src/api/index.js`）
- ✅ Tailwind CSS 配置
- ✅ 响应式布局

---

## ⏳ Phase 2：API 对接（Register / Login / Profile）

### 2.1 重写 `src/views/Register.vue`

**问题**：当前表单字段是 `phone`，后端 `authAPI.register` 需要 `email` + `password`。

**修改点**：
- 表单字段：`phone` → `email`（type="email"）
- 添加 `password` 字段
- 保留 `nickname`、`gender`、`birthday`
- 可选添加 `bio`、`tags`
- 注册成功后：
  - 后端返回 `access_token` → 存入 `localStorage`
  - 后端返回 `user` → 存入 `userStore`
  - 跳转到 `/matches`

### 2.2 重写 `src/views/Login.vue`

**问题**：当前表单字段是 `phone`，且 API 调用被注释，用 mock token。

**修改点**：
- 表单字段：`phone` → `email`
- 添加 `password` 字段
- 取消注释 `authAPI.login()` 调用
- 登录成功后处理 token + user，跳转 `/matches`

### 2.3 完善 `src/views/Profile.vue`

**问题**：当前是空表单，onMounted 没有加载数据，handleUpdate 没有调用 API。

**修改点**：
- `onMounted` 调用 `userAPI.getMe()` 加载当前用户资料
- `handleUpdate` 调用 `userAPI.updateMe(formData)` 保存
- 字段映射：确保前端字段名与后端 `MeResponse` / `UpdateMeRequest` 对应

---

## ⏳ Phase 3：Matches 页面完整对接

### 3.1 修改 `src/views/Matches.vue`

**问题**：
- 调用 `matchAPI.findMatches()` → 后端未实现此接口
- `matchAPI.likeUser(userStore.user?.id || 1, targetId)` → 传参方式不对，应该只传 `to_user_id`

**修改点**：
- `loadMatches()` 改为调用 `userAPI.discover()`（后端已实现 `/discover`）
- `handleLike(targetId)` 改为调用 `matchAPI.likeUser(targetId)`（只传 to_user_id）
- 喜欢成功后从列表移除该用户
- 添加 "匹配成功" 提示（当双向匹配时）

### 3.2 添加 "我的匹配" 列表

- 新增标签页或子页面："推荐" vs "已匹配"
- "已匹配" 调用 `matchAPI.getMatches()` 显示双向匹配的用户
- 点击匹配用户进入聊天

---

## ⏳ Phase 4：Chat 页面完整对接

### 4.1 修改 `src/views/Chat.vue`

**问题**：当前只有 mock 消息，未连接后端。

**修改点**：
- `onMounted` 调用 `chatAPI.getMessages(userId)` 加载历史消息
- `handleSend` 调用 `chatAPI.sendMessage(conversationId, content)` 发送消息
- 消息数据结构对齐后端 `MessageOut`
- 消息自动滚动到底部

### 4.2 聊天列表页（可选）

- 在 Matches 页面或独立页面显示 `chatAPI.getConversations()`
- 显示最后一条消息和未读数
- 点击进入具体聊天

---

## ⏳ Phase 5：联调与部署

### 5.1 本地联调

```bash
# 终端 1：启动后端
cd /data/workspace/matchmaker-backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# 终端 2：启动前端
cd /data/workspace/matchmaker-frontend
npm run dev
```

### 5.2 完整用户流程验证

1. 注册账号 → 成功
2. 登录 → 成功，跳转 /matches
3. /discover 加载推荐用户 → 成功
4. 点击喜欢 → 成功，用户从列表移除
5. 双向匹配 → 出现在匹配列表
6. 进入聊天 → 发送/接收消息正常
7. 查看/编辑个人资料 → 正常

### 5.3 生产环境配置

- `src/api/index.js` 中 `API_BASE_URL` 确认指向生产后端
- 构建：`npm run build`
- 部署到 Render / Vercel

---

## 📁 项目结构

```
matchmaker-frontend/
├── src/
│   ├── main.js                 # 入口
│   ├── App.vue                 # 根组件
│   ├── router/
│   │   └── index.js            # 路由配置
│   ├── stores/
│   │   └── user.js             # Pinia 用户状态
│   ├── api/
│   │   └── index.js            # Axios 封装 + API 方法
│   ├── views/
│   │   ├── Home.vue            # 首页 ✅
│   │   ├── Register.vue        # 注册 ⚠️ (需改 email)
│   │   ├── Login.vue           # 登录 ⚠️ (需改 email)
│   │   ├── Profile.vue         # 资料 ⚠️ (需对接 API)
│   │   ├── Matches.vue         # 匹配 ⚠️ (需对接 API)
│   │   └── Chat.vue            # 聊天 ⚠️ (需对接 API)
│   └── assets/
│       └── css/
│           └── main.css        # Tailwind + 自定义样式
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔗 相关资源

- **GitHub**: https://github.com/MINGACCOUMT/matchmaker-frontend
- **Render**: https://matchmaker-frontend-hs57.onrender.com
- **后端 API**: https://matchmaker-api-bi2k.onrender.com
