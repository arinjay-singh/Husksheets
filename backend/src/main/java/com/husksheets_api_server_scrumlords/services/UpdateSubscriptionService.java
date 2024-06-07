package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Update Subscription Service class
 * Author: Nicholas O'Sullivan, Parnika Jain
 */
@Service
public class UpdateSubscriptionService {

    /**
     * Update subscription for the given publisher and sheet with the passed in payload.
     *
     * @param requestPublisher the publisher which owns the sheet we edit subscription for.
     * @param requestSheet the sheet to update the subscription for.
     * @param requestPayload the payload to update the subscription with.
     * @return A response with the result of the update.
     */
    public Response updateSubscription(String requestPublisher, String requestSheet, String requestPayload) {
        Map<Sheet, Response> validationResponse = ValidationUtils.validatePublisherAndSheet(
                requestPublisher, requestSheet);
        if (validationResponse.containsKey(null)) {
            return validationResponse.get(null);
        }
        if (!ValidationUtils.validatePayload(requestPayload).isSuccess()) {
            return ValidationUtils.validatePayload(requestPayload);
        }
        Sheet userSheet = validationResponse.keySet().iterator().next();
        userSheet.addNewUpdatePublished(requestPayload);
        return new Response(true, null);
    }
}
