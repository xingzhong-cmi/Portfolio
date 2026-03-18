# Folio MVP

Folio 是一个艺术家作品集托管平台（MVP），当前仓库已完成第一阶段：
- `frontend/`：Next.js 14 + TypeScript + Tailwind 脚手架与认证页面
- `backend/`：FastAPI 路由结构与 Supabase JWT 鉴权骨架
- `backend/sql/schema.sql`：完整 PostgreSQL Schema + RLS Policies

## 目录

```txt
/frontend
/backend
```

## 环境变量

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
FRONTEND_ORIGIN=http://localhost:3000
```

## 本地启动

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 当前实现进度（第一阶段）

- ✅ 脚手架（frontend/backend）
- ✅ SQL Schema + RLS
- ✅ Auth 页面（register/login）
- ✅ 登录后跳转 `/dashboard`
- ✅ 受保护页面（`/dashboard`, `/editor`, `/preview`）

## 待后续模块实现

- 模块 1：图片上传 + R2 上传与删除
- 模块 2：模板选择器 + 三套模板完善
- 模块 3：公开作品集页面 + public API
- 模块 4：发布流程 + Dashboard 完善
