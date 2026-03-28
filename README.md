# VitalSync — Smart Sieve Clinical Engine

> **A high-performance clinical monitoring ecosystem integrating real-time biometric telemetry with an intelligent clinical artifact analysis engine. Designed for high-acuity medical environments and clinical decision support.**

---

## 1. Executive Summary

VitalSync is a specialized Health-Tech platform developed to bridge the gap between live patient vitals and static diagnostic documentation. Specifically engineered from a **Bioinformatics** perspective, the system focuses on how unstructured data (PDF artifacts) can be dynamically mapped to real-time clinical parameters to assist in triage and patient management.

---

## 2. System Architecture

The application follows a decoupled client-server model, ensuring low-latency data updates and reliable binary data streaming for medical records.

| Component               | Layer               | Core Responsibilities                                                                          |
| :---------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| **React Frontend**      | Client Layer        | Real-time Dashboard, Clinical Vault UI, Recharts Visualization, and PDF Generation.            |
| **REST API**            | Communication Layer | High-throughput JSON and Multipart/FormData data exchange protocols.                           |
| **Spring Boot Backend** | Logic Layer         | Asynchronous Simulation Engine, Heuristic Smart Sieve Logic, and LOB Streaming Service.        |
| **Vital Simulator**     | Service Layer       | Multi-threaded background process generating stochastic clinical parameters every 2.5 seconds. |
| **PostgreSQL**          | Persistence Layer   | Relational data for Patient profiles and Binary Large Object (BLOB) storage for records.       |

---

## 3. Core Feature Implementation

### 3.1 The Smart Sieve Engine (Heuristic Analysis)

The core innovation of VitalSync is the analysis layer that parses uploaded artifacts based on file heuristics rather than simple storage:

- **Diagnostic Parsing:** Identified "Reports" (e.g., Blood Work) trigger a heuristic scan for clinical markers and verify range compliance.
- **Administrative Routing:** Documents identified as "Resumes" or professional profiles are categorized for administrative review.
- **Metadata Synchronization:** Every upload is automatically mapped to a unique Patient ID, ensuring 100% data integrity in the Clinical Vault.

### 3.2 High-Frequency Telemetry Simulation

The system features a dedicated SimulationService that mimics a live hospital monitor:

- **Heart Rate (HR):** Stochastic generation between 60.0 and 110.0 BPM.
- **Oxygen Saturation (SpO2):** Simulated between 85.0% and 100.0%.
- **Real-time Triage:** Visual state transitions to CRITICAL (Red UI state) when HR > 100 or SpO2 < 95.

---

## 4. API Documentation & Endpoints

### 4.1 Patient Management Services

| Method     | Endpoint             | Description                                     |
| :--------- | :------------------- | :---------------------------------------------- |
| **GET**    | `/api/patients`      | Fetch all patients with real-time vitals        |
| **POST**   | `/api/patients`      | Register a new clinical profile                 |
| **DELETE** | `/api/patients/{id}` | Purge patient data and associated vault records |

### 4.2 Clinical Vault & Artifact Services

| Method   | Endpoint                             | Description                                 | Response Type       |
| :------- | :----------------------------------- | :------------------------------------------ | :------------------ |
| **POST** | `/api/patients/{id}/upload`          | Upload PDF artifact to patient vault        | String (Status)     |
| **GET**  | `/api/patients/{id}/records`         | Fetch all artifact metadata for a patient   | List<MedicalRecord> |
| **GET**  | `/api/patients/record/{id}`          | Stream binary PDF data for secure preview   | Application/PDF     |
| **GET**  | `/api/patients/record/{id}/analysis` | Execute Smart Sieve Analysis on specific ID | JSON (Findings)     |

---

## 5. Technical Stack

| Domain                  | Technology        | Implementation Detail                                     |
| :---------------------- | :---------------- | :-------------------------------------------------------- |
| **Backend Framework**   | Spring Boot 3.2.4 | RESTful Services, JPA, and Asynchronous Task Execution.   |
| **Frontend Library**    | React.js 18       | Hooks-based state management with Tailwind CSS for UI.    |
| **Database Engine**     | PostgreSQL 15     | Relational mapping with OID-based LOB storage for files.  |
| **Data Visualization**  | Recharts          | Dynamic line charts for temporal data visualization.      |
| **Document Generation** | jsPDF / AutoTable | Client-side generation of authenticated clinical reports. |
| **Persistence Layer**   | Hibernate ORM     | Transactional management of patient-record relationships. |

---

## 6. Project Structure

```text
VitalSync/
├── frontend/                     # React Application Root
│   ├── src/
│   │   ├── pages/                # Dashboard.jsx, PatientDetail.jsx
│   │   ├── components/           # UI widgets (Vitals, Modals, Cards)
│   │   └── utils/                # API configurations and axios instances
│
└── backend/                      # Spring Boot Application Root
    └── src/main/java/com/ankit/vitalsync/
        ├── model/                # Entities (Patient.java, MedicalRecord.java)
        ├── repository/           # Data Access Layer (Spring Data JPA)
        ├── controller/           # REST Layer (PatientController.java)
        └── service/              # Logic Layer (SimulationService.java)
```

## 7. Future Enhancements

AI-Driven Clinical Interpretation — Integrate LLMs to interpret blood reports and suggest diagnostic pathways.

OCR Integration (Apache Tika) — Extract text from scanned medical images and non-digital PDF artifacts.

Dockerization — Containerize services for seamless deployment using Docker Compose.

Advanced Auth (Spring Security) — Implement JWT-based authentication and Role-Based Access Control (RBAC).

Predictive Analytics — Use historical data to predict clinical deterioration using ML models.

## 8. Setup and Installation

8.1 Database Initialization
Ensure PostgreSQL is active. Create a database named vitalsync:

SQL
CREATE DATABASE vitalsync;
8.2 Execution
Backend: Run ./mvnw clean spring-boot:run from the backend directory.

Frontend: Run npm install and npm run dev from the frontend directory.

## 9. Author

Ankit Kumar — Vellore Institute of Technology

Specialization: B.Tech Computer Science (Bioinformatics)

GitHub: AnkitKumar-CS-Create

> Developed for academic purposes to demonstrate Clinical Decision Support Systems (CDSS).
