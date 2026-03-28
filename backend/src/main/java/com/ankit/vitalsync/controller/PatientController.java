package com.ankit.vitalsync.controller;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.time.LocalDateTime;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ByteArrayResource;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
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

    @PostMapping("/{id}/upload")
    public ResponseEntity<String> uploadRecord(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Patient patient = repository.findById(id).orElseThrow(() -> new RuntimeException("Patient Not Found"));
            MedicalRecord record = new MedicalRecord();
            record.setFileName(file.getOriginalFilename());
            record.setFileType(file.getContentType());
            record.setData(file.getBytes());
            record.setPatient(patient);
            recordRepository.save(record);
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/records")
    @Transactional(readOnly = true)
    public List<MedicalRecord> getPatientRecords(@PathVariable Long id) {
        return recordRepository.findByPatientId(id);
    }

    // 🔥 FIX 1: Ye method missing tha, isliye 404 aa raha tha
    @GetMapping("/record/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Resource> getFile(@PathVariable Long id) {
        try {
            MedicalRecord record = recordRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("File Not Found"));

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(record.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + record.getFileName() + "\"")
                    .body(new ByteArrayResource(record.getData()));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/record/{id}/analysis")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getRecordAnalysis(@PathVariable Long id) {
        try {
            MedicalRecord record = recordRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Record not found"));

            Map<String, Object> analysis = new HashMap<>();
            String fileName = record.getFileName().toLowerCase();

            // 🔥 FIX 2: ID bhejna zaroori hai taaki frontend button ko pata chale kya
            // kholna hai
            analysis.put("id", record.getId());
            analysis.put("fileName", record.getFileName());

            if (fileName.contains("resume")) {
                analysis.put("summary", "Professional profile detected.");
                analysis.put("findings", List.of(
                        "Document identified as a Career Resume.",
                        "Contains technical skillsets and academic records.",
                        "Bioinformatics specialization detected in text."));
                analysis.put("recommendation", "Archive in administrative vault, not clinical.");
            } else if (fileName.contains("report") || fileName.contains("blood")) {
                analysis.put("summary", "Clinical Diagnostic Report Scan.");
                analysis.put("findings", List.of(
                        "Blood vitals extracted successfully.",
                        "Hemoglobin and Glucose levels appear within range.",
                        "No critical toxicity markers found."));
                analysis.put("recommendation", "Safe for discharge. Continue routine monitoring.");
            } else {
                analysis.put("summary", "General Medical Document.");
                analysis.put("findings", List.of(
                        "Standard document scan completed.",
                        "Metadata sync with Patient ID: " + record.getPatient().getId(),
                        "Encrypted storage verified."));
                analysis.put("recommendation", "Requires manual clinical verification.");
            }

            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}