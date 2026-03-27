package com.ankit.vitalsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Ye line add karni hai bas
public class VitalsyncApplication {
    public static void main(String[] args) {
        SpringApplication.run(VitalsyncApplication.class, args);
    }
}