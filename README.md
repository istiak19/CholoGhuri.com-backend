# CholoGhuri.com Backend

A backend system powering **CholoGhuri.com**, designed to manage property holdings (PH) and related functionalities. This backend is built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**, offering support for authentication, file uploads, PDF generation, email notifications, and more.

---

## 🌐 Project Website

[CholoGhuri.com](https://www.chologhuri.com) *(Replace with actual link if different)*

---

## 📚 Table of Contents

* [Introduction](#introduction)
* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
* [Configuration](#configuration)
* [Dependencies](#dependencies)
* [Scripts](#scripts)
* [Examples](#examples)
* [Troubleshooting](#troubleshooting)
* [Contributors](#contributors)
* [License](#license)

---

## 🧭 Introduction

The PH Management System Backend serves as the backend API for CholoGhuri.com, a platform likely focused on property listings, user management, booking services, and more. It supports user authentication (including Google OAuth), secure sessions, file uploads (e.g. documents/images), email functionality, and PDF generation for invoices or reports.

---

## ✨ Features

* 🔐 Authentication (JWT, Local, Google OAuth)
* 🧾 PDF generation with **PDFKit**
* ☁️ Image & file upload with **Cloudinary** + **Multer**
* 📧 Email service via **Nodemailer**
* 📦 REST API with **Express.js**
* 🌱 MongoDB integration using **Mongoose**
* 🧹 Linting with ESLint and TypeScript support
* ♻️ Live reload via **ts-node-dev**
* 🔑 Session management and cookie parsing
* 🌍 CORS and security configuration

---

## ⚙️ Installation

```bash
git clone https://github.com/your-org/ph-management-system-backend.git
cd ph-management-system-backend
npm install
```

---

## 🚀 Usage

### Development Mode

```bash
npm run dev
```

This uses `ts-node-dev` for automatic reloads on changes.

---

## 🛠️ Configuration

Create a `.env` file in the root directory with the following (example):

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your-db
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 📦 Dependencies

**Core Dependencies:**

* `express`, `mongoose`, `jsonwebtoken`, `dotenv`
* `passport`, `passport-local`, `passport-google-oauth20`
* `multer`, `cloudinary`, `pdfkit`, `nodemailer`
* `cors`, `cookie-parser`, `http-status-codes`

**Dev Dependencies:**

* `typescript`, `ts-node-dev`
* `eslint`, `@types/*`, `typescript-eslint`

---

## 📜 Scripts

| Script         | Description                         |
| -------------- | ----------------------------------- |
| `npm run dev`  | Run the app in development mode     |
| `npm run lint` | Run ESLint on the `src` directory   |
| `npm test`     | Placeholder for future test scripts |

---

## 🧪 Examples

Examples coming soon:

* Auth request
* PDF generation
* Cloudinary upload

Let me know if you want me to add sample cURL or Postman code.

---

## 🛠️ Troubleshooting

* **CORS errors**: Make sure frontend origin is whitelisted.
* **Cloudinary upload issues**: Double-check your API credentials and file format.
* **Session not persisting**: Ensure proper cookie/session config in `.env` and frontend.

---

## 👥 Contributors

Feel free to add your name here. Example:

* [Your Name](https://github.com/yourusername)