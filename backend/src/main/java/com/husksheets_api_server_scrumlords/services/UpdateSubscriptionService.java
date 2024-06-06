package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;
import org.springframework.stereotype.Service;

/**
 * Update Subscription Service class
 * Author:  Nicholas O'Sullivan, Parnika Jain
 */
@Service
public class UpdateSubscriptionService {
    public Response updateSubscription(String requestPublisher, String requestSheet, String requestPayload) {
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
            userSheet.addNewUpdatePublished(requestPayload);
            return new Response(true, null);
        }
    }

}
