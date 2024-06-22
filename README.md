# Web Permintaan pengelolaan logbook kp

## Panduan Penggunaan

1. **Clone repo ini**

   ```bash
   git clone https://github.com/DistTreS/PwebKlp3.git
   ```

2. **Install semua depedensi yang diperlukan**

   ```bash
   npm install
   ```

3. **Hidupkan MySQL XAMPP dan buat database & setting koneksi db pada config/config.json**

   ```bash
   "development": {
    "username": "root",
    "password": null,
    "database": "tbpweb",
    "host": "localhost",
    "dialect": "mysql"
   }
   ```

4. **Lakukan migrasi tabel dari Express ke MySQL**

   ```bash
   npx sequelize-cli db:migrate

   ```

5. **Jalankan seeder untuk mengirim data contoh ke dbL**

   ```bash
   npx sequelize-cli db:seed:all
   ```

6. **Jalankan Express dengan perintah**

   ```bash
   npx tailwindcss -i ./src/input.css -o ./assets/output.css --watch
   nodemon

   ```

7. **Untuk push perubahan silahkan buatlah branch baru terlebih dahulu**

   ```bash
   git checkout (nama_branch)
   git add .
   git commit -m "lihat profil"
   git push -u origin (nama_branch)
   ```
