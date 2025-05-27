![image](https://github.com/user-attachments/assets/d7d19b0b-c4e7-4dd9-a57c-292f919d1419)
# 📘 Crypto Portfolio Tracker API Documentation

## 🛡️ Authentication

### 🔐 Register
**Endpoint**: `POST /auth/register`  
**Deskripsi**: Register akun baru.

**Request**
```json
{
  "username": "John Doe",
  "email": "johndoe@gmail.com",
  "password": "johndoe123"
}
```

---

### 🔑 Login
**Endpoint**: `POST /auth/login`  
**Deskripsi**: Login user dan dapatkan token autentikasi (JWT).

**Request**
```json
{
  "email": "johndoe@gmail.com",
  "password": "johndoe123"
}
```

---

### 🔓 Logout
**Endpoint**: `POST /auth/logout`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Logout user.

---

## 👤 User

### 📄 Lihat Profil
**Endpoint**: `GET /users/me`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Melihat data profil user yang sedang login.

---

### 📝 Update Profil
**Endpoint**: `PUT /users/me`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Mengubah nama atau email user.

**Request**
```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

---

### 💰 Update Saldo
**Endpoint**: `PUT /users/me/balance`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Menambahkan saldo user.

**Request**
```json
{
  "amount": 100000
}
```

---

### ❌ Hapus Akun
**Endpoint**: `DELETE /users/me`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Menghapus akun user.

---

## 💼 Portfolio

### 📊 Lihat Portofolio
**Endpoint**: `GET /portfolio`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Menampilkan seluruh coin yang dimiliki user.

---

### ➕ Tambah Portofolio
**Endpoint**: `POST /portfolio`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Tambah data coin ke portofolio.

**Request**
```json
{
  "coin_name": "bitcoin",
  "total_coin": 0.5,
  "image_url": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
}
```

---

### ✏️ Update Jumlah Coin
**Endpoint**: `PUT /portfolio/:coin_name`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Update jumlah coin berdasarkan nama coin.

**Contoh Endpoint**
```
PUT /portfolio/bitcoin
```

**Request**
```json
{
  "total_coin": 1.0
}
```

---

### 🗑️ Hapus Coin dari Portofolio
**Endpoint**: `DELETE /portfolio/:coin_name`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Menghapus coin dari portofolio.

**Contoh Endpoint**
```
DELETE /portfolio/bitcoin
```

---

## 💸 Transactions

### 📜 Lihat Riwayat Transaksi
**Endpoint**: `GET /transactions`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Melihat seluruh transaksi user.

---

### 🛒 Beli Coin
**Endpoint**: `POST /transactions/buy`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Melakukan pembelian coin.

**Request**
```json
{
  "coin_name": "dogecoin",
  "amount_usd": 1000
}
```

---

### 💵 Jual Coin
**Endpoint**: `POST /transactions/sell`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Menjual coin.

**Request**
```json
{
  "coin_name": "bitcoin",
  "amount_coin": 0.0001
}
```

---

### ✏️ Edit Transaksi
**Endpoint**: `PUT /transactions/:id`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Mengedit data transaksi berdasarkan ID.

**Contoh Endpoint**
```
PUT /transactions/1
```

**Request**
```json
{
  "amount_coin": 0.2,
  "total_value": 2000,
  "type": "buy",
  "coin_name": "bitcoin"
}
```

---

### 🗑️ Hapus Transaksi
**Endpoint**: `DELETE /transactions/:id`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Menghapus transaksi berdasarkan ID.

**Contoh Endpoint**
```
DELETE /transactions/1
```

---

## 🪙 Coins (Public API)

### 🌟 Lihat Top Coin
**Endpoint**: `GET /coins`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Menampilkan 10 coin terpopuler.

---

### 📈 Detail Coin
**Endpoint**: `GET /coins/:coin_name`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Mendapatkan detail coin tertentu.

**Contoh Endpoint**
```
GET /coins/bitcoin
```

---

### 📊 Riwayat Harga Coin
**Endpoint**: `GET /coins/:coin_name/history?days=7`  
**Header**: `Authorization: Bearer <token>`  
**Deskripsi**: Mendapatkan riwayat harga coin dalam N hari terakhir.

**Contoh**
```
GET /coins/bitcoin/history?days=7
```

---

> 📌 **Catatan:**  
> - Selalu kirim token JWT pada header `Authorization` untuk endpoint yang membutuhkan autentikasi.  
> - Endpoint coin mengambil data dari [CoinGecko API](https://www.coingecko.com/en/api](https://docs.coingecko.com/v3.0.1/reference/introduction).
