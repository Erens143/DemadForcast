# DeFo - Demand Forecasting Platform

Nền tảng SaaS cho dự báo nhu cầu sử dụng AI và xử lý dữ liệu thời gian.

## 🚀 Phase 1: Foundation & Authentication

### Công nghệ sử dụng
- **Backend**: FastAPI (Python 3.10+)
- **Frontend**: ReactJS + Tailwind CSS
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Authentication**: JWT + OAuth2

### Cấu trúc dự án
```
defo-platform/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── utils/
│   │   ├── database.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   └── main.py
│   ├── requirements.txt
│   └── env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   └── dashboard/
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── tailwind.config.js
```

## 🛠️ Setup và Chạy

### 1. Setup Database
```bash
# SQLite sẽ tự động tạo file database khi chạy lần đầu
# Không cần setup thêm gì cho development
```

### 2. Setup Backend
```bash
cd backend

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env từ env.example
cp env.example .env
# Chỉnh sửa DATABASE_URL trong file .env

# Chạy server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Setup Frontend
```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

## 📋 API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký user mới
- `POST /auth/login` - Đăng nhập
- `GET /auth/me` - Lấy thông tin user hiện tại

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check

## 🔐 Tính năng đã hoàn thành

### Backend
- ✅ Database models (User)
- ✅ JWT Authentication
- ✅ Password hashing với bcrypt
- ✅ User registration và login
- ✅ CORS middleware
- ✅ Environment configuration

### Frontend
- ✅ React app setup với Tailwind CSS
- ✅ Login form
- ✅ Register form
- ✅ Dashboard cơ bản
- ✅ JWT token management
- ✅ Protected routes

## 🎯 Bước tiếp theo (Phase 2)

1. **Project Management**
   - Tạo Project model
   - CRUD operations cho projects
   - User permissions

2. **Data Upload**
   - File upload functionality
   - Data validation
   - CSV/Excel processing

3. **Forecasting Models**
   - Model training endpoints
   - Results storage
   - Basic forecasting algorithms

## 📝 Ghi chú

- Backend chạy trên `http://localhost:8000`
- Frontend chạy trên `http://localhost:3000`
- API documentation có sẵn tại `http://localhost:8000/docs`
- SQLite database file sẽ được tạo tự động tại `backend/defo.db` 