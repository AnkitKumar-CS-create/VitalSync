package com.ankit.vitalsync.service;

import com.ankit.vitalsync.model.Patient;
import com.ankit.vitalsync.repository.PatientRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;

@Service
public class VitalsSimulator {

    private final VitalsService vitalsService;
    private final PatientRepository patientRepository;
    private final Random random = new Random();

    public VitalsSimulator(VitalsService vitalsService, PatientRepository patientRepository) {
        this.vitalsService = vitalsService;
        this.patientRepository = patientRepository;
    }

    // Har 5 second (5000ms) mein auto-run
    @Scheduled(fixedRate = 5000)
    public void simulateVitals() {
        List<Patient> patients = patientRepository.findAll();

        if (patients.isEmpty()) {
            System.out.println("SIMULATOR: No patients found. Please add a patient via POST request first.");
            return;
        }

        for (Patient p : patients) {
            // Random value generate: HR (65-105), Oxygen (94-100)
            double heartRate = 65 + (40 * random.nextDouble());
            double oxygen = 94 + (6 * random.nextDouble());

            // VitalsService ko call karo jo DB + Redis dono update karta hai
            vitalsService.updateVitals(p.getId(), heartRate, oxygen);

            System.out.println("SIMULATOR >>> Updated " + p.getName() + " | HR: " + String.format("%.1f", heartRate)
                    + " | O2: " + String.format("%.1f", oxygen));
        }
    }
}