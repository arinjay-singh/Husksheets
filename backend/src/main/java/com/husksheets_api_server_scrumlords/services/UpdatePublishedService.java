package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.*;
import org.springframework.stereotype.Service;

/**
 * Update Published Service class
 * Authors: Nicholas O'Sullivan, Parnika Jain
 */
@Service
public class UpdatePublishedService {

    public Response updatePublished(String requestPublisher, String requestSheet, String requestPayload) {
        Publishers publishers = Publishers.getInstance();
        Publisher publisher = publishers.getPublisher(requestPublisher);
        if (publisher == null) {
            return new Response(false, "Publisher not found: " + requestPublisher);
        }
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> requestSheet.equals(s.getSheetName())).findAny().orElse(null);
        if (userSheet == null) {
            return new Response(false, "Sheet not found:" + requestPublisher +
                    "/" + requestSheet);
        } else {
            userSheet.addNewUpdateSubscription(requestPayload);
            return new Response(true, null);
        }
    }
}
