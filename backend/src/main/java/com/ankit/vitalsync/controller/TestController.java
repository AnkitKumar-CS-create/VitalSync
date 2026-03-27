package com.ankit.vitalsync.controller; // Apna sahi package name likhna yahan

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Frontend (Vite) ko allow karne ke liye
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Connected to Spring Boot! 🚀";
    }
}