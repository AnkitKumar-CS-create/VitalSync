package com.ankit.vitalsync.controller;

import com.ankit.vitalsync.model.Patient;
import com.ankit.vitalsync.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository repository;

    public PatientController(PatientRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Patient> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return repository.save(patient);
    }
}