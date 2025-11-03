# osu! OAuth Server (Deno)

[English](./README_EN.md) | 中文

基于 Deno 的 osu! OAuth 2.0 认证服务端，支持 CORS、环境变量配置，自动获取和保存 token。

## 快速开始

### 环境配置

复制并编辑 `.env` 文件：

```env
OSU_CLIENT_ID=你的客户端ID
OSU_CLIENT_SECRET=你的客户端密钥
REDIRECT_URI=http://localhost:4000/callback
WEBAPP_URL=http://localhost:3000
PORT=4000
```

参考 [osu! OAuth 设置](https://osu.ppy.sh/home/account/edit#oauth) 获取凭证。

### 运行服务器

```bash
deno run --allow-net --allow-env main.ts
# 或
deno task start
```

访问 `http://localhost:4000` 开始认证流程。

## API 端点

| 端点 | 说明 |
|------|------|
| `GET /` | 欢迎页面 |
| `GET /auth` | 开始 OAuth 流程，重定向到 osu! 授权页 |
| `GET /callback?code=xxx&state=xxx` | 回调处理，获取 token 后重定向回 webapp |

## 部署

1. [Deno Deploy](https://deno.com/deploy) 创建项目并连接 GitHub 仓库
2. 设置环境变量（项目设置中）
3. 更新 osu! OAuth 设置中的 Redirect URI 为部署地址

## 流程

用户访问 `/auth` → 重定向到 osu.ppy.sh → 授权并回调 `/callback` → 获取 token 并保存到 localStorage → 重定向回 webapp

## 注意事项

⚠️ **重要**：

- 不要将 `.env` 文件提交到 Git
- Client Secret 必须保密
- 生产环境中建议使用 HTTPS
- 确保 Redirect URI 与 osu! 应用设置完全一致

## 许可证

MIT
