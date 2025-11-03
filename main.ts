import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

// 加载 .env 文件
const env = await load();

// 配置信息
const config = {
  clientId: env.OSU_CLIENT_ID || Deno.env.get("OSU_CLIENT_ID") || "1",
  clientSecret: env.OSU_CLIENT_SECRET || Deno.env.get("OSU_CLIENT_SECRET") || "clientsecret",
  redirectUri: env.REDIRECT_URI || Deno.env.get("REDIRECT_URI") || "http://localhost:4000/callback",
  webappUrl: env.WEBAPP_URL || Deno.env.get("WEBAPP_URL") || "http://localhost:3000",
  port: Number.parseInt(env.PORT || Deno.env.get("PORT") || "4000"),
};

console.log("🎮 osu! OAuth Server starting...");
console.log(`🔑 Client ID: ${config.clientId}`);
console.log(`📍 Redirect URI: ${config.redirectUri}`);
console.log(`🌐 Webapp URL: ${config.webappUrl}`);
console.log(`🚀 Server port: ${config.port}`);

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // 添加 CORS 头
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // 处理 OPTIONS 请求（预检请求）
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 路由：根路径 - 显示使用说明
  if (path === "/") {
    const html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>osu! OAuth Server</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0f1e3d 100%);
            background-attachment: fixed;
            color: #e0e6ff;
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
          }
          
          /* 背景网格效果 */
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              linear-gradient(0deg, transparent 24%, rgba(0, 255, 200, 0.05) 25%, rgba(0, 255, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 200, 0.05) 75%, rgba(0, 255, 200, 0.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0, 255, 200, 0.05) 25%, rgba(0, 255, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 200, 0.05) 75%, rgba(0, 255, 200, 0.05) 76%, transparent 77%, transparent);
            background-size: 50px 50px;
            pointer-events: none;
            z-index: -2;
          }
          
          /* 装饰光线 */
          body::after {
            content: '';
            position: fixed;
            top: -50%;
            right: -20%;
            width: 100%;
            height: 200%;
            background: radial-gradient(circle, rgba(0, 255, 200, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: -1;
          }
          
          .container {
            max-width: 900px;
            margin: 40px auto;
            padding: 40px;
            background: rgba(15, 30, 61, 0.6);
            border: 1px solid rgba(0, 255, 200, 0.2);
            border-left: 3px solid rgba(0, 255, 200, 0.6);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
          }
          
          h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #00ffc8 0%, #00a8ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
            letter-spacing: 1px;
          }
          
          .subtitle {
            font-size: 1em;
            color: #00ffc8;
            margin-bottom: 30px;
            opacity: 0.8;
            border-bottom: 1px solid rgba(0, 255, 200, 0.2);
            padding-bottom: 20px;
          }
          
          p {
            line-height: 1.8;
            margin-bottom: 15px;
            color: #c0c6ff;
          }
          
          h3 {
            font-size: 1.3em;
            color: #00ffc8;
            margin-top: 30px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
          }
          
          code {
            background: rgba(0, 255, 200, 0.1);
            color: #00ffc8;
            padding: 4px 10px;
            border: 1px solid rgba(0, 255, 200, 0.2);
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            letter-spacing: 0.5px;
          }
          
          .info {
            background: rgba(0, 255, 200, 0.08);
            border-left: 2px solid #00ffc8;
            padding: 20px;
            margin: 20px 0;
            border-top: 1px solid rgba(0, 255, 200, 0.15);
            border-bottom: 1px solid rgba(0, 255, 200, 0.15);
          }
          
          .info p {
            margin-bottom: 8px;
            font-size: 0.95em;
          }
          
          .info strong {
            color: #00ffc8;
            font-weight: 600;
          }
          
          ol, ul {
            margin-left: 20px;
            margin-bottom: 15px;
          }
          
          li {
            margin-bottom: 12px;
            line-height: 1.6;
            color: #c0c6ff;
          }
          
          .btn {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #00ffc8 0%, #00a8ff 100%);
            color: #0a0e27;
            text-decoration: none;
            margin-top: 25px;
            font-weight: 700;
            font-size: 1em;
            letter-spacing: 0.5px;
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 255, 200, 0.3);
            text-transform: uppercase;
            position: relative;
            overflow: hidden;
          }
          
          .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.2);
            transition: left 0.3s ease;
            z-index: -1;
          }
          
          .btn:hover {
            box-shadow: 0 6px 25px rgba(0, 255, 200, 0.5);
            transform: translateY(-2px);
          }
          
          .btn:hover::before {
            left: 100%;
          }
          
          .endpoint-list {
            background: rgba(0, 255, 200, 0.05);
            border: 1px solid rgba(0, 255, 200, 0.15);
            padding: 20px;
          }
          
          .endpoint-item {
            margin-bottom: 12px;
            padding: 10px 0;
            border-bottom: 1px solid rgba(0, 255, 200, 0.1);
          }
          
          .endpoint-item:last-child {
            border-bottom: none;
          }
          
          .endpoint-item code {
            background: rgba(0, 255, 200, 0.12);
            padding: 6px 12px;
            margin-right: 10px;
          }
          
          /* 响应式设计 */
          @media (max-width: 768px) {
            .container {
              margin: 20px;
              padding: 20px;
            }
            
            h1 {
              font-size: 1.8em;
            }
            
            .btn {
              width: 100%;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>⚡ osu! OAuth Server</h1>
          <div class="subtitle">高性能 OAuth 认证服务 | 现代化架构</div>
          <p>这是一个用于处理 osu! API OAuth 认证的服务端。采用最新的安全标准和现代化设计。</p>
          
          <div class="info">
            <h3>📋 系统配置</h3>
            <p><strong>Client ID:</strong> <code>${config.clientId}</code></p>
            <p><strong>回调地址:</strong> <code>${config.redirectUri}</code></p>
            <p><strong>应用地址:</strong> <code>${config.webappUrl}</code></p>
          </div>

          <h3>🚀 快速开始</h3>
          <ol>
            <li>点击下方按钮启动 OAuth 认证流程</li>
            <li>在 osu! 官方网站登录并授权应用</li>
            <li>系统自动交换 token 并返回应用</li>
          </ol>

          <button class="btn" onclick="window.location.href='/auth'">启动 OAuth 认证</button>

          <h3>🔌 API 端点</h3>
          <div class="endpoint-list">
            <div class="endpoint-item">
              <code>/auth</code>
              <span>- 启动 OAuth 授权流程，重定向到 osu! 认证页面</span>
            </div>
            <div class="endpoint-item">
              <code>/callback</code>
              <span>- OAuth 回调端点，处理授权码交换</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
    });
  }

  // 路由：/auth - 开始 OAuth 流程
  if (path === "/auth") {
    const state = crypto.randomUUID(); // 生成随机 state
    const authUrl = new URL("https://osu.ppy.sh/oauth/authorize");
    authUrl.searchParams.set("client_id", config.clientId);
    authUrl.searchParams.set("redirect_uri", config.redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "public identify");
    authUrl.searchParams.set("state", state);

    console.log(`🔐 Starting OAuth flow with state: ${state}`);

    return Response.redirect(authUrl.toString(), 302);
  }

  // 路由：/callback - 处理 OAuth 回调
  if (path === "/callback") {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    console.log(`📨 Callback received - Code: ${code ? "✓" : "✗"}, State: ${state}`);

    // 检查是否有错误
    if (error) {
      console.error(`❌ OAuth error: ${error}`);
      return new Response(
        `OAuth 认证失败: ${error}`,
        { status: 400, headers: corsHeaders }
      );
    }

    // 检查是否有 code
    if (!code) {
      console.error("❌ No code received");
      return new Response(
        "缺少授权码",
        { status: 400, headers: corsHeaders }
      );
    }

    try {
      // 使用 code 换取 access token
      console.log("🔄 Exchanging code for access token...");
      console.log(`📋 Client ID: ${config.clientId}`);
      console.log(`📋 Redirect URI: ${config.redirectUri}`);
      console.log(`📋 Code length: ${code.length}`);
      
      const requestBody = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: config.redirectUri,
      });
      
      console.log("📤 Request body:", requestBody.toString());
      
      const tokenResponse = await fetch("https://osu.ppy.sh/oauth/token", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error(`❌ Token exchange failed: ${errorText}`);
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      console.log("✅ Access token received successfully!");
      console.log(`🚀 Redirecting to webapp: ${config.webappUrl}`);

      // 使用 HTML 页面将 token 通过 URL Fragment 传递
      // Fragment 不会发送到服务器，更安全且长度限制更宽松
      const html = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OAuth 成功</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
              background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0f1e3d 100%);
              background-attachment: fixed;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              color: #e0e6ff;
              position: relative;
              overflow: hidden;
            }
            
            /* 背景网格 */
            body::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: 
                linear-gradient(0deg, transparent 24%, rgba(0, 255, 200, 0.05) 25%, rgba(0, 255, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 200, 0.05) 75%, rgba(0, 255, 200, 0.05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(0, 255, 200, 0.05) 25%, rgba(0, 255, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 200, 0.05) 75%, rgba(0, 255, 200, 0.05) 76%, transparent 77%, transparent);
              background-size: 50px 50px;
              pointer-events: none;
              z-index: -2;
            }
            
            /* 装饰光线 */
            body::after {
              content: '';
              position: fixed;
              top: -50%;
              right: -20%;
              width: 100%;
              height: 200%;
              background: radial-gradient(circle, rgba(0, 255, 200, 0.1) 0%, transparent 70%);
              pointer-events: none;
              z-index: -1;
              animation: glow 3s ease-in-out infinite;
            }
            
            @keyframes glow {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
            
            .container {
              text-align: center;
              background: rgba(15, 30, 61, 0.7);
              padding: 60px 40px;
              border: 1px solid rgba(0, 255, 200, 0.2);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 
                          0 0 30px rgba(0, 255, 200, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              max-width: 450px;
              position: relative;
              z-index: 1;
            }
            
            h1 {
              font-size: 2em;
              margin-bottom: 30px;
              background: linear-gradient(135deg, #00ffc8 0%, #00a8ff 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-weight: 700;
              letter-spacing: 1px;
            }
            
            .spinner-container {
              margin: 40px 0;
            }
            
            .spinner {
              border: 3px solid rgba(0, 255, 200, 0.2);
              border-top: 3px solid #00ffc8;
              border-radius: 50%;
              width: 60px;
              height: 60px;
              animation: spin 1.5s linear infinite;
              margin: 0 auto;
              box-shadow: 0 0 20px rgba(0, 255, 200, 0.3);
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            .status-text {
              font-size: 1.1em;
              color: #c0c6ff;
              margin-top: 30px;
              letter-spacing: 0.5px;
            }
            
            .dots {
              display: inline-block;
              margin-left: 5px;
            }
            
            .dot {
              display: inline-block;
              width: 4px;
              height: 4px;
              background: #00ffc8;
              border-radius: 50%;
              margin: 0 2px;
              animation: pulse 1.4s infinite;
            }
            
            .dot:nth-child(1) { animation-delay: 0s; }
            .dot:nth-child(2) { animation-delay: 0.2s; }
            .dot:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes pulse {
              0%, 60%, 100% { opacity: 0.3; }
              30% { opacity: 1; }
            }
            
            .success-icon {
              font-size: 3.5em;
              margin-bottom: 20px;
              display: block;
              animation: scaleIn 0.6s ease-out;
            }
            
            @keyframes scaleIn {
              from {
                transform: scale(0);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <span class="success-icon">✓</span>
            <h1>认证成功</h1>
            <div class="spinner-container">
              <div class="spinner"></div>
            </div>
            <p class="status-text">
              正在返回应用
              <span class="dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </span>
            </p>
          </div>
          <script>
            (function() {
              const tokenData = ${JSON.stringify(tokenData)};
              
              // 将 token 数据编码为 URL Fragment
              const fragment = new URLSearchParams({
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_in: tokenData.expires_in.toString(),
                token_type: tokenData.token_type
              }).toString();
              
              // 重定向到 webapp，使用 # 传递 token（更安全，不会发送到服务器）
              const redirectUrl = '${config.webappUrl}#' + fragment;
              
              setTimeout(() => {
                window.location.href = redirectUrl;
              }, 1500);
            })();
          </script>
        </body>
        </html>
      `;

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
      });

    } catch (error) {
      console.error("❌ Error:", error);
      return new Response(
        `服务器错误: ${error instanceof Error ? error.message : "未知错误"}`,
        { status: 500, headers: corsHeaders }
      );
    }
  }

  // 404 - 未找到
  return new Response("404 - Not Found", { 
    status: 404, 
    headers: corsHeaders 
  });
}

console.log(`✨ Server running on http://localhost:${config.port}`);
await serve(handler, { port: config.port });
