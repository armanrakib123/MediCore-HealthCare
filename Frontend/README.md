# 🏥 Smart Prescription Tracker (MediCore)

> 🚀 **SLT Company Internship Sample Project** by the **Smart Prescription Tracker Team**

A full-stack healthcare web application designed to streamline digital prescription workflows among **Patients**, **Doctors**, **Pharmacists**, and **Admins**.

---

## ✨ Project Highlights

- 🔐 Role-based authentication (JWT)
- 👨‍⚕️ Doctor prescription management
- 💊 Pharmacist queue & fulfillment workflow
- 🧑‍🦱 Patient prescription tracking dashboard
- 🔔 Notification-ready architecture
- 📦 MongoDB-backed API with clean service/repository structure
- 🎨 Modern React UI with responsive dashboards

---

## 🧰 Tech Stack

### Frontend
- ⚛️ React 19
- ⚡ Vite 7
- 🧭 React Router
- 🎯 Axios
- 🎨 Tailwind CSS
- 🧩 Lucide Icons

### Backend
- 🟣 ASP.NET Core Web API (`net10.0`)
- 🍃 MongoDB
- 🔐 JWT Authentication
- 🔒 BCrypt password hashing
- 📘 Swagger (Development)

---

## 📁 Repository Structure

```
smart-rx-frontend/
├── src/                     # React frontend
├── public/
├── HealthCarePlus.API/      # ASP.NET Core backend
├── Healthcare_System_Architecture.md
└── README.md
```

---

## ✅ Prerequisites

- Node.js **20.19+** (or 22.12+)
- npm
- .NET SDK **10.0**
- MongoDB (local or remote)

---

## ⚙️ Setup & Run

### 1) Clone repository

```bash
git clone <your-repo-url>
cd smart-rx-frontend
```

### 2) Run Backend API

```bash
cd HealthCarePlus.API
dotnet restore
dotnet run
```

Backend default URL:
- `http://localhost:5000`

### 3) Run Frontend

Open a new terminal:

```bash
cd smart-rx-frontend
npm install
npm run dev
```

Frontend default URL:
- `http://localhost:5173`

---

## 👥 User Roles

- 👨‍⚕️ **Doctor** – create & manage prescriptions
- 💊 **Pharmacist** – process queue, mark ready, manage fulfillment
- 🧑‍🦱 **Patient** – upload/view prescriptions, track status
- 🛡️ **Admin** – monitor and manage system modules

---

## 📌 Notes

- This project was built as an **internship sample project** under **SLT Company**.
- It demonstrates practical full-stack architecture, role workflows, and modern UI/UX patterns.

---

## 🌱 Future Enhancements

- 🤖 AI-driven medication validation
- 📊 Advanced analytics dashboards
- 📱 Improved communication modules (SMS / WhatsApp / push)
- ☁️ Cloud deployment pipeline

---

## 🙌 Team

**Smart Prescription Tracker Team**  
Internship Project • SLT Company

---

## 📄 License

This repository is for educational/internship demonstration purposes.
