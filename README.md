# 🏞️ CholoGhuri.com Backend

A backend system powering **[CholoGhuri.com](https://chologhuri-com.vercel.app/)** — a travel and tour booking platform with robust modules for users, bookings, payments, authentication, tours, and divisions. Built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## 🌐 Project Website

[CholoGhuri.com](https://chologhuri-com.vercel.app/)

---

## 📚 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [API Routes](#-api-routes-and-endpoints)
- [Dependencies](#-dependencies)
- [Scripts](#-scripts)
- [Examples](#-examples)
- [Troubleshooting](#-troubleshooting)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🧭 Introduction

This backend system provides the API infrastructure for **CholoGhuri.com**, supporting:

- Authentication with JWT & Google OAuth
- User and admin management
- Tour creation with image uploads
- OTP verification & password reset
- PDF invoice generation & payment processing
- Modular RESTful routing and RBAC control

---

## ✨ Features

- 🔐 JWT & Google OAuth Authentication
- 📁 File Uploads (Cloudinary + Multer)
- 🧾 PDF Invoice Generation (PDFKit)
- 📧 Email Notifications (Nodemailer)
- 💳 Payment Integration (init, verify, invoice)
- 🌍 Role-based Access Control (RBAC)
- 🧪 Zod Validation Middleware
- 🚀 Modular Express Routing
- 🌱 MongoDB via Mongoose

---

## ⚙️ Installation

```bash
git clone https://github.com/istiak19/CholoGhuri.com-backend.git
cd CholoGhuri.com-backend
npm install
````

---

## 🚀 Usage

```bash
npm run dev
```

Runs in development mode using `ts-node-dev`.

---

## 🛠️ Configuration

Create a `.env` file in the root with the following:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/your-db
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FRONTEND_URL=http://localhost:5173
```

---

## 🛣️ API Routes and Endpoints

### 🔐 Auth (`/auth`)

| Method | Path               | Role              | Description             |
| ------ | ------------------ | ----------------- | ----------------------- |
| POST   | `/login`           | Public            | User login              |
| POST   | `/refresh-token`   | Public (w/ token) | Get new access token    |
| POST   | `/logout`          | Authenticated     | Log out                 |
| POST   | `/forget-password` | Public            | Request reset link      |
| POST   | `/reset-password`  | Auth (via token)  | Reset password          |
| POST   | `/change-password` | ADMIN, USER, etc. | Change current password |
| GET    | `/google`          | Public            | Start Google login      |
| GET    | `/google/callback` | Public            | Google login callback   |

---

### 👤 User (`/user`)

| Method | Path        | Role                | Description              |
| ------ | ----------- | ------------------- | ------------------------ |
| POST   | `/register` | Public              | Create a user            |
| GET    | `/get-me`   | Authenticated       | Get current user profile |
| GET    | `/all-user` | ADMIN, SUPER\_ADMIN | Get all users            |
| GET    | `/:id`      | ADMIN, SUPER\_ADMIN | Get specific user        |
| PATCH  | `/:id`      | Role-matched        | Update user details      |

---

### 🗺️ Division (`/division`)

| Method | Path      | Role                | Description     |
| ------ | --------- | ------------------- | --------------- |
| GET    | `/`       | Public              | All divisions   |
| GET    | `/:slug`  | Public              | Get by slug     |
| POST   | `/create` | ADMIN, SUPER\_ADMIN | Add a division  |
| PATCH  | `/:id`    | ADMIN, SUPER\_ADMIN | Update division |
| DELETE | `/:id`    | ADMIN, SUPER\_ADMIN | Delete division |

---

### 🧳 Tour (`/tour`)

#### Tour Types

| Method | Path                | Role                | Description      |
| ------ | ------------------- | ------------------- | ---------------- |
| GET    | `/tour-types`       | Public              | All types        |
| POST   | `/create-tour-type` | ADMIN, SUPER\_ADMIN | Create tour type |
| PATCH  | `/tour-types/:id`   | ADMIN, SUPER\_ADMIN | Update tour type |
| DELETE | `/tour-types/:id`   | ADMIN, SUPER\_ADMIN | Delete tour type |

#### Tours

| Method | Path      | Role                | Description                 |
| ------ | --------- | ------------------- | --------------------------- |
| GET    | `/`       | Public              | List all tours              |
| POST   | `/create` | ADMIN, SUPER\_ADMIN | Create a tour (file upload) |
| PATCH  | `/:id`    | ADMIN, SUPER\_ADMIN | Update tour                 |
| DELETE | `/:id`    | ADMIN, SUPER\_ADMIN | Delete tour                 |

---

### 📦 Booking (`/booking`)

| Method | Path                 | Role                | Description                 |
| ------ | -------------------- | ------------------- | --------------------------- |
| POST   | `/`                  | Authenticated       | Create booking              |
| GET    | `/`                  | ADMIN, SUPER\_ADMIN | All bookings                |
| GET    | `/my-bookings`       | Authenticated       | Get current user's bookings |
| GET    | `/:bookingId`        | Authenticated       | Single booking by ID        |
| PATCH  | `/:bookingId/status` | Authenticated       | Update booking status       |

---

### 💳 Payment (`/payment`)

| Method | Path                       | Role          | Description                  |
| ------ | -------------------------- | ------------- | ---------------------------- |
| POST   | `/init-payment/:bookingID` | Public        | Start payment                |
| POST   | `/validate-payment`        | Public        | Confirm payment              |
| POST   | `/success`                 | Public        | Success webhook              |
| POST   | `/fail`                    | Public        | Fail webhook                 |
| POST   | `/cancel`                  | Public        | Cancel webhook               |
| GET    | `/invoice/:id`             | Authenticated | View PDF invoice for booking |

---

### 🔢 OTP (`/otp`)

| Method | Path      | Role   | Description            |
| ------ | --------- | ------ | ---------------------- |
| POST   | `/send`   | Public | Send verification code |
| POST   | `/verify` | Public | Verify submitted code  |

---

### 📊 Statistics (`/statistics`)

| Method | Path       | Role                | Description   |
| ------ | ---------- | ------------------- | ------------- |
| GET    | `/user`    | ADMIN, SUPER\_ADMIN | User stats    |
| GET    | `/booking` | ADMIN, SUPER\_ADMIN | Booking stats |
| GET    | `/tour`    | ADMIN, SUPER\_ADMIN | Tour stats    |
| GET    | `/payment` | ADMIN, SUPER\_ADMIN | Payment stats |

---

## 📦 Dependencies

### Core

* `express`, `mongoose`, `passport`, `jsonwebtoken`
* `multer`, `cloudinary`, `nodemailer`, `pdfkit`
* `cookie-parser`, `http-status-codes`, `dotenv`

### Dev

* `typescript`, `ts-node-dev`, `eslint`
* `@types/*`, `typescript-eslint`

---

## 📜 Scripts

| Script         | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start server in dev mode |
| `npm run lint` | Lint source files        |
| `npm test`     | (Placeholder for tests)  |

---

## 🧪 Examples (Coming Soon)

* Auth login/register
* PDF invoice preview
* File upload via Postman
* Booking/payment flows

---

## 🛠️ Troubleshooting

* **CORS errors**: Verify `FRONTEND_URL` is correctly whitelisted.
* **File upload fails**: Ensure `multipart/form-data` is used and Cloudinary keys are valid.
* **Session not persisting**: Use HTTPS and set proper cookie flags.
* **Google OAuth fails**: Check redirect URIs in Google Console.

---

## 👥 Contributors

| Name         | GitHub                                   |
| ------------ | ---------------------------------------- |
| Istiak Ahmed | [@istiak19](https://github.com/istiak19) |