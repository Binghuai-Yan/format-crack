# Format Crack

Format Crack 是一个在浏览器本地运行的格式化与可视化工具，用于处理 JSON、YAML、XML、CSV 和 Mermaid。输入内容默认不会上传到服务器，适合配置、接口响应和数据结构的快速检查。

## 功能

- JSON / YAML / XML 格式化、校验和树形节点预览
- CSV 表格预览与结构化解析
- Mermaid 实时 SVG 图表渲染
- 导入本地文件、下载格式化结果、复制分享链接
- 深色 / 浅色主题，响应式布局
- 实时防抖预览，节点和内容统计
- 纯前端静态应用，可用 Docker、Windows、Linux、Nginx 部署

## 本地开发

需要 Node.js 20 或更高版本：

```bash
npm install
npm run dev
```

生产构建和预览：

```bash
npm run typecheck
npm run build
npm run preview
```

## Docker 部署

```bash
docker build -t format-crack:latest .
docker run -d --name format-crack --restart unless-stopped -p 8080:80 format-crack:latest
```

访问 `http://localhost:8080`。使用 Compose：

```bash
docker compose up -d --build
```

GitHub Container Registry 已发布 `v0.1.0` 镜像，也可以直接运行：

```bash
docker pull ghcr.io/binghuai-yan/format-crack:v0.1.0
docker run -d --name format-crack --restart unless-stopped -p 8080:80 ghcr.io/binghuai-yan/format-crack:v0.1.0
```

## Windows 部署

### 方式一：Docker Desktop（推荐）

安装 Docker Desktop 后，在 PowerShell 进入项目目录：

```powershell
docker compose up -d --build
```

访问 `http://localhost:8080`。停止服务：

```powershell
docker compose down
```

### 方式二：Node 静态服务

安装 Node.js 20+，在 PowerShell 执行：

```powershell
npm ci
npm run build
npx serve -s dist -l 8080
```

也可以使用 IIS：将 `dist` 内容复制到 IIS 站点目录，并配置 URL Rewrite 将未知路径回退到 `index.html`。

## Linux 部署

Docker 方式同上。普通 Nginx 方式：

```bash
npm ci
npm run build
sudo mkdir -p /var/www/format-crack
sudo cp -r dist/* /var/www/format-crack/
```

将 `nginx.conf` 中的 root 调整为 `/var/www/format-crack` 后 reload Nginx。静态服务也可以使用：

```bash
npx serve -s dist -l 8080
```

## 性能与安全

- 所有解析在浏览器内完成，不上传源数据。
- 输入使用 260ms 防抖，避免每次按键都触发完整渲染。
- 节点视图限制展示前 45 个节点，防止异常大输入阻塞 UI；CSV 表格最多预览 59 行。
- XML 解析不启用外部实体；Mermaid 使用 strict 安全模式；代码中不使用 `eval`。
- 生产镜像采用多阶段构建和 Nginx 静态服务，镜像运行时不包含 Node.js。

## 使用的开源组件

| 组件 | 用途 | 许可证 |
| --- | --- | --- |
| React / React DOM | 用户界面 | MIT |
| Vite | 开发服务器与构建 | MIT |
| TypeScript | 类型系统 | Apache-2.0 |
| Mermaid | 图表渲染 | MIT |
| @xyflow/react | 节点图生态（依赖能力预留） | MIT |
| js-yaml | YAML 解析与序列化 | MIT |
| fast-xml-parser | XML 解析 | MIT |
| Papa Parse | CSV 解析与导出 | MIT |
| lucide-react | 图标 | ISC |

各组件的完整版本信息以 `package-lock.json` 和其上游许可证为准。

## 发布

项目使用 MIT License，详见 [LICENSE](LICENSE)。版本变化记录在 [CHANGELOG.md](CHANGELOG.md)。GitHub Actions 会在 `main` 分支构建静态产物，并在推送 `v*` 标签时发布 GHCR 镜像。

## 目录结构

```text
src/App.tsx       主界面和交互
src/lib.ts        解析、格式化、节点转换
src/styles.css    视觉主题与响应式布局
Dockerfile        多阶段生产镜像
nginx.conf        SPA 回退和静态资源缓存
```
