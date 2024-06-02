package com.husksheets_api_server_scrumlords.controllers;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;
import com.husksheets_api_server_scrumlords.repositories.PublisherRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/v1/")
public class PublisherController {
    private PublisherRepository publisherRepo;

    public PublisherController(PublisherRepository publisherRepo) {
        this.publisherRepo = publisherRepo;
    }

    @GetMapping("getPublisher")
    public Response getPublishers() {
        List<Publisher> publishers = (List<Publisher>) publisherRepo.findAll();

        List<Publisher> verifiedPublishers = publishers.stream()
                                                       .filter(Publisher::getIsRegistered)
                                                       .toList();
        ArrayList<Value> values = new ArrayList<>();
        for (int i = 0; i <= verifiedPublishers.size(); i++) {
            values.add(new Value(verifiedPublishers.get(i)));
        }

        return new Response(values);
    }



    @GetMapping("register")
    public Response registerPublisher() {
        Response response = new Response(values);

        response.setSuccess();
    }
}
