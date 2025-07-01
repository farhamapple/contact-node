# Aplikasi Kontak Sederhana

Aplikasi web sederhana untuk mengelola kontak menggunakan Node.js, Express.js, MariaDB, dan Tailwind CSS.

## Fitur

- **Autentikasi**: Login dan register pengguna
- **Dashboard**: Halaman utama dengan statistik kontak
- **Manajemen Kontak**: Tambah, lihat, dan hapus kontak
- **Form Input**: Nama, Email, Nomor Telepon, dan Alamat
- **UI Modern**: Menggunakan Tailwind CSS untuk tampilan yang responsif

## Prasyarat

Pastikan sistem Anda sudah terinstal:

- Node.js (versi 14 atau lebih baru)
- MariaDB atau MySQL
- NPM atau Yarn

## Instalasi

### 1. Clone atau Download Project

Salin semua file ke direktori project Anda.

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

1. Login ke MariaDB/MySQL:

```bash
mysql -u root -p
```

2. Jalankan script SQL setup:

```sql
source database_setup.sql
```

Atau copy-paste isi file `database_setup.sql` ke command line MySQL.

### 4. Konfigurasi Database

Edit file `app.js` pada bagian konfigurasi database:

```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Ganti dengan username MySQL Anda
  password: "your_password", // Ganti dengan password MySQL Anda
  database: "contact_app",
});
```

### 5. Jalankan Aplikasi

```bash
npm start
```

Atau untuk development dengan auto-reload:

```bash
npm run dev
```

Aplikasi akan berjalan di http://localhost:3000

## Penggunaan

### 1. Register Akun Baru

- Kunjungi http://localhost:3000/register
- Isi username dan password
- Klik "Daftar"

### 2. Login

- Kunjungi http://localhost:3000/login
- Masukkan username dan password
- Klik "Masuk"

### 3. Dashboard

- Setelah login, Anda akan diarahkan ke dashboard
- Lihat statistik total kontak
- Akses menu cepat untuk menambah atau melihat kontak

### 4. Tambah Kontak

- Klik "Tambah Kontak" dari dashboard atau menu
- Isi semua field yang diperlukan:
  - Nama Lengkap
  - Email
  - Nomor Telepon
  - Alamat
- Klik "Simpan Kontak"

### 5. Lihat Daftar Kontak

- Klik "Daftar Kontak" dari menu
- Lihat semua kontak yang telah ditambahkan
- Hapus kontak dengan mengklik tombol hapus (ikon sampah)

## Struktur Project

```
contact-app/
├── app.js              # File utama aplikasi
├── package.json        # Dependencies dan scripts
├── database_setup.sql  # Script setup database
├── README.md          # Dokumentasi
└── views/             # Template EJS
    ├── login.ejs      # Halaman login
    ├── register.ejs   # Halaman register
    ├── dashboard.ejs  # Halaman dashboard
    ├── contacts.ejs   # Halaman daftar kontak
    └── add-contact.ejs # Halaman tambah kontak
```

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MariaDB/MySQL dengan mysql2
- **Template Engine**: EJS
- **Styling**: Tailwind CSS
- **Authentication**: bcryptjs untuk hashing password
- **Session**: express-session

## Fitur Keamanan

- Password di-hash menggunakan bcryptjs
- Session-based authentication
- SQL injection protection dengan prepared statements
- Input validation

## Default Login

Setelah menjalankan setup database, Anda dapat login dengan:

- **Username**: admin
- **Password**: 123456

## Troubleshooting

### Error Koneksi Database

1. Pastikan MariaDB/MySQL sudah running
2. Periksa konfigurasi database di `app.js`
3. Pastikan database `contact_app` sudah dibuat

### Port Sudah Digunakan

Jika port 3000 sudah digunakan, ubah di `app.js`:

```javascript
const PORT = 3001; // Ganti dengan port yang tersedia
```

### Dependencies Error

Hapus folder `node_modules` dan install ulang:

```bash
rm -rf node_modules
npm install
```

## Pengembangan Lanjutan

Beberapa fitur yang bisa ditambahkan:

- Edit kontak
- Pencarian kontak
- Import/Export kontak
- Foto profil kontak
- Kategori kontak
- Backup data

## Lisensi

Project ini bersifat open source dan dapat digunakan untuk pembelajaran.
"# contact-node" 
