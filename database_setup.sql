-- Database setup untuk Aplikasi Kontak
-- Jalankan perintah ini di MariaDB/MySQL

-- Buat database
CREATE DATABASE IF NOT EXISTS contact_app;
USE contact_app;

-- Tabel users untuk menyimpan data pengguna
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel contacts untuk menyimpan data kontak
CREATE TABLE IF NOT EXISTS contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nomor_telepon VARCHAR(20) NOT NULL,
    alamat TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index untuk performa yang lebih baik
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_nama ON contacts(nama);
CREATE INDEX idx_contacts_email ON contacts(email);

-- Contoh data user (password: 123456)
INSERT INTO users (username, password) VALUES 
('admin', '$2a$12$EMT0cshaJioBLHKbuqjpTu4mCBY/C/reN28kgQjdhwO0PImWNr6ZC');

SHOW TABLES;
DESCRIBE users;
DESCRIBE contacts;