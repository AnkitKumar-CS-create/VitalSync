package com.ankit.vitalsync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int age;
    private String bloodGroup;
    private double lastHeartRate;
    private double lastOxygenLevel;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdate;

    // 🔥 YE ADD KARNA ZAROORI HAI: Relationship with MedicalRecord
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Taaki JSON infinite loop mein na fanse
    private List<MedicalRecord> records;

    // PrePersist taaki naya patient bante waqt time automatic set ho jaye
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdate = LocalDateTime.now();
    }
}