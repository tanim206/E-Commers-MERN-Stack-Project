# 🚀 User Management & Authentication API

This document explains the **full project flow from start to finish** and lists **all API requests in order**.

---

## 📌 Project Overview

This is a **complete backend project** built with:

* Node.js
* Express.js
* MongoDB (Mongoose)

The project handles:

* User registration with email verification
* Login & logout using JWT and cookies
* User management (CRUD)
* Admin control (ban/unban)
* Image upload

---

## 🧠 Project Flow (Start ➜ End)

```text
1. User registers
2. Activation email is sent
3. User activates account
4. User logs in
5. Access protected routes
6. Admin manages users
7. User updates or deletes account
8. User logs out
```

---

## ⚙️ Project Setup

### Install dependencies

```bash
npm install
```

### Run server

```bash
npm run dev
```

---

## 🌐 Base URL

```text
http://localhost:5000/api
```

---

## 🚀 ALL API REQUESTS (START TO END)

---

### 1️⃣ Register User (Process Registration)

```http
POST /users/process-register
```

**Form-data**

```
name
email
password
phone
address
image (optional)
```

➡️ Sends activation email with token

---

### 2️⃣ Activate User Account

```http
POST /users/activate
```

**Body (JSON)**

```json
{
  "token": "ACTIVATION_JWT_TOKEN"
}
```

➡️ Creates user in database

---

### 3️⃣ Login User

```http
POST /auth/login
```

**Body (JSON)**

```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

➡️ JWT stored in cookie

---

### 4️⃣ Get Logged-in User (Protected)

```http
GET /users/:id
```

🍪 Cookie required

---

### 5️⃣ Get All Users (Admin Only)

```http
GET /users?search=&page=1&limit=5
```

---

### 6️⃣ Update User

```http
PUT /users/:id
```

**Form-data**

```
name
password
phone
address
image
```

---

### 7️⃣ Delete User

```http
DELETE /users/:id
```

---

### 8️⃣ Ban User (Admin)

```http
PUT /users/manage-user/:id
```

**Body (JSON)**

```json
{
  "action": "ban"
}
```

---

### 9️⃣ Unban User (Admin)

```http
PUT /users/manage-user/:id
```

**Body (JSON)**

```json
{
  "action": "unban"
}
```

---

### 🔟 Logout User

```http
POST /auth/logout
```

---

### 1️⃣1️⃣ Seed Users (Development Only)

```http
GET /seed/users
```

⚠️ Deletes all users and inserts dummy data

---

## 🧪 Common API Response

### ✅ Success

```json
{
  "success": true,
  "message": "Success message",
  "payload": {}
}
```

### ❌ Error

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🔐 Authentication Rules

* Cookie-based JWT
* Admin-only routes protected
* Banned users cannot login
* Email cannot be updated

---

## 🏁 Summary

✔ Full authentication flow
✔ Secure user management
✔ Admin control
✔ Production-ready backend structure

---

👨‍💻 Author: **Mohammad Tashim Shantanu**
