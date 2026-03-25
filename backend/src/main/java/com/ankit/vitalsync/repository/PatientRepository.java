package com.ankit.vitalsync.repository;

import com.ankit.vitalsync.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // Basic Save/Find functions apne aap mil jayenge!
}