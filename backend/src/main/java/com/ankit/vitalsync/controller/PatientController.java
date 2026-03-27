package com.ankit.vitalsync.controller;

import com.ankit.vitalsync.model.Patient;
import com.ankit.vitalsync.model.MedicalRecord;
import com.ankit.vitalsync.repository.PatientRepository;
import com.ankit.vitalsync.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    @Autowired
    private PatientRepository repository;

    @Autowired
    private MedicalRecordRepository recordRepository;

    @GetMapping
    public List<Patient> getAllPatients() {
        return repository.findAll();
    }

    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return repository.save(patient);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id) {
        repository.deleteById(id);
    }

    // --- MEDICAL VAULT ENDPOINTS ---

    @PostMapping("/{id}/upload")
    public ResponseEntity<String> uploadRecord(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Patient patient = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));

            MedicalRecord record = new MedicalRecord();
            record.setFileName(file.getOriginalFilename());
            record.setFileType(file.getContentType());
            record.setData(file.getBytes());
            record.setPatient(patient);

            recordRepository.save(record);
            return ResponseEntity.ok("Upload Success");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/records")
    public List<MedicalRecord> getPatientRecords(@PathVariable Long id) {
        return recordRepository.findByPatientId(id);
    }

    @GetMapping("/record/{recordId}")
    public ResponseEntity<byte[]> downloadRecord(@PathVariable Long recordId) {
        MedicalRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(record.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + record.getFileName() + "\"")
                .body(record.getData());
    }
}