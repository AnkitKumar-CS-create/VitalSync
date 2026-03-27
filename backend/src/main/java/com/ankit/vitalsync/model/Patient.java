package com.ankit.vitalsync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

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
    private LocalDateTime lastUpdate; // Time record karne ke liye
}