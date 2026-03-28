package com.ankit.vitalsync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "medical_records")
@Data
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;

    @Lob
    @Column(name = "data")
    @JsonIgnore // 🔥 List fetch karte waqt heavy binary data skip hoga taaki connection break
                // na ho
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnore // Infinite loop se bachne ke liye patient object ko ignore kiya list mein
    private Patient patient;

    // Default Constructor
    public MedicalRecord() {
    }

    // Getters and Setters (Lombok @Data handles this, but adding explicitly if
    // needed)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}