package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;
import org.springframework.stereotype.Service;

/**
 * Update Subscription Service class
 * Author:  Nicholas O'Sullivan, Parnika Jain
 */
@Service
public class UpdateSubscriptionService {
    public Response updateSubscription(Publisher publisher, String requestSheet, String requestPublisher, String requestPayload) {
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> requestSheet.equals(s.getSheet())).findAny().orElse(null);
        if (userSheet == null) {
            return new Response(false, "Not found:" + requestPublisher +
                    "/" + requestSheet);
        } else {
            //userSheet.setPayload(requestPayload);
            return new Response(true, null);
        }
    }

}
