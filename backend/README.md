# Padepokan SUHU AICENG - Backend API

Backend server untuk aplikasi Padepokan SUHU AICENG yang menyediakan API untuk autentikasi dan manajemen data pengguna.

## 🚀 Fitur

- **Autentikasi**: Registrasi, login, dan Google OAuth
- **Manajemen Pengguna**: Penyimpanan data pengguna yang aman
- **Pelacakan Progres**: Penyimpanan progres pembelajaran pengguna
- **Keamanan**: Password hashing, JWT tokens, rate limiting
- **Backup Database**: Sistem backup otomatis

## 🛠️ Teknologi

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, Rate Limiting

## 📋 API Endpoints

### Autentikasi

- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/google` - Autentikasi Google OAuth

### Pengguna

- `GET /api/user/profile` - Dapatkan profil pengguna

### Pelajaran

- `POST /api/lessons/progress` - Update progres pelajaran
- `GET /api/lessons/progress` - Dapatkan progres pelajaran

### System

- `GET /api/health` - Health check

## 🚀 Cara Menjalankan

### Prasyarat

- Node.js 18+
- npm atau bun

### Langkah-langkah

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Edit .env file dengan konfigurasi yang sesuai
   ```

3. **Jalankan server**

   ```bash
   npm run dev
   ```

   Server akan berjalan di http://localhost:3001

4. **Health check**
   ```bash
   curl http://localhost:3001/api/health
   ```

## 🔐 Keamanan

### Password Hashing

Password disimpan menggunakan bcryptjs dengan salt round 12.

### JWT Tokens

Token JWT digunakan untuk autentikasi dengan expiry 7 hari.

### Rate Limiting

API dibatasi 100 request per 15 menit per IP.

### CORS

CORS dikonfigurasi untuk domain frontend yang ditentukan.

## 💾 Database

### Struktur Tabel

**users**

- id (PRIMARY KEY)
- email (UNIQUE)
- nickname
- password_hash
- avatar
- provider (local/google)
- google_id
- created_at
- updated_at

**user_lessons**

- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- lesson_id
- status (not-started/in-progress/completed)
- completed_at
- created_at
- updated_at

### Backup Database

**Membuat backup**

```bash
npm run backup
```

**Melihat daftar backup**

```bash
npm run backup:list
```

**Restore backup**

```bash
npm run backup:restore ./backups/database-backup-2024-01-05T17-59-02Z.sqlite
```

## 🌐 Deployment

### Environment Variables Production

```env
PORT=3001
FRONTEND_URL=https://padepokaan-suhu-aiceng.vercel.app
JWT_SECRET=your-super-secret-production-key
DATABASE_PATH=./database.sqlite
```

### Dengan PM2 (Production)

```bash
npm install -g pm2
pm2 start server.js --name "padepokan-backend"
pm2 save
pm2 startup
```

## 🧪 Testing

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Registrasi Pengguna

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","nickname":"Test User","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔧 Troubleshooting

### Database Error

- Pastikan direktori memiliki permission write untuk membuat file database
- Cek path database di environment variables

### Port Already in Use

- Ubah PORT di file .env
- atau hentikan proses yang menggunakan port 3001

### CORS Error

- Pastikan FRONTEND_URL dikonfigurasi dengan benar
- Restart server setelah mengubah environment variables

## 📞 Support

Untuk masalah teknis, buka issue di repository GitHub atau hubungi tim development.

---

**Padepokan SUHU AICENG Backend** - Secure API Server 🚀
