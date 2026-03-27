package com.ankit.vitalsync.controller;

import com.ankit.vitalsync.model.Patient;
import com.ankit.vitalsync.repository.PatientRepository;
import com.ankit.vitalsync.service.VitalsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173") // Professional restricted CORS
public class PatientController {

    private final PatientRepository patientRepository;
    private final VitalsService vitalsService;

    // Constructor Injection (Professional Standard)
    public PatientController(PatientRepository patientRepository, VitalsService vitalsService) {
        this.patientRepository = patientRepository;
        this.vitalsService = vitalsService;
    }

    // 1. Fetch All Patients: GET http://localhost:8080/api/patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // 2. Register New Patient: POST http://localhost:8080/api/patients
    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        // Automatically set timestamp if not provided
        if (patient.getLastUpdate() == null) {
            patient.setLastUpdate(java.time.LocalDateTime.now());
        }
        return patientRepository.save(patient);
    }

    // 3. Update Vitals: PUT http://localhost:8080/api/patients/{id}/vitals
    @PutMapping("/{id}/vitals")
    public Patient updatePatientVitals(
            @PathVariable Long id,
            @RequestParam double heartRate,
            @RequestParam double oxygen) {
        return vitalsService.updateVitals(id, heartRate, oxygen);
    }

    // 4. DELETE Patient Record: DELETE http://localhost:8080/api/patients/{id}
    // Iski wajah se "Operation Failed" error aa raha tha
    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            System.out.println(">>> Record Deleted for Patient ID: " + id);
        } else {
            throw new RuntimeException("Patient record not found with ID: " + id);
        }
    }
}