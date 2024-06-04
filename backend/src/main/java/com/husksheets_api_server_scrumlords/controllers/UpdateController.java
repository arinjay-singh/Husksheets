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
    public Response updateSheet(@RequestBody UpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Publisher publisher = publishers.getPublisher(username);
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> request.getSheet().equals(s.getSheet())).findAny().orElse(null);
        Response check = checkAuthSheet(username, request, userSheet);
        if (check != null) {
            return check;
        }
        else {
            //assert userSheet != null;
            userSheet.setPayload(request.getPayload());
            return new Response(true, null);
        }
    }

    @PostMapping("api/v1/updateSubscription")
    public Response updateSubscription(@RequestBody UpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Publisher publisher = publishers.getPublisher(username);
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> request.getSheet().equals(s.getSheet())).findAny().orElse(null);
        Response check = checkAuthSheet(username, request, userSheet);
        if (check != null) {
            return check;
        }
        else {
            //something goes here for sheet update
            return new Response(true, null);
        }
    }

    private Response checkAuthSheet(String authUsername, UpdateRequest request, Sheet userSheet) {
        if (!authUsername.equals(request.getPublisher()) || userSheet == null) {
            return new Response(false, "Not found:" + request.getPublisher() +
                    "/" + request.getSheet());
        }
        else return null;
    }

}
