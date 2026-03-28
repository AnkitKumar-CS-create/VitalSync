package com.ankit.vitalsync.repository;

import com.ankit.vitalsync.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional; // Ye import karo
import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    @Transactional(readOnly = true) // 🔥 YE LINE ADD KARO
    List<MedicalRecord> findByPatientId(Long patientId);
}