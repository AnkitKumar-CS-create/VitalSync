<p align="center"><img src="frontend/src/assets/vitalsync-logo.png" width="45" /> VitalSync — Smart Sieve Clinical Engine</p>
An advanced Health-Tech ecosystem integrating real-time biometric telemetry with an intelligent clinical artifact analysis engine.

📑 Project Overview
VitalSync is a production-grade clinical monitoring solution designed for high-acuity medical environments. It addresses the critical need for synchronizing live patient vitals with static diagnostic documentation. The platform utilizes a specialized Smart Sieve Engine that provides automated triage suggestions and metadata verification for medical artifacts, specialized for Bioinformatics and Clinical Informatics workflows.

Component,Layer,Core Responsibilities
React Frontend,Client Layer,"Real-time Dashboard, Clinical Vault UI, Telemetry Visualization (Recharts), and PDF Generation."
REST API,Communication,High-throughput JSON and Multipart/FormData data exchange protocols.
Spring Boot Backend,Logic Layer,"Asynchronous Simulation Engine, Heuristic Smart Sieve Logic, and LOB Streaming Service."
Vital Simulator,Service Layer,Multi-threaded background process generating stochastic clinical parameters every 2.5 seconds.
PostgreSQL,Data Layer,Relational storage for Patient profiles and Binary Large Object (BLOB) storage for medical records.

🌟 Technical Deep Dive

1. The Smart Sieve Engine (Heuristic Analysis)
   The core innovation of this project is the analysis engine. Instead of standard file storage, VitalSync implements a logic layer that parses artifacts:

Diagnostic Parsing: If an artifact is identified as a "Report" (e.g., Blood Report), the engine simulates a scan for clinical markers (Hemoglobin, Glucose) and verifies range compliance.

Metadata Synchronization: Every upload is automatically mapped to a unique Patient UUID, ensuring 100% data integrity in the Clinical Vault.

Security: Implements transactional consistency during the streaming of Large Objects (LOB) from PostgreSQL to the client.

2. High-Frequency Telemetry Simulation
   The system features a dedicated SimulationService that mimics a live hospital monitor:

Heart Rate (HR): Stochastic generation between 60.0 and 110.0 BPM.

Oxygen Saturation (SpO2): Simulated between 85.0% and 100.0%.

Real-time Triage: Visual state transitions to CRITICAL (Red) when HR > 100 or SpO2 < 95, allowing for immediate clinical intervention.

Method,Endpoint,Description,Payload Example
GET,/api/patients,Fetch all patients + real-time vitals,[]
POST,/api/patients,Register a new clinical profile,"{ ""name"": ""Ankit"", ""age"": 21 }"
DELETE,/api/patients/{id},Purge patient data & vault records,N/A

Method,Endpoint,Description,Response Type
POST,/api/patients/{id}/upload,Upload PDF artifact to patient vault,String (Success)
GET,/api/patients/{id}/records,Fetch all artifact metadata,List<MedicalRecord>
GET,/api/patients/record/{id},Stream binary PDF for secure preview,Application/PDF
GET,/api/patients/record/{id}/analysis,Execute Smart Sieve Analysis,JSON (Findings)

Domain,Technology,Implementation Detail
Backend,Spring Boot 3.2.4,"RESTful Services, JPA, and Async Task Execution."
Frontend,React.js 18,Hooks-based state management with Tailwind CSS styling.
Database,PostgreSQL 15,Relational mapping with OID-based LOB storage.
Monitoring,Recharts,Dynamic line charts for temporal data visualization.
Reporting,jsPDF / AutoTable,Client-side generation of authenticated clinical reports.
Icons,Lucide React,High-fidelity medical and system iconography.

📂 Project Structure & Module Breakdown
Plaintext
VitalSync/
├── frontend/ # React Application Root
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx # Patient Registry & Global Triage View
│ │ │ └── PatientDetail.jsx # Real-time Monitor & Smart Vault Integration
│ │ ├── components/ # Reusable UI widgets (Vitals, Modals, Cards)
│ │ └── utils/ # API configurations and helper functions
│
└── backend/ # Spring Boot Application Root
└── src/main/java/com/ankit/vitalsync/
├── model/ # JPA Entities (Patient.java, MedicalRecord.java)
├── repository/ # Persistence Layer (Spring Data JPA)
├── controller/ # REST Layer (PatientController.java)
└── VitalsyncApplication # Core entry point with CORS configuration

⚙️ Installation and Environment Setup

1. Database Initialization
   Ensure PostgreSQL is active. Create a database named vitalsync:

SQL
CREATE DATABASE vitalsync;

2. Configure Backend
   Navigate to src/main/resources/application.properties and configure:

Properties
spring.datasource.url=jdbc:postgresql://localhost:5432/vitalsync
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update

3. Build & Execution
   Terminal 1 (Backend):

Bash
cd backend
./mvnw clean spring-boot:run
Terminal 2 (Frontend):

Bash
cd frontend
npm install
npm run dev

🎓 Academic Context (Bioinformatics)
This project serves as a practical implementation of Clinical Decision Support Systems (CDSS). Developed with a focus on Bioinformatics, the Smart Sieve engine provides a modular framework for future integration with Natural Language Processing (NLP) for automated extraction of medical parameters from unstructured PDF artifacts.

👤 Developer Profile
Ankit Kumar — Vellore Institute of Technology

Degree: B.Tech Computer Science (Specialization: Bioinformatics)

Interests: Full-Stack Development, Health-Tech, Machine Learning.

GitHub: kumarankit9431780451-design

Disclaimer: This is a simulated clinical platform for academic purposes.
