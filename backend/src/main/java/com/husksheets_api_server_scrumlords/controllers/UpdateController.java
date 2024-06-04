package com.husksheets_api_server_scrumlords.controllers;

import com.husksheets_api_server_scrumlords.models.*;
import com.husksheets_api_server_scrumlords.requests.UpdateRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/*
Update sheet APIs
author: Parnika Jain
 */
@RestController
public class UpdateController {

    private final Publishers publishers;

    public UpdateController() {
        this.publishers = Publishers.getInstance();
    }

    @PostMapping("api/v1/updatePublished")
    public Response updatePublished(@RequestBody UpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String owner = request.getPublisher();
        if (!owner.equals(username)) {
            return new Response(false, "Unauthorized: sender is not owner of sheet");
        }
        Publisher publisher = publishers.getPublisher(username);
        if (publisher == null) {
            return new Response(false, "Not found:" + request.getPublisher() +
                    "/" + request.getSheet());
        }
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> request.getSheet().equals(s.getSheet())).findAny().orElse(null);
        if (userSheet == null) {
            return new Response(false, "Not found:" + request.getPublisher() +
                    "/" + request.getSheet());
        } else {
            userSheet.setPayload(request.getPayload());
            return new Response(true, null);
        }
    }

    @PostMapping("api/v1/updateSubscription")
    public Response updateSubscription(@RequestBody UpdateRequest request) {
        String owner = request.getPublisher();
        Publisher publisher = publishers.getPublisher(owner);
        if (publisher == null) {
            return new Response(false, "Not found:" + request.getPublisher() +
                    "/" + request.getSheet());
        }
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> request.getSheet().equals(s.getSheet())).findAny().orElse(null);
        if (userSheet == null) {
            return new Response(false, "Not found:" + request.getPublisher() +
                    "/" + request.getSheet());
        } else {
            userSheet.setPayload(request.getPayload());
            return new Response(true, null);
        }
    }
}
