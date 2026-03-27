package com.ankit.vitalsync.controller;

import com.ankit.vitalsync.model.Patient;
import com.ankit.vitalsync.repository.PatientRepository;
import com.ankit.vitalsync.service.VitalsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*") // Frontend connect karne ke liye
public class PatientController {

    private final PatientRepository patientRepository;
    private final VitalsService vitalsService;

    // Constructor Injection (Best Practice for Placements)
    public PatientController(PatientRepository patientRepository, VitalsService vitalsService) {
        this.patientRepository = patientRepository;
        this.vitalsService = vitalsService;
    }

    // 1. Saare patients dekhne ke liye (GET)
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // 2. Naya patient register karne ke liye (POST)
    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    // 3. REAL-TIME VITALS UPDATE (PUT) - Ye hai major code!
    @PutMapping("/{id}/vitals")
    public Patient updatePatientVitals(
            @PathVariable Long id,
            @RequestParam double heartRate,
            @RequestParam double oxygen) {
        return vitalsService.updateVitals(id, heartRate, oxygen);
    }
}