package com.husksheets_api_server_scrumlords.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.Serializable;

@Entity
public class Publisher implements Serializable {

    @Getter
    @Setter
    private String username;

    @Getter
    @Setter
    private String password;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private Boolean isRegistered;

    public Publisher() {
        this.isRegistered = false;
    }

    public void setPassword(String password) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        this.password = passwordEncoder.encode(password);
    }
}
