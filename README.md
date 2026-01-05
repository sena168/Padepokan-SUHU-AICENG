# Padepokan SUHU AICENG

Padepokan SUHU AICENG adalah platform edukasi untuk pembelajaran AI dan pengembangan keterampilan prompting yang terstruktur.

## 🚀 Tentang Proyek

**Padepokan SUHU AICENG** adalah aplikasi web yang dibangun untuk membantu pengguna menguasai teknik prompting AI melalui pendekatan bertahap dan terstruktur. Platform ini menawarkan berbagai kitab pembelajaran dengan sistem pelacakan progres yang komprehensif.

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM
- **Authentication**: Google OAuth 2.0
- **Deployment**: Vercel
- **State Management**: React Context API

## 📋 Fitur Utama

### ✅ Sudah Diimplementasikan

- **Sistem Autentikasi**: Login dengan Google OAuth
- **Manajemen Pengguna**: Penyimpanan lokal dengan localStorage
- **Kitab Pembelajaran**: 3 kitab pembelajaran dengan konten terstruktur
- **Pelacakan Progres**: Sistem pelacakan penyelesaian kitab
- **Dashboard Pengguna**: Tampilan progres dan statistik
- **Error Handling**: Error boundaries dan penanganan kesalahan yang komprehensif

### 🔄 Dalam Pengembangan

- Backend untuk penyimpanan data pengguna
- Sistem database yang aman
- Fitur backup data

## 🚀 Cara Menjalankan Proyek

### Prasyarat

- Node.js (versi 18 atau lebih tinggi)
- npm atau bun

### Langkah-langkah

1. **Clone repository**

   ```bash
   git clone https://github.com/sena168/Padepokaan-SUHU-AICENG.git
   cd Padepokaan-SUHU-AICENG
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   - Salin `.env.example` menjadi `.env`
   - Isi variabel lingkungan yang diperlukan:
     ```
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
     SEEDREAM_API_KEY=your_seedream_api_key
     ```

4. **Jalankan development server**

   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di http://localhost:168

5. **Build untuk production**
   ```bash
   npm run build
   ```

## 📁 Struktur Proyek

```
src/
├── components/          # Komponen UI yang dapat digunakan kembali
├── contexts/           # React contexts untuk state management
├── pages/              # Halaman aplikasi
├── utils/              # Utility functions
├── lib/                # Konfigurasi library
└── assets/             # Aset statis

externals/
├── AI_INSTRUCTIONS.md  # Panduan interaksi AI
├── plan.md            # Rencana pengembangan
├── progress-log.md     # Log progres pengembangan
├── debug-log.md       # Log debugging
├── urgent-prompt-list.md # Daftar tugas prioritas
└── external-notes.md  # Catatan konfigurasi dan rahasia
```

## 🔐 Keamanan

- Semua rahasia disimpan dalam file `.env` yang tidak di-track oleh Git
- File `.gitignore` sudah dikonfigurasi dengan benar untuk mengecualikan file sensitif
- Autentikasi menggunakan Google OAuth dengan token exchange yang aman

## 🌐 Deployment

Proyek ini dideploy menggunakan **Vercel** dan dapat diakses di:
**https://padepokaan-suhu-aiceng.vercel.app/**

### Konfigurasi Deployment

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables dikonfigurasi di dashboard Vercel

## 🤝 Kontribusi

Untuk berkontribusi pada proyek ini:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Kontak

- **Repository**: https://github.com/sena168/Padepokaan-SUHU-AICENG
- **Deployment**: https://padepokaan-suhu-aiceng.vercel.app/
- **Email**: suhuac3ng@gmail.com

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---

**Padepokan SUHU AICENG** - Menenun Sutra Digital 🎯
