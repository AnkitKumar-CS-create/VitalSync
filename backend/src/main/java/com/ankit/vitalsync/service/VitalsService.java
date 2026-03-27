package com.ankit.vitalsync.service;

import com.ankit.vitalsync.model.Patient;
import com.ankit.vitalsync.repository.PatientRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class VitalsService {

    private final PatientRepository patientRepository;
    private final Random random = new Random();

    public VitalsService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    /**
     * Simulator: Runs every 5 seconds.
     * Generates random vitals and saves to DB.
     */
    @Scheduled(fixedRate = 5000)
    public void simulateVitals() {
        List<Patient> patients = patientRepository.findAll();
        if (patients.isEmpty())
            return;

        for (Patient p : patients) {
            // Random Heart Rate: 60 - 120
            double hr = 60 + (60 * random.nextDouble());
            // Random Oxygen: 88 - 100
            double o2 = 88 + (12 * random.nextDouble());

            p.setLastHeartRate(hr);
            p.setLastOxygenLevel(o2);
            p.setLastUpdate(LocalDateTime.now());

            patientRepository.save(p);

            // Professional Clean Console Log (One line per patient)
            String status = (hr > 100 || o2 < 95) ? "CRITICAL 🚨" : "STABLE ✅";
            System.out.printf("SIMULATOR [%s] >>> %-15s | HR: %.1f | O2: %.1f%%\n",
                    status, p.getName(), hr, o2);
        }
        System.out.println("---------------------------------------------------------");
    }

    /**
     * Manual API Update
     */
    public Patient updateVitals(Long id, double heartRate, double oxygen) {
        Patient p = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient ID " + id + " not found"));

        p.setLastHeartRate(heartRate);
        p.setLastOxygenLevel(oxygen);
        p.setLastUpdate(LocalDateTime.now());

        return patientRepository.save(p);
    }
}