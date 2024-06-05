package com.husksheets_api_server_scrumlords.controllers;

import com.husksheets_api_server_scrumlords.models.*;
import com.husksheets_api_server_scrumlords.requests.UpdateRequest;
import com.husksheets_api_server_scrumlords.services.UpdatePublishedService;
import com.husksheets_api_server_scrumlords.services.UpdateSubscriptionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/*
Update sheet APIs
author: Parnika Jain, Nicholas O'Sullivan
 */
@RestController
public class UpdateController {
    private final UpdatePublishedService updatePublishedService; //inject service
    private final UpdateSubscriptionService updateSubscriptionService;
    private final Publishers publishers;

    public UpdateController(UpdatePublishedService updatePublishedService, UpdateSubscriptionService updateSubscriptionService) {
        this.updatePublishedService = updatePublishedService;
        this.updateSubscriptionService = updateSubscriptionService;
        this.publishers = Publishers.getInstance();
    }

    /**
     * Update the payload of a sheet directly from the publisher themselves in a request.
     *
     * @param request the body of the request given to the server.
     * @return Success response or failure with a message why it failed.
     */
    @PostMapping("api/v1/updatePublished")
    public Response updatePublished(@RequestBody UpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String owner = request.getPublisher();
        if (!owner.equals(username)) { //ensure connected user is the owner of the sheet.
            return new Response(false, "Unauthorized: sender is not owner of sheet");
        }
        return updatePublishedService.updatePublished(username, request.getPublisher(),
                request.getSheet(),
                request.getPayload());
    }

    /**
     * Makes a request to update the payload of a sheet from someone who isn't the publisher.
     *
     * @param request the body of the request given to the server.
     * @return Success response or failure with a message why it failed.
     */
    @PostMapping("api/v1/updateSubscription")
    public Response updateSubscription(@RequestBody UpdateRequest request) {
        String owner = request.getPublisher();
        Publisher publisher = publishers.getPublisher(owner);
        if (publisher == null) {
            return new Response(false, "Not found:" + request.getPublisher() +
                    "/" + request.getSheet());
        }
        return updateSubscriptionService.updateSubscription(publisher,
                request.getSheet(),
                request.getPublisher(),
                request.getPayload());
    }


}
