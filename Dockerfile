# Gunakan image resmi Node.js versi LTS
FROM node:18

# Set direktori kerja dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Expose port (ubah jika app Anda pakai port lain)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["node", "app.js"]
