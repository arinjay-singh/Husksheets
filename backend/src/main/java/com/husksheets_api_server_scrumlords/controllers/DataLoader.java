package com.husksheets_api_server_scrumlords.controllers;


import com.husksheets_api_server_scrumlords.repositories.PublisherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.husksheets_api_server_scrumlords.models.Publisher;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private PublisherRepository publisherRepository;

    @Override
    public void run(String... args) throws Exception {
        List<Publisher> publishers = (List<Publisher>) publisherRepository.findAll();
        if (publishers.size() == 0) {
            Publisher admin = new Publisher();
            admin.setUsername("Admin");
            admin.setPassword("0123");
            publisherRepository.save(admin);
        }
    }
}
