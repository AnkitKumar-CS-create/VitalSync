# 🩺 VitalSync — Smart Sieve Clinical Engine

> A high-performance clinical monitoring system featuring real-time patient telemetry and an intelligent "Smart Sieve" document analysis engine. Built for high-acuity medical environments.

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.4-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-2024-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-Latest-FF4B4B?style=for-the-badge)

---

## 📖 Overview

**VitalSync** is a specialized Health-Tech platform designed to bridge the gap between live patient vitals and static medical documentation. The core innovation, the **Smart Sieve Engine**, automatically categorizes and analyzes uploaded clinical artifacts (PDFs) to provide instant diagnostic context, while the background simulation engine maintains a high-frequency stream of patient telemetry.

---

## 🏗️ Architecture

┌─────────────────────────────────────────────────────────┐
│ REACT FRONTEND (Port: 5173) │
│ │
│ • Real-time Vital Dashboard (Recharts integration) │
│ • Clinical Vault UI (Dynamic Artifact Cards) │
│ • Smart Analysis Modal (JSON Findings View) │
│ • Professional PDF Export (jsPDF Engine) │
└──────────────────────┬──────────────────────────────────┘
│ REST API Call (Multipart/JSON)
▼
┌─────────────────────────────────────────────────────────┐
│ SPRING BOOT BACKEND (Port: 8080) │
│ │
│ • Simulation Engine (Asynchronous Threading) │
│ • Smart Sieve Analysis Logic (Heuristic Parsing) │
│ • Binary Data Streaming (PostgreSQL LOB handles) │
│ • Transactional File Delivery Service │
└──────────┬───────────────────────┬──────────────────────┘
│ │
▼ ▼
┌──────────────────┐ ┌──────────────────────┐
│ VITAL SIMULATOR │ │ POSTGRESQL DATABASE │
│ (Background) │ │ │
│ │ │ • Patients Table │
│ Updates HR/O2 │ │ (Vitals, Profile) │
│ every 2.5s │ │ │
│ triggers alerts │ │ • Medical_Records │
└──────────────────┘ │ (Binary BLOB Data)│
└──────────────────────┘

---

## 🌟 Features

### 🧠 Smart Sieve Engine

- **Automated Artifact Categorization:** Dynamically distinguishes between administrative (Resumes) and clinical (Blood Reports) documents.
- **Intelligent Findings:** Generates a summary of clinical findings and metadata verification for every uploaded artifact.
- **Transactional Vault:** Securely stores medical records as **Large Objects (LOB)** in PostgreSQL with transactional integrity.

### 📈 Real-time Monitoring

- **Integrated Telemetry:** Interactive line charts for Heart Rate (BPM) and Oxygen Saturation (SpO2) using `Recharts`.
- **Automated Triage System:** Instant visual "CRITICAL" (Red) and "STABLE" (Green) status updates based on real-time vitals crossing clinical thresholds.
- **High-Frequency Synchronization:** Backend-to-Frontend sync every 2500ms for accurate telemetry.

### 📄 Clinical Reporting

- **Export Case Summary:** One-click generation of professional PDF reports with digitally verified biometric profiles.
- **Secure Preview:** Built-in PDF viewer for original document verification directly from the analysis modal.

---

## 🛠️ Tech Stack

| Layer                | Technology             | Purpose                          |
| -------------------- | ---------------------- | -------------------------------- |
| **Frontend**         | React.js 18            | Reactive UI & Dashboard State    |
| **Backend**          | Spring Boot 3.2.4      | API, Simulator & Business Logic  |
| **Database**         | PostgreSQL 15          | Relational & Binary Data Storage |
| **Visualization**    | Recharts               | Telemetry Data Plotting          |
| **Styling**          | Tailwind CSS           | Modern Biomedical Dark UI        |
| **PDF Generation**   | jsPDF / AutoTable      | Professional Report Export       |
| **State Management** | React Hooks (UseState) | Real-time Data Handling          |

---

## 📂 Project Structure

VitalSync/
├── frontend/ # React Vite Application
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx # Patient Registry & Triage List
│ │ │ └── PatientDetail.jsx # Telemetry & Smart Vault
│ │ └── components/ # Custom UI Widgets
│
└── backend/ # Maven Spring Boot Application
└── src/main/java/com/ankit/vitalsync/
├── model/ # JPA Entities (Patient, MedicalRecord)
├── repository/ # Data Access Layer (PostgreSQL)
├── controller/ # Smart Sieve & Artifact Endpoints
└── VitalsyncApplication.java # Core Application Boot

---

## 🚀 Getting Started

### 1. Database Configuration

Ensure PostgreSQL is running and create the database:

```sql
CREATE DATABASE vitalsync;
Update application.properties:

Properties
spring.datasource.url=jdbc:postgresql://localhost:5432/vitalsync
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
2. Run Backend (Spring Boot)
Bash
cd backend
./mvnw clean spring-boot:run
3. Run Frontend (React)
Bash
cd frontend
npm install
npm run dev
🎓 Specialized Context (Bioinformatics)
Developed as a capstone project with a focus on Specialized Clinical Informatics. The Smart Sieve engine serves as a foundation for future integration with OCR (Optical Character Recognition) libraries like Apache Tika and ML-based diagnostic models for automated report interpretation.

👤 Author
Ankit Kumar — VIT Vellore

Specialization: B.Tech CSE (Bioinformatics)

GitHub: @kumarankit9431780451-design

Developed with ❤️ using Java, React, and PostgreSQL.
```
