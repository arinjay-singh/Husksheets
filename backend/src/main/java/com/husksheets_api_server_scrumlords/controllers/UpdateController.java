package com.husksheets_api_server_scrumlords.controllers;

import com.husksheets_api_server_scrumlords.models.*;
import com.husksheets_api_server_scrumlords.requests.AbstractPublisherRequest;
import com.husksheets_api_server_scrumlords.requests.GetUpdatesRequest;
import com.husksheets_api_server_scrumlords.requests.UpdateRequest;
import com.husksheets_api_server_scrumlords.services.GetUpdatesService;
import com.husksheets_api_server_scrumlords.services.UpdatePublishedService;
import com.husksheets_api_server_scrumlords.services.UpdateSubscriptionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
Update sheet APIs constructor
@author Nicholas O'Sullivan
 */
@RestController
public class UpdateController {
    private final UpdatePublishedService updatePublishedService; //inject service
    private final UpdateSubscriptionService updateSubscriptionService;
    private final GetUpdatesService getUpdatesService;
    private final Publishers publishers;

    public UpdateController(UpdatePublishedService updatePublishedService,
                            UpdateSubscriptionService updateSubscriptionService, GetUpdatesService getUpdatesService) {
        this.updatePublishedService = updatePublishedService;
        this.updateSubscriptionService = updateSubscriptionService;
        this.getUpdatesService = getUpdatesService;
        this.publishers = Publishers.getInstance();
    }

    /**
     * Update the payload of a sheet directly from the publisher themselves in a request.
     * @author: Nicholas O'Sullivan
     * @param request the body of the request given to the server.
     * @return Success response or failure with a message why it failed.
     */
    @PostMapping("api/v1/updatePublished")
    public Response updatePublished(@RequestBody UpdateRequest request) {
        Response response = publishedVerification(request);
        return response != null ? response : updatePublishedService.updatePublished(
                request.getPublisher(),
                request.getSheet(),
                request.getPayload());
    }

    /**s
     * @param request the body of the request given to the server.
     * @return returns a response with the payload set to all updates called by Publisher
     * @author Nicholas O'Sullivan
     */
    @PostMapping("api/v1/getUpdatesForSubscription")
    public Response getUpdatesForSubscription(@RequestBody GetUpdatesRequest request) {
        return getUpdatesService.getUpdates(
                request.getPublisher(), request.getSheet(), request.getId(), GetUpdatesService.UpdateType.SUBSCRIPTION);
    }

    /**
     * Makes a request to update the payload of a sheet from someone who isn't the publisher.
     *
     * @param request the body of the request given to the server.
     * @return Success response or failure with a message why it failed.
     */
    @PostMapping("api/v1/updateSubscription")
    public Response updateSubscription(@RequestBody UpdateRequest request) {
        return updateSubscriptionService.updateSubscription(
                request.getPublisher(),
                request.getSheet(),
                request.getPayload());
    }

    /**
     * @author Nicholas O'Sullivan
     * @param request the body of the request given to the server.
     * @return returns a response with the payload set to all updates called by Publisher
     */
    @PostMapping("api/v1/getUpdatesForPublished")
    public Response getUpdatesForPublished(@RequestBody GetUpdatesRequest request) {
        Response response = publishedVerification(request);
        return response != null ? response : getUpdatesService.getUpdates(
                request.getPublisher(), request.getSheet(), request.getId(),
                GetUpdatesService.UpdateType.PUBLISHED);
    }

    /**
     * Check if the publisher is the owner of the sheet.
     * @author Kaan Tural
     * @param request the request to check.
     * @return a response if the publisher is not the owner of the sheet, null if they are.
     */
    public Response publishedVerification(AbstractPublisherRequest request) {
        if (request.getPublisher() == null) {
            return new Response(false, "Publisher is null");
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String owner = request.getPublisher();
        return !owner.equals(username) ? new Response(false,
                "Unauthorized: sender is not owner of sheet") : null;
    }
}
