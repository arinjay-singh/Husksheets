package com.husksheets_api_server_scrumlords.controllers;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.requests.AbstractPublisherRequest;
import com.husksheets_api_server_scrumlords.requests.UpdatePublishedRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpdateController {

    private final Publishers publishers;

    public UpdateController() {
        this.publishers = Publishers.getInstance();
    }

    @PostMapping("api/v1/updatePublished")
    public Response updateSheet(@RequestBody UpdatePublishedRequest request) {
        authCheck(request);

    }

    private Response authCheck(AbstractPublisherRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Publisher publisher = publishers.getPublisher(username);
        if (!username.equals(request.getPublisher()) || publisher == null) {
            return new Response(false, "Unauthorized: sender is not owner of sheet");
        }
        return null;
    }

}
