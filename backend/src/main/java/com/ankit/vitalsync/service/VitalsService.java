package com.ankit.vitalsync.service;

import com.ankit.vitalsync.model.Patient;
import com.ankit.vitalsync.repository.PatientRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
public class VitalsService {
    private final PatientRepository repository;
    private final RedisTemplate<String, Object> redisTemplate;

    public VitalsService(PatientRepository repository, RedisTemplate<String, Object> redisTemplate) {
        this.repository = repository;
        this.redisTemplate = redisTemplate;
    }

    public Patient updateVitals(Long id, double heartRate, double oxygen) {
        // 1. Database (Postgres) se patient uthao
        Patient patient = repository.findById(id).orElseThrow();

        // 2. Data update karo
        patient.setLastHeartRate(heartRate);
        patient.setLastOxygenLevel(oxygen);
        patient.setLastUpdate(LocalDateTime.now());

        // 3. Postgres mein save karo (Permanent Storage)
        Patient updatedPatient = repository.save(patient);

        // 4. Redis mein bhi save karo (Fast Access - 10 min ke liye)
        redisTemplate.opsForValue().set("patient:" + id, updatedPatient, 10, TimeUnit.MINUTES);

        System.out.println("Vitals Updated & Cached for Patient ID: " + id);
        return updatedPatient;
    }
}