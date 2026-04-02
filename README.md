# Simple Blog - Backend & Frontend Separate

Ứng dụng blog đã được tách thành hai phần: Backend và Frontend

## Cấu trúc

```
simple-blog-8080/
├── backend/          # API Express.js
│   ├── package.json
│   └── api.cjs
├── frontend/         # React + Vite
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
└── README.md
```

## Backend

**Port:** 3000

### Installation

```bash
cd backend
npm install
```

### Run

```bash
npm start
# hoặc
npm run dev
```

API sẽ chạy trên `http://localhost:3000`

### API Endpoints

- `GET /` - Check API status
- `GET /api/posts` - Get all posts
- `GET /api/posts/:slug` - Get post by slug
- `GET /api/users` - Get all users
- `POST /api/login` - Login endpoint

## Frontend

**Port:** 8080

### Installation

```bash
cd frontend
npm install
```

### Run Development

```bash
npm run dev
```

Frontend sẽ chạy trên `http://localhost:8080`

Tất cả các request `/api/*` sẽ được proxy đến backend trên port 3000

### Build Production

```bash
npm run build
```

## Chạy cả hai từ project root

Chạy backend:
```bash
cd backend && npm start
```

Chạy frontend (terminal khác):
```bash
cd frontend && npm run dev
```

## Credentials

- **Admin:** username: `admin`, password: `123456`
- **User:** username: `user`, password: `123456`
